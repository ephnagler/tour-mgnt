import { Contact, Daysheet, Hotel, Schedule, Venue } from "@prisma/client";
import { MicVocalIcon, PlayIcon, SunIcon, UsersIcon } from "lucide-react";
import { z } from "zod";

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
  const tm = z.string();
  const event = new Date(tm.parse(props.daysheet?.date));

  return (
    <section className="container prose">
      <div className="mb-2">
        {props.daysheet?.venue?.city}, {props.daysheet?.venue?.state}
      </div>
      <h1 className="flex w-full flex-col justify-between sm:flex-row">
        <span>{props.daysheet?.venue?.name}</span>
        <span className="text-2xl">
          {fullDayNames[event.getDay() + 1]}, {fullMonthNames[event.getMonth()]}{" "}
          {props.daysheet?.date.slice(8)}, {event.getFullYear()},
        </span>
      </h1>

      <div className="shadow stats flex w-full flex-col bg-base-300 sm:grid sm:grid-cols-4">
        {props.daysheet?.schedules?.map((schedule) => {
          let textStyle;
          let alertIcon;
          let displayAlert = false;
          switch (schedule.alert) {
            case "Travel":
              schedule.name === "Checkout"
                ? (displayAlert = true)
                : (displayAlert = false);
              textStyle = "text-accent";
              alertIcon = <SunIcon strokeWidth={2.5} />;
              break;
            case "Production":
              schedule.name === "Soundcheck"
                ? (displayAlert = true)
                : (displayAlert = false);
              textStyle = "text-secondary";
              alertIcon = <MicVocalIcon strokeWidth={2.5} />;
              break;
            case "Show":
              schedule.name === "Doors"
                ? (displayAlert = true)
                : (displayAlert = false);
              textStyle = "text-info";
              alertIcon = <UsersIcon strokeWidth={2.5} />;
              break;
            case "Performance":
              schedule.name === "Performance"
                ? (displayAlert = true)
                : (displayAlert = false);
              textStyle = "text-primary";
              alertIcon = <PlayIcon strokeWidth={2.5} />;
          }

          const result = displayAlert ? (
            <div className="stat" key={schedule.id}>
              <div className={`stat-figure pt-3 ${textStyle}`}>{alertIcon}</div>
              <div className="stat-title">{schedule.name}</div>
              <div className={`stat-value ${textStyle}`}>
                {schedule.timeFrom.slice(11)}
              </div>
              <div className="stat-desc">{schedule.note}</div>
            </div>
          ) : null;

          return result;
        })}
      </div>
    </section>
  );
}
