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
  useNavigate,
  useRouteError,
} from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
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

interface ActionData {
  status: "reset" | "saved" | "view" | null;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Daysheet not found");

  const daysheet = await getDaysheet({ slug: params.slug });
  const venues = await prisma.venue.findMany({
    select: { id: true, name: true, city: true },
  });
  const hotels = await prisma.hotel.findMany({
    select: { id: true, name: true, city: true },
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
  const venueDisconnect = venue === "default" ? false : true;
  const hotel = tm.parse(formData.get("hotel"));
  const hotelDisconnect = hotel === "default" ? false : true;


  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return json({ status: "reset" });
  }

  if (_action === "save") {
    await prisma.daysheet.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        date,
        venue: {
          ...venueDisconnect ? {connect: {id: venue}} : {disconnect: true},
        },
        hotel: {
          ...hotelDisconnect ? {connect: {id: hotel}} : {disconnect: true},
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
  const actionData = useActionData<ActionData | null>();
  const data = useLoaderData<typeof loader>();
  const [formChanged, setFormChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const venueState = data.daysheet.venue ? data.daysheet.venue.id : "default";
  const hotelState = data.daysheet.hotel ? data.daysheet.hotel.id : "default";

  const [selectedVenue, setSelectedVenue] = useState(venueState);
  const [selectedHotel, setSelectedHotel] = useState(hotelState);
  const [isBuyOut, setIsBuyOut] = useState(data.daysheet.buyOut);

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
  }, [location.search, navigate, data.daysheet.slug]);

  useEffect(() => {
    setSelectedVenue(venueState);
    setSelectedHotel(hotelState);
    setFormChanged(false);
  }, [venueState, hotelState]);

  useEffect(() => {
    setIsBuyOut(data.daysheet.buyOut);
  }, [data.daysheet.buyOut]);

  const handleInputChange = () => {
    setFormChanged(true);
  };

  return (
    <Form method="post" ref={formRef}>
      <h2 className="mt-0">Edit Daysheet: {data.daysheet.date}</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Daysheet</span>
            <input type="hidden" name="id" value={data.daysheet.id} />
            <input
              type="date"
              name="date"
              onChange={handleInputChange}
              defaultValue={data.daysheet.date}
              className="grow"
              required
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="venue"
              onChange={(e) => {
                handleInputChange();
                setSelectedVenue(e.target.value);
              }}
              value={selectedVenue}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="default">
                Venue
              </option>
              {data.venues.map((venue) => (
                <option value={venue.id} key={venue.id}>
                  {venue.name} - {venue.city}
                </option>
              ))}
            </select>
            <select
              name="hotel"
              onChange={(e) => {
                handleInputChange();
                setSelectedHotel(e.target.value);
              }}
              value={selectedHotel}
              className="select select-bordered w-full max-w-xs"
            >
              <option value="default">
                Hotel
              </option>
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
                  checked={isBuyOut}
                  className="checkbox"
                  onChange={(e) => {
                    setIsBuyOut(e.target.checked);
                    handleInputChange();
                  }}
                />
              </label>
            </div>
          </div>
          {isBuyOut ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Buyout Amount:</span>
              <input
                type="number"
                defaultValue={data.daysheet.buyOutAmount}
                name="buyOutAmount"
                onChange={handleInputChange}
                className="grow"
              />
            </label>
          ) : undefined}
          {!isBuyOut ? (
            <label className="input input-bordered col-span-3 flex items-center gap-2">
              <span>Dinner Alternative:</span>
              <input
                type="text"
                name="buyOutAlt"
                onChange={handleInputChange}
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
              onChange={handleInputChange}
              className="grow"
            />
          </label>
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
