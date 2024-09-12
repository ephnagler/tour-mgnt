import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useLocation,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

import { prisma } from "~/db.server";
import { getSchedule } from "~/models/tour.server";
import { Slugify } from "~/utils";

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <div>
      <h1>Error</h1>
      <p>Please try again.</p>
    </div>
  );
}

const tm = z.string();
const tmNull = z.string().nullable();

interface ActionData {
  status: "reset" | "saved" | "view" | null;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Schedule not found");

  const schedule = await getSchedule({ slug: params.slug });

  const daysheets = await prisma.daysheet.findMany({
    select: { id: true, slug: true, date: true, venue: true },
  });

  if (!schedule) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ schedule, daysheets });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = tm.parse(formData.get("id"));
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const note = tm.parse(formData.get("note"));
  const timeFrom = tm.parse(formData.get("timeFrom"));
  const timeTo = tm.parse(formData.get("timeTo"));

  const daysheetEntry = tmNull.parse(formData.get("daysheet"));
  const daysheet = daysheetEntry === "default" ? undefined : daysheetEntry;

  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return json({ status: "reset" });
  }

  if (_action === "save") {
    await prisma.schedule.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        name,
        note,
        timeFrom,
        timeTo,
        daysheet: daysheet
          ? {
              connect: {
                id: daysheet,
              },
            }
          : undefined,
      },
    });

    return redirect(`/admin/schedules/${slug}?saved`);
  }
};

export default function AdminSchedules() {
  const actionData = useActionData<ActionData | null>();
  const data = useLoaderData<typeof loader>();
  const [formChanged, setFormChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();

  const daysheetState = data.schedule.daysheet
    ? data.schedule.daysheet.id
    : "default";

  const [selectedDaysheet, setSelectedDaysheet] = useState(daysheetState);

  const handleInputChange = () => {
    setFormChanged(true);
  };

  useEffect(() => {
    if (
      actionData?.status === "reset" ||
      location.search == "?reset" ||
      location.search == "?edit"
    ) {
      formRef.current?.reset();
      setFormChanged(false);
    }
  }, [actionData, location.search]);

  useEffect(() => {
    if (location.search === "?saved") {
      setFormChanged(false);
    }
  }, [location.search]);

  useEffect(() => {
    setSelectedDaysheet(daysheetState);
    setFormChanged(false);
  }, [daysheetState]);

  return (
    <Form method="post" ref={formRef}>
      <h2 className="mt-0">New Schedule</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <input type="hidden" name="id" value={data.schedule.id} />
              <label htmlFor="timeFrom">From</label>
              <input
                type="datetime-local"
                name="timeFrom"
                onChange={handleInputChange}
                defaultValue={data.schedule.timeFrom}
                className="input input-bordered grow"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="timeTo">To</label>
              <input
                type="datetime-local"
                name="timeTo"
                defaultValue={data.schedule.timeTo}
                onChange={handleInputChange}
                className="input input-bordered grow"
              />
            </div>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Name</span>
            <input
              type="text"
              name="name"
              defaultValue={data.schedule.name}
              onChange={handleInputChange}
              className="grow"
              placeholder="Name"
              required
            />
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Note"
            name="note"
            defaultValue={data.schedule.note}
            onChange={handleInputChange}
          ></textarea>

          <select
            name="daysheet"
            onChange={(e) => {
              handleInputChange();
              setSelectedDaysheet(e.target.value);
            }}
            className="select select-bordered w-full"
            value={selectedDaysheet}
          >
            <option value="default" disabled>
              Daysheet
            </option>
            {data.daysheets.map((daysheet) => (
              <option value={daysheet.id} key={daysheet.id}>
                {daysheet.date}
                {daysheet.venue ? " - " + daysheet.venue.name : ""}
              </option>
            ))}
          </select>
        </fieldset>

        <div className="divider" />

        <fieldset
          disabled={!formChanged}
          className="grid w-full grid-cols-2 gap-4"
        >
          <button type="submit" name="_action" value="reset" className="btn">
            Cancel
          </button>
          <button type="submit" name="_action" value="save" className="btn">
            Save
          </button>
        </fieldset>
      </fieldset>
    </Form>
  );
}
