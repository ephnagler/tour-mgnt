import {
  ActionFunctionArgs,
  json,
  MetaFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
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

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(name);
  const party = tmInt.parse(formData.get("party"));
  const daysheet = tm.parse(formData.get("daysheet"));

  const guestId = tm.parse(formData.get("guestId"));
  const guestSlug = tm.parse(formData.get("guestSlug"));
  const guestName = tm.parse(formData.get("guestName"));
  const guestNewSlug = Slugify(guestName);
  const guestParty = tmInt.parse(formData.get("guestParty"));

  const { _action } = Object.fromEntries(formData);

  if (_action === "add") {
    await createGuest(slug, name, party, daysheet);
  }

  if (_action === "edit") {
    return redirect(`?edit=${guestSlug}`);
  }

  if (_action === "cancel") {
    return redirect(`?reset`);
  }

  if (_action === "save") {
    await prisma.guest.update({
      where: { id: guestId },
      data: {
        slug: guestNewSlug,
        name: guestName,
        party: guestParty,
      },
    });
    return redirect(`?saved`);
  }

  if (_action === "delete") {
    await deleteGuest({ slug: guestSlug });
  }

  return null;
}

export default function Index() {
  const data = useLoaderData<typeof loader>();

  const location = useLocation();
  const navigate = useNavigate();

  const partySpots = data.guests.reduce((n, { party }) => n + party, 0);
  const spotsLeft = data.daysheet?.guestsLimit
    ? data.daysheet?.guestsLimit - partySpots - data.guests.length
    : "";

  // const user = useOptionalUser();
  return (
    <main className="container p-6">
      {data.daysheet ? (
        <>
          <Summary daysheet={data.daysheet}></Summary>
          <Information
            venue={data.daysheet?.venue ? data.daysheet?.venue : undefined}
            hotel={data.daysheet?.hotel ? data.daysheet?.hotel : undefined}
          />
          <Schedule schedules={data.daysheet?.schedules} />
          <section id="guest-list" className="container prose">
            <h2>Guest List</h2>
            <div className="flex w-full flex-col">
              <div className="card grid rounded-box bg-base-300 px-8">
                <h3>
                  {data.daysheet?.venue?.name}
                  {spotsLeft ? (
                    <>
                      <span className="text-primary">{spotsLeft}</span> tickets
                      left
                    </>
                  ) : (
                    ""
                  )}
                </h3>
                <div className="overflow-x-auto">
                  <ul className="p-0">
                    {data.guests?.map((guest, index) => (
                      <Form
                        key={
                          location.search.includes("reset")
                            ? `reset-${guest.id}`
                            : guest.id
                        }
                        method="POST"
                        preventScrollReset={true}
                        onChange={() =>
                          navigate(`?edit=${guest.slug}?updating=true`, {
                            preventScrollReset: true,
                          })
                        }
                      >
                        <li
                          key={guest.id}
                          className="mb-0 mt-0 grid grid-cols-10 items-center gap-4 border-b-[1px] border-base-content/20 p-4"
                        >
                          <input
                            type="hidden"
                            name="guestId"
                            value={guest.id}
                          />
                          <input
                            type="hidden"
                            name="guestSlug"
                            value={guest.slug}
                          />
                          <div className="pl-2">{index + 1}</div>
                          <div className="col-span-5">
                            <input
                              type="text"
                              name="guestName"
                              defaultValue={guest.name}
                              disabled={
                                !location.search.includes(`?edit=${guest.slug}`)
                              }
                              className="input input-bordered w-full bg-base-300 disabled:bg-base-300 disabled:text-base-content"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="input input-bordered grid grid-cols-4 items-center gap-2 !bg-base-300">
                              <span className="col-span-3 !text-base-content">
                                Comps
                              </span>
                              <input
                                type="number"
                                defaultValue={guest.party}
                                disabled={
                                  !location.search.includes(
                                    `?edit=${guest.slug}`,
                                  )
                                }
                                name="guestParty"
                                className="disabled:text-base-content"
                              />
                            </label>
                          </div>
                          <div className="col-span-2 grid w-full grid-cols-3 gap-2">
                            <button
                              className="btn btn-outline w-full"
                              name="_action"
                              value={
                                location.search.includes(`?edit=${guest.slug}`)
                                  ? "cancel"
                                  : "edit"
                              }
                            >
                              {location.search.includes(`?edit=${guest.slug}`)
                                ? "Cancel"
                                : "Edit"}
                            </button>
                            <button
                              className="btn btn-outline w-full"
                              name="_action"
                              value="save"
                              disabled={
                                location.search.includes("updating")
                                  ? false
                                  : true
                              }
                            >
                              Save
                            </button>
                            <button
                              disabled={
                                location.search.includes(`?edit=${guest.slug}`)
                                  ? false
                                  : true
                              }
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
                      <li className="mt-8 grid grid-cols-9 items-center gap-2 rounded-xl bg-base-200 px-4 py-2">
                        <div>
                          <ChevronRightIcon />
                        </div>
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
                            <span className="col-span-3">
                              Additional Guests
                            </span>
                            <input
                              type="number"
                              defaultValue={0}
                              name="party"
                            />
                          </label>
                        </div>
                        <div className="col-span-2 flex items-center justify-end gap-4">
                          <button
                            className="btn btn-outline"
                            type="submit"
                            name="_action"
                            value="add"
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
        </>
      ) : (
        <div className="h-screen flex items-center justify-center prose">
        <h1>No Daysheets today.</h1></div>
      )}
    </main>
  );
}
