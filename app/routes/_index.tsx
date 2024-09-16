import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import GuestList from "~/components/guestlist";
import Information from "~/components/information";
import Progress from "~/components/progress";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import { prisma } from "~/db.server";
import { getDaysheet } from "~/models/tour.server";
import { getTodaySlug } from "~/utils";

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
        select: { name: true }
      },
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
  });

  return json({ daysheet, daysheets });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  // const user = useOptionalUser();
  return (
    <main className="container p-6">
      <Summary
        city={data.daysheet?.venue?.city}
        venue={data.daysheet?.venue?.name}
      ></Summary>
      <Information venue={data.daysheet?.venue ? data.daysheet?.venue : undefined } hotel={data.daysheet?.hotel ? data.daysheet?.hotel : undefined} />
      <Schedule schedules={data.daysheet?.schedules} />
      <GuestList />
      <Progress dates={data.daysheets} />
    </main>
  );
}
