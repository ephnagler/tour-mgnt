import { Contact, Daysheet, Hotel, Schedule, Venue } from "@prisma/client";
import {
  MicVocalIcon,
  MoonIcon,
  PlayIcon,
  SunIcon,
  UsersIcon,
} from "lucide-react";

import { fullDayNames, fullMonthNames } from "~/utils";

interface VenueExtended extends Venue {
  contacts?: Contact[] | null;
}

interface DaysheetExtended extends Daysheet {
  venue?: VenueExtended | null;
  hotel?: Hotel | null;
  schedules?: Schedule[] | null;
}

interface Summary {
  daysheet?: DaysheetExtended | null;
}

export default function Summary(props: Summary) {
  const event = new Date(String(props.daysheet?.date));

  return (
    <section className="container prose">
      <div className="mb-2">
        {props.daysheet?.venue?.city}, {props.daysheet?.venue?.state}
      </div>
      <h1 className="flex w-full flex-col justify-between sm:flex-row">
        <span>{props.daysheet?.venue?.name}</span>
        <span className="text-2xl">
          {fullDayNames[event.getDay()]}, {fullMonthNames[event.getMonth()]}{" "}
          {props.daysheet?.date.slice(8)}, {event.getFullYear()}, 
        </span>
      </h1>

      <div className="shadow stats flex w-full flex-col bg-base-300 sm:grid sm:grid-cols-5">
        <div className="stat">
          <div className="stat-figure pt-3 text-accent">
            <SunIcon strokeWidth={2.5} />
          </div>
          <div className="stat-title">Drive to Venue</div>
          <div className="stat-value text-accent">3 hr</div>
          <div className="stat-desc">{props.venue ? props.venue : ""}</div>
        </div>

        <div className="stat">
          <div className="stat-figure pt-3 text-info">
            <MicVocalIcon strokeWidth={2.5} />
          </div>
          <div className="stat-title">Soundcheck</div>
          <div className="stat-value text-info">4:30</div>
          <div className="stat-desc">We have 1 hour.</div>
        </div>

        <div className="stat">
          <div className="stat-figure pt-3 text-info">
            <UsersIcon strokeWidth={2.5} />
          </div>
          <div className="stat-title">Doors at</div>
          <div className="stat-value text-info">8:00</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-figure pt-3 text-primary">
            <PlayIcon strokeWidth={2.5} />
          </div>
          <div className="stat-title">Set time</div>
          <div className="stat-value text-primary">11:00</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-title">Drive to Hotel</div>
          <div className="stat-value flex w-full items-center justify-between text-accent">
            <span>1 hr</span>
            <MoonIcon strokeWidth={2.5} />
          </div>
          <div className="stat-desc">Marriot</div>
        </div>
      </div>

      <div>{props.children}</div>
    </section>
  );
}
