import {
  ActionFunction,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { z } from "zod";

import Information from "~/components/information";
import Progress from "~/components/progress";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import { prisma } from "~/db.server";
import { createGuest, getDaysheet } from "~/models/tour.server";
import { Slugify } from "~/utils";

export const meta: MetaFunction = () => [
  { title: "Suuns West Coast Tour Winter 2024" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Daysheet not found");

  const daysheet = await getDaysheet({
    slug: params.slug,
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
};

const tm = z.coerce.string();
const tmInt = z.coerce.number();

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const name = tm.parse(formData.get("name"));
  const slug = Slugify(name);
  const party = tmInt.parse(formData.get("party"));
  const daysheet = tm.parse(formData.get("daysheet"));

  const guest = await createGuest(slug, name, party, daysheet);
  return json({ guest });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
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
              <Form key={data.daysheet?.id} method="POST">
                <table className="table">
                  <tbody>
                    {data.guests?.map((guest, index) => (
                      <tr
                        key={guest.id}
                        className="grid grid-cols-9 items-center"
                      >
                        <td>{index + 1}</td>
                        <td className="col-span-6">
                          {guest.name} +{guest.party}
                        </td>
                        <td className="col-span-2 flex justify-end gap-4">
                          <button className="btn btn-outline">Edit</button>
                          <button
                            disabled
                            className="btn btn-outline hover:bg-red-500 hover:text-white"
                          >
                            Delete
                          </button>
                        </td>
                        <td></td>
                      </tr>
                    ))}
                    <tr className="grid grid-cols-9 items-center">
                      <td>{data.daysheet?.guestsLimit}</td>
                      <td className="col-span-4">
                        <input
                          type="hidden"
                          name="daysheet"
                          value={data.daysheet?.id}
                        />
                        <input
                          type="text"
                          name="name"
                          placeholder="Guest's Name"
                          className="input w-full bg-base-300"
                        />
                      </td>
                      <td className="col-span-2">
                        <label className="input grid grid-cols-4 items-center gap-2 bg-base-300">
                          <span className="col-span-3">Additional Guests</span>
                          <input type="number" defaultValue={0} name="party" />
                        </label>
                      </td>
                      <td className="col-span-2 flex justify-end gap-4">
                        <button className="btn btn-outline" type="submit">
                          Save Guests
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Form>
            </div>
          </div>
        </div>
      </section>
      <Progress dates={data.daysheets} />
    </main>
  );
}
