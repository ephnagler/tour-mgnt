import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { createContact } from "~/models/tour.server";
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
  const role = tm.parse(formData.get("role"));
  const phone = tm.parse(formData.get("phone"));
  const email = tm.parse(formData.get("email"));
  const venueEntry = tmNull.parse(formData.get("venue"));
  const venue = venueEntry === "default" ? undefined : venueEntry;
  const daysheetEntry = tmNull.parse(formData.get("daysheet"));
  const daysheet = daysheetEntry === "default" ? undefined : daysheetEntry;

  const contact = await createContact(
    slug,
    name,
    role,
    phone,
    email,
    venue,
    daysheet
  );

  return redirect(`/admin/contacts/${contact.slug}`);
};

export default function ContactsIndex() {
  const data = useLoaderData<typeof loader>();
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname === "/admin/contacts") {
      nameRef.current?.focus();
    }
  });

  return (
    <Form method="post">
      <h2 className="mt-0">New Contact</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
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
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Role</span>
            <input
              type="text"
              name="role"
              className="grow"
              placeholder="Role"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Phone</span>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Email</span>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="grow"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="venue"
              className="select select-bordered w-full max-w-xs"
              defaultValue="default"
            >
              <option disabled value="default">
                Venue
              </option>
              {data.venues.map((venue) => (
                <option value={venue.id} key={venue.id}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
            <select
              name="daysheet"
              className="select select-bordered w-full max-w-xs"
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
          </div>
        </fieldset>

        <div className="divider" />

        <button type="submit" className="btn">
          Submit Contact
        </button>
      </fieldset>
    </Form>
  );
}
