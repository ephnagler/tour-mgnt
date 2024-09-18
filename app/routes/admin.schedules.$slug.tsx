import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { z } from "zod";

import { prisma } from "~/db.server";
import { alertArray, alertTypes, getSchedule } from "~/models/tour.server";
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
const AlertEnum = z.enum(alertTypes);

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Schedule not found");

  const schedule = await getSchedule({ slug: params.slug });

  const daysheets = await prisma.daysheet.findMany({
    select: {
      id: true,
      slug: true,
      date: true,
      venue: { select: { name: true } },
    },
  });

  const alerts = alertArray;

  if (!schedule) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ schedule, daysheets, alerts });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = tm.parse(formData.get("id"));
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const alert = AlertEnum.parse(formData.get("alert"));
  const note = tm.parse(formData.get("note"));
  const timeFrom = tm.parse(formData.get("timeFrom"));
  const timeTo = tm.parse(formData.get("timeTo"));

  const daysheetEntry = tmNull.parse(formData.get("daysheet"));
  const daysheet = daysheetEntry === "default" ? undefined : daysheetEntry;

  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return redirect(`?reset`);
  }

  if (_action === "save") {
    await prisma.schedule.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        name,
        alert,
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
  const data = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const tm = z.string();

  useEffect(() => {
    if (location.search === "?reset") {
      formRef.current?.reset();
    }
  }, [location.search]);

  return (
    <Form
      method="post"
      ref={formRef}
      key={data.schedule.id}
      onChange={() => navigate(`?edit`)}
    >
      <h2 className="mt-0">New Schedule</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <input type="hidden" name="id" defaultValue={data.schedule.id} />
              <label htmlFor="timeFrom">From</label>
              <input
                type="datetime-local"
                name="timeFrom"
                defaultValue={data.schedule.timeFrom}
                className="input input-bordered grow"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="timeTo">To</label>
              <input
                type="datetime-local"
                name="timeTo"
                defaultValue={tm.parse(data.schedule.timeTo)}
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
              className="grow"
              placeholder="Name"
              required
            />
          </label>

          <select
            name="alert"
            className="select select-bordered w-full"
            defaultValue={data.schedule.alert}
          >
            {data.alerts.map((alert, index) => (
              <option key={index} value={alert}>
                Alert: {alert}
              </option>
            ))}
          </select>

          <textarea
            className="textarea textarea-bordered"
            placeholder="Note"
            name="note"
            defaultValue={data.schedule.note}
          ></textarea>

          <select
            name="daysheet"
            className="select select-bordered w-full"
            defaultValue={data.schedule.daysheet?.id}
          >
            <option value="default">Daysheet</option>
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
          disabled={location.search != "?edit"}
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
