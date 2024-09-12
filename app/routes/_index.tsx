import { MetaFunction } from "@remix-run/node";

import Drive from "~/components/drive";
import GuestList from "~/components/guestlist";
import Information from "~/components/information";
import Schedule from "~/components/schedule";
import Summary from "~/components/summary";
import Upcoming from "~/components/upcoming";

export const meta: MetaFunction = () => [{ title: "Suuns West Coast Tour Winter 2024" }];

export default function Index() {
  return (
    <main className="container">
      <Summary />
      <Drive />
      <Information />
      <Schedule />
      <GuestList />
      <Upcoming />
    </main>
  );
}
