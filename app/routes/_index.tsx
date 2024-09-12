import { json, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import Drive from "~/components/drive";
import GuestList from "~/components/guestlist";
import Information from "~/components/information";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import Upcoming from "~/components/upcoming";
import { getDaysheet } from "~/models/tour.server";

export const meta: MetaFunction = () => [
  { title: "Suuns West Coast Tour Winter 2024" },
];

const today = new Date();

export async function loader() {
  const daysheets = await getDaysheet({
    slug: today.toISOString().split("T")[0],
  });

  return json({ daysheets });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main className="container p-6">
      <Summary
        city={data.daysheets?.venue?.city}
        venue={data.daysheets?.venue?.name}
      >
        
      </Summary>
      <Drive />
      <Information />
      <Schedule />
      <GuestList />
      <Upcoming />
    </main>
  );
}
