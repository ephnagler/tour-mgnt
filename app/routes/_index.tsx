import { ActionFunction, json, MetaFunction, redirect } from "@remix-run/node";
import { Form, useLoaderData, useLocation } from "@remix-run/react";
import { ChevronRightIcon } from "lucide-react";
import { z } from "zod";

import Information from "~/components/information";
import Progress from "~/components/progress";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import { prisma } from "~/db.server";
import { createGuest, deleteGuest, getDaysheet } from "~/models/tour.server";
import { getTodaySlug, Slugify } from "~/utils";

export const meta: MetaFunction = () => [
  { title: "Suuns West Coast Tour Winter 2024" },
];

export async function loader() {
  const daysheet = await getDaysheet({
    slug: getTodaySlug(),
  });

  const daysheets = await prisma.daysheet.findMany({
    select: {
      date: true,
      venue: {
        select: { name: true },
      },
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
  });

  const guests = await prisma.guest.findMany({
    where: { daysheetId: daysheet?.id },
  });

  return json({ daysheet, daysheets, guests });
}

const tm = z.coerce.string();
const tmInt = z.coerce.number();

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(name);
  const party = tmInt.parse(formData.get("party"));
  const daysheet = tm.parse(formData.get("daysheet"));

  const guestSlug = tm.parse(formData.get("guestSlug"));

  const { _action } = Object.fromEntries(formData);

  if (_action === "edit") {
    return redirect(`?edit=${guestSlug}`);
  }

  if (_action === "cancel") {
    return redirect("");
  }

  if (_action === "delete") {
    await deleteGuest({ slug: guestSlug });
    return json({ deleted: guestSlug });
  }

  if (_action === "save") {
    const guest = await createGuest(slug, name, party, daysheet);
    return json({ guest });
  }
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const location = useLocation();

  // const user = useOptionalUser();
  return (
    <main className="container p-6">
      <Summary daysheet={data.daysheet}></Summary>
      <Information
        venue={data.daysheet?.venue ? data.daysheet?.venue : undefined}
        hotel={data.daysheet?.hotel ? data.daysheet?.hotel : undefined}
      />
      <Schedule schedules={data.daysheet?.schedules} />
      <section id="guest-list" className="container prose">
        {" "}
        <h2>Guest List</h2>
        <div className="flex w-full flex-col">
          <div className="card grid rounded-box bg-base-300 px-8">
            <h3>
              {data.daysheet?.venue?.name} - {data.daysheet?.guestsLimit} spots
              left
            </h3>
            <div className="overflow-x-auto">
              <ul className="p-0">
                {data.guests?.map((guest, index) => (
                  <Form key={guest.id} method="POST" preventScrollReset={true}>
                    <li
                      key={guest.id}
                      className="grid grid-cols-9 items-center border-b-[1px] border-base-content/20 px-4 py-2"
                    >
                      <input
                        type="hidden"
                        name="guestSlug"
                        value={guest.slug}
                      />
                      <div className="pl-2">{index + 1}</div>
                      <div className="col-span-6 pl-4">
                        {guest.name} {guest.party > 0 ? " +" + guest.party : ""}
                      </div>
                      <div className="col-span-2 grid w-full grid-cols-3 gap-4">
                        <button
                          className="btn btn-outline w-full"
                          name="_action"
                          value={
                            location.search != `?edit=${guest.slug}`
                              ? "edit"
                              : "cancel"
                          }
                        >
                          {location.search != `?edit=${guest.slug}`
                            ? "Edit"
                            : "Cancel"}
                        </button>
                        <button
                          className="btn btn-outline w-full"
                          name="_action"
                          value={
                            location.search != `?edit=${guest.slug}`
                              ? "edit"
                              : "cancel"
                          }
                          disabled
                        >
Save
                        </button>
                        <button
                          disabled={location.search != `?edit=${guest.slug}`}
                          className="btn btn-outline w-full bg-red-950 hover:bg-red-500 hover:text-white"
                          name="_action"
                          value="delete"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  </Form>
                ))}
                <Form
                  key={data.daysheet?.id}
                  method="POST"
                  preventScrollReset={true}
                >
                  <li className="grid grid-cols-9 items-center gap-2 px-4 py-2 bg-base-200 rounded-xl">
                    <div><ChevronRightIcon/></div>
                    <div className="col-span-4">
                      <input
                        type="hidden"
                        name="daysheet"
                        value={data.daysheet?.id}
                      />
                      <input
                        type="text"
                        name="name"
                        placeholder="Guest's Name"
                        className="input input-bordered w-full bg-base-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="input input-bordered grid grid-cols-4 items-center gap-2 bg-base-300">
                        <span className="col-span-3">Additional Guests</span>
                        <input type="number" defaultValue={0} name="party" />
                      </label>
                    </div>
                    <div className="col-span-2 flex justify-end gap-4">
                      <button
                        className="btn btn-outline"
                        type="submit"
                        name="_action"
                        value="save"
                      >
                        Add Guests
                      </button>
                    </div>
                  </li>
                </Form>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Progress dates={data.daysheets} />
    </main>
  );
}
