import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { createDaysheet } from "~/models/tour.server";
import { Slugify } from "~/utils";

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  if (isRouteErrorResponse(error)) {
    return error;
  }
  return (
    <div>
      <h1>Error</h1>
      <p>Please try again.</p>
    </div>
  );
}

export async function loader() {
  const venues = await prisma.venue.findMany({
    select: { slug: true, name: true, city: true },
  });
  const hotels = await prisma.hotel.findMany({
    select: { slug: true, name: true, city: true },
  });

  return json({ venues, hotels });
}

const tm = z.coerce.string();
const tmNull = z.string().nullable();
const tmInt = z.coerce.number();
const tmBoo = z.coerce.boolean();

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const date = tm.parse(formData.get("date"));
  const slug = Slugify(date);
  const guestsLimit = tmInt.parse(formData.get("guestsLimit"));
  const buyOut = tmBoo.parse(formData.get("buyOut"));
  const buyOutAmount = tmInt.parse(formData.get("buyOutAmount"));
  const buyOutAlt = tm.parse(formData.get("buyOutAlt"));

  const venueEntry = tmNull.parse(formData.get("venue"));
  const venue = venueEntry === "default" ? undefined : venueEntry;

  const hotelEntry = tmNull.parse(formData.get("hotel"));
  const hotel = hotelEntry === "default" ? undefined : hotelEntry;

  const daysheet = await createDaysheet(
    slug,
    date,
    guestsLimit,
    buyOut,
    buyOutAmount,
    buyOutAlt,
    venue,
    hotel,
  );

  return redirect(`/admin/daysheets/${daysheet.slug}`);
};

export default function DaysheetsIndex() {
  const data = useLoaderData<typeof loader>();
  const dateRef = useRef<HTMLInputElement>(null);

  const [isFieldVisible, setIsFieldVisible] = useState(true);

  useEffect(() => {
    if (location.pathname === "/admin/daysheets") {
      dateRef.current?.focus();
    }
  });

  return (
    <Form method="post">
      <h2 className="mt-0">New Daysheet</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Date</span>
            <input
              type="date"
              name="date"
              className="grow"
              ref={dateRef}
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="venue"
              className="select select-bordered w-full max-w-xs"
              defaultValue="default"
            >
              <option value="default">
                Venue
              </option>
              {data.venues.map((venue) => (
                <option value={venue.slug} key={venue.slug}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
            <select
              name="hotel"
              className="select select-bordered w-full max-w-xs"
              defaultValue="default"
            >
              <option value="default">
                Hotel
              </option>
              {data.hotels.map((hotel) => (
                <option value={hotel.slug} key={hotel.slug}>
                  {hotel.name} - {hotel.city}
                </option>
              ))}
            </select>
          </div>
        </fieldset>

        <div className="divider" />

        <fieldset className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Buyout?</span>
                <input
                  type="checkbox"
                  name="buyOut"
                  defaultChecked
                  className="checkbox"
                  onChange={(e) => setIsFieldVisible(e.target.checked)}
                />
              </label>
            </div>
          </div>
          {isFieldVisible ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Buyout Amount:</span>
              <input
                type="number"
                defaultValue={15}
                name="buyOutAmount"
                className="grow"
              />
            </label>
          ) : (
            <input type="number" defaultValue={0} name="buyOutAmount" hidden />
          )}
          {isFieldVisible === false ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Dinner Alternative:</span>
              <input
                type="text"
                name="buyOutAlt"
                defaultValue="Dinner Provided"
                className="grow"
              />
            </label>
          ) : (
            <input type="text" defaultValue="" name="buyOutAlt" hidden />
          )}
          <label className="input input-bordered flex items-center gap-2">
            <span>Guest Limit:</span>
            <input
              type="number"
              defaultValue={20}
              name="guestsLimit"
              className="grow"
            />
          </label>
        </fieldset>

        <div className="divider" />

        <button type="submit" className="btn">
          Submit Daysheet
        </button>
      </fieldset>
    </Form>
  );
}
