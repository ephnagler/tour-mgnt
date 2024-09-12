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
import { getContact } from "~/models/tour.server";
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
  invariant(params.slug, "Contact not found");

  const contact = await getContact({ slug: params.slug });
  const venues = await prisma.venue.findMany({
    select: { id: true, slug:true , name: true, city: true },
  });
  const daysheets = await prisma.daysheet.findMany({
    select: { id: true, slug: true, date: true, venue: true },
  });

  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact, venues, daysheets });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = tm.parse(formData.get("id"));
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const role = tm.parse(formData.get("role"));
  const phone = tm.parse(formData.get("phone"));
  const email = tm.parse(formData.get("email"));
  const venueEntry = tmNull.parse(formData.get("venue"));
  const venue = venueEntry === "default" ? undefined : venueEntry;
  const daysheetEntry = tmNull.parse(formData.get("daysheet"));
  const daysheet = daysheetEntry === "default" ? undefined : daysheetEntry;

  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return json({ status: "reset" });
  }

  if (_action === "save") {
    await prisma.contact.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        name,
        role,
        phone,
        email,
        venue: venue
          ? {
              connect: {
                id: venue,
              },
            }
          : undefined,
        daysheet: daysheet
          ? {
              connect: {
                id: daysheet,
              },
            }
          : undefined,
      },
    });

    return redirect(`/admin/contacts/${slug}?saved`);
  }
};

export default function AdminContacts() {
  const actionData = useActionData<ActionData | null>();
  const data = useLoaderData<typeof loader>();
  const [formChanged, setFormChanged] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const venueState = data.contact.venue ? data.contact.venue.id : "default";
  const daysheetState = data.contact.daysheet
    ? data.contact.daysheet.id
    : "default";

  const [selectedVenue, setSelectedVenue] = useState(venueState);
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
  }, [location.search, navigate, data.contact.slug]);

  useEffect(() => {
    setSelectedVenue(venueState);
    setSelectedDaysheet(daysheetState);
    setFormChanged(false);
  }, [venueState, daysheetState]);

  return (
    <Form method="post" ref={formRef}>
      <h2 className="mt-0">New Contact</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <input type="hidden" name="id" value={data.contact.id} />
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Name</span>
            <input
              type="text"
              name="name"
              onChange={handleInputChange}
              className="grow"
              placeholder="Name"
              defaultValue={data.contact.name}
              required
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Role</span>
            <input
              type="text"
              name="role"
              onChange={handleInputChange}
              className="grow"
              placeholder="Role"
              defaultValue={data.contact.role}
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Phone</span>
              <input
                type="text"
                name="phone"
                onChange={handleInputChange}
                placeholder="Phone"
                defaultValue={data.contact.phone}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Email</span>
              <input
                type="text"
                name="email"
                onChange={handleInputChange}
                placeholder="Email"
                defaultValue={data.contact.email}
                className="grow"
              />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="venue"
              onChange={(e) => {
                handleInputChange();
                setSelectedVenue(e.target.value);
              }}
              className="select select-bordered w-full max-w-xs"
              value={selectedVenue}
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
              onChange={(e) => {
                handleInputChange();
                setSelectedDaysheet(e.target.value);
              }}
              className="select select-bordered w-full max-w-xs"
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
          </div>
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
