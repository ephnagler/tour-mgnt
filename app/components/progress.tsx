import { MapPinCheckInsideIcon, MapPinIcon, TargetIcon } from "lucide-react";

import { getTodaySlug } from "~/utils";

interface Venue {
  name: string;
}

interface Daysheet {
  date: string;
  venue: Venue | null;
}

interface ProgressProps {
  dates: Daysheet[];
}

export default function Progress(props: ProgressProps) {
  const length = props.dates.length - 1;
  const today = getTodaySlug();

  return (
    <section className="container prose">
      <h2>Progress</h2>
      <ul
        id="progressContainer"
        className="timeline overflow-x-auto rounded-box bg-base-300 ps-0"
      >
        {props.dates.map((date, index) => (
          <li id={date.date} key={date.date} className="w-[250px] grow">
            {index == 0 ? undefined : today == date.date ? (
              <hr className="bg-gradient-to-r from-info to-accent" />
            ) : today < date.date ? (
              <hr className="bg-base-content/25" />
            ) : (
              <hr className="bg-info" />
            )}
            {date.venue ? (
              <div className="time timeline-start timeline-box">
                {date.venue?.name}
              </div>
            ) : undefined}

            <div className="time timeline-end timeline-compact">
              {new Date(date.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="timeline-middle">
              {today == date.date ? (
                <TargetIcon className="text-accent" />
              ) : today > date.date ? (
                <MapPinCheckInsideIcon className="text-info" />
              ) : (
                <MapPinIcon className="text-nuetral" />
              )}
            </div>
            {index != length ? (
              today == date.date ? (
                <hr className="bg-gradient-to-r from-accent to-base-content/25" />
              ) : today < date.date ? (
                <hr className="bg-base-content/25" />
              ) : (
                <hr className="bg-info" />
              )
            ) : undefined}
          </li>
        ))}
      </ul>
    </section>
  );
}
