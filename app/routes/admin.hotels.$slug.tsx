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
import { getHotel } from "~/models/tour.server";
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

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Hotel not found");

  const hotel = await getHotel({ slug: params.slug });

  if (!hotel) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ hotel });
};

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const id = tm.parse(formData.get("id"));
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(String(name));
  const phone = tm.parse(formData.get("phone"));
  const site = tm.parse(formData.get("site"));
  const email = tm.parse(formData.get("email"));
  const street = tm.parse(formData.get("street"));
  const city = tm.parse(formData.get("city"));
  const state = tm.parse(formData.get("state"));
  const zip = tm.parse(formData.get("zip"));

  const { _action } = Object.fromEntries(formData);

  if (_action === "reset") {
    return redirect(`?reset`);
  }

  if (_action === "save") {
    await prisma.hotel.update({
      where: { id: id, slug: params.slug },
      data: {
        slug,
        name,
        site,
        street,
        city,
        state,
        zip,
        phone,
        email,
      },
    });

    return redirect(`/admin/hotels/${slug}`);
  }
};

export default function AdminHotels() {
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
      key={data.hotel.id}
      onChange={()=>navigate(`?edit`)}
    >
      <h2 className="mt-0">Edit {data.hotel.name}</h2>
      <fieldset className="flex flex-col gap-2">
        <fieldset className="flex flex-col gap-4">
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">Hotel</span>
            <input type="hidden" name="id" value={data.hotel.id} />
            <input
              type="text"
              name="name"
              className="grow"
              defaultValue={data.hotel.name}
              placeholder="Hotel"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Phone</span>
              <input
                type="text"
                name="phone"
                className="grow"
                placeholder="Phone"
                defaultValue={data.hotel.phone}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Email</span>
              <input
                type="text"
                name="email"
                placeholder="Email"
                className="grow"
                defaultValue={data.hotel.email}
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
              defaultValue={data.hotel.site}
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
              className="grow"
              placeholder="Street"
              defaultValue={data.hotel.street}
            />
          </label>
          <label className="input input-bordered flex items-center gap-2">
            <span className="hidden">City</span>
            <input
              type="text"
              name="city"
              placeholder="City"
              className="grow"
              defaultValue={data.hotel.city}
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
                defaultValue={data.hotel.state}
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="hidden">Zipcode</span>
              <input
                type="text"
                name="zip"
                placeholder="Zipcode"
                className="grow"
                defaultValue={data.hotel.zip}
              />
            </label>
          </div>
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
