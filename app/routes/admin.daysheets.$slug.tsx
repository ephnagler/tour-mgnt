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
import { getDaysheet } from "~/models/tour.server";
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Daysheet not found");

  const daysheet = await getDaysheet({ slug: params.slug });
  const venues = await prisma.venue.findMany({
    select: { id: true, slug: true, name: true, city: true },
  });
  const hotels = await prisma.hotel.findMany({
    select: { id: true, slug: true, name: true, city: true },
  });

  if (!daysheet) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ daysheet, venues, hotels });
};

const tm = z.coerce.string();
const tmInt = z.coerce.number();
const tmBoo = z.coerce.boolean();

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = tm.parse(formData.get("id"));
  const date = tm.parse(formData.get("date"));
  const slug = Slugify(date);

  const guestsLimit = tmInt.parse(formData.get("guestsLimit"));
  const buyOut = tmBoo.parse(formData.get("buyOut"));
  const buyOutAmount = tmInt.parse(formData.get("buyOutAmount"));
  const buyOutAlt = tm.parse(formData.get("buyOutAlt"));

  const venue = tm.parse(formData.get("venue"));
  const hotel = tm.parse(formData.get("hotel"));

  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return redirect(`/admin/daysheets/${params.slug}?reset`);
  }

  if (_action === "save") {
    await prisma.daysheet.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        date,
        venue: {
          ...(venue != "default"
            ? { connect: { id: venue } }
            : { disconnect: true }),
        },
        hotel: {
          ...(hotel != "default"
            ? { connect: { id: hotel } }
            : { disconnect: true }),
        },
        guestsLimit,
        buyOut,
        buyOutAmount,
        buyOutAlt,
      },
    });

    return redirect(`/admin/daysheets/${slug}?saved`);
  }
};

export default function AdminDaysheets() {
  const data = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.search === "?reset") {
      formRef.current?.reset();
    }
  }, [location.search]);

  return (
    <Form
      method="post"
      ref={formRef}
      key={data.daysheet.slug}
      onChange={() => {
        navigate(`?edit`);
      }}
    >
      <h2 className="mt-0">Edit Daysheet: {data.daysheet.date}</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Daysheet</span>
            <input type="hidden" name="id" value={data.daysheet.id} />
            <input
              type="date"
              name="date"
              defaultValue={data.daysheet.date}
              className="grow"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="venue"
              defaultValue={data.daysheet.venue?.id}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="default">Venue</option>
              {data.venues.map((venue) => (
                <option value={venue.id} key={venue.id}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
            <select
              name="hotel"
              defaultValue={data.daysheet.hotel?.id}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="default">Hotel</option>
              {data.hotels.map((hotel) => (
                <option value={hotel.id} key={hotel.id}>
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
                  checked={data.daysheet.buyOut}
                  className="checkbox"
                />
              </label>
            </div>
          </div>
          {data.daysheet.buyOut ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Buyout Amount:</span>
              <input
                type="number"
                defaultValue={data.daysheet.buyOutAmount}
                name="buyOutAmount"
                className="grow"
              />
            </label>
          ) : undefined}
          {!data.daysheet.buyOut ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Dinner Alternative:</span>
              <input
                type="text"
                name="buyOutAlt"
                defaultValue={data.daysheet.buyOutAlt}
                className="grow"
              />
            </label>
          ) : undefined}
          <label className="input input-bordered flex items-center gap-2">
            <span>Guest Limit:</span>
            <input
              type="number"
              defaultValue={data.daysheet.guestsLimit}
              name="guestsLimit"
              className="grow"
            />
          </label>
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
