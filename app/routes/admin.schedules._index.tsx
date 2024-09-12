import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { createSchedule } from "~/models/tour.server";
import { Slugify } from "~/utils";

const tm = z.coerce.string();
const tmNull = z.string().nullable();

export async function loader() {
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true, city: true },
  });
  const daysheets = await prisma.daysheet.findMany({
    select: { id: true, slug: true, date: true, venue: true },
  });

  return json({ venues, daysheets });
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const note = tm.parse(formData.get("note"));
  const timeFrom = tm.parse(formData.get("timeFrom"));
  const timeTo = tm.parse(formData.get("timeTo"));

  const daysheetEntry = tmNull.parse(formData.get("daysheet"));
  const daysheet = daysheetEntry === "default" ? undefined : daysheetEntry;

  const schedule = await createSchedule(
    slug,
    name,
    note,
    timeFrom,
    timeTo,
    daysheet,
  );

  return redirect(`/admin/schedules/${schedule.slug}`);
};

export default function SchedulesIndex() {
  const data = useLoaderData<typeof loader>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname === "/admin/schedules") {
      nameRef.current?.focus();
    }
  });

  return (
    <Form method="post">
      <h2 className="mt-0">New Schedule</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="timeFrom">From</label>
              <input
                type="datetime-local"
                name="timeFrom"
                className="input input-bordered grow"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="timeTo">To</label>
              <input
                type="datetime-local"
                name="timeTo"
                className="input input-bordered grow"
              />
            </div>
          </div>
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Name</span>
            <input
              type="text"
              name="name"
              className="grow"
              placeholder="Name"
              ref={nameRef}
              required
            />
          </label>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Note"
            name="note"
          ></textarea>

          <select
            name="daysheet"
            className="select select-bordered w-full"
            defaultValue="default"
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

        <button type="submit" className="btn">
          Submit Schedule
        </button>
      </fieldset>
    </Form>
  );
}
