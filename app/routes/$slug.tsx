import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import GuestList from "~/components/guestlist";
import Information from "~/components/information";
import Progress from "~/components/progress";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import { prisma } from "~/db.server";
import { getDaysheet } from "~/models/tour.server";

export const meta: MetaFunction = () => [
  { title: "Suuns West Coast Tour Winter 2024" },
];

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.slug, "Hotel not found");

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

  if (!daysheet) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ daysheet, daysheets });
};

export default function Index() {
  const data = useLoaderData<typeof loader>();
  // const user = useOptionalUser();
  return (
    <main className="container p-6">
      <Summary
        city={data.daysheet?.venue?.city}
        venue={data.daysheet?.venue?.name}
      ></Summary>
      <Information />
      <Schedule schedules={data.daysheet?.schedules} />
      <GuestList />
      <Progress dates={data.daysheets} />
    </main>
  );
}
