import { ActionFunction, redirect } from "@remix-run/node";
import { Form, useRouteError } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";

import { createVenue } from "~/models/tour.server";
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const site = tm.parse(formData.get("site"));
  const phone = tm.parse(formData.get("phone"));
  const email = tm.parse(formData.get("email"));
  const street = tm.parse(formData.get("street"));
  const city = tm.parse(formData.get("city"));
  const state = tm.parse(formData.get("state"));
  const zip = tm.parse(formData.get("zip"));

  const venue = await createVenue(
    slug,
    name,
    site,
    street,
    city,
    state,
    zip,
    phone,
    email,
  );

  return redirect(`/admin/venues/${venue.slug}`);
};

export default function VenuesIndex() {
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (location.pathname === "/admin/venues") {
      nameRef.current?.focus();
    }
  });

  return (
    <Form method="post">
      <h2 className="mt-0">New Venue</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Venue</span>
            <input
              type="text"
              name="name"
              ref={nameRef}
              placeholder="Venue"
              className="grow"
              required
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
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Website</span>
            <input
              type="text"
              name="site"
              placeholder="Website"
              className="grow"
            />
          </label>
        </fieldset>

        <div className="divider" />

        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Street</span>
            <input
              type="text"
              name="street"
              placeholder="Street"
              className="grow"
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">City</span>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="grow"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">State</span>
              <input
                type="text"
                name="state"
                placeholder="State"
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Zipcode</span>
              <input
                type="text"
                name="zip"
                placeholder="Zipcode"
                className="grow"
              />
            </label>
          </div>
        </fieldset>

        <div className="divider" />

        <button type="submit" className="btn">
          Submit Venue
        </button>
      </fieldset>
    </Form>
  );
}
