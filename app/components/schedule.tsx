import { getScheduledTime } from "~/utils";

interface Schedule {
  id: string;
  alert: string;
  name: string;
  note: string;
  timeFrom: string;
  timeTo: string | null;
}

interface ScheduleProps {
  schedules?: Schedule[];
}

export default function Schedule(props: ScheduleProps) {
  return (
    <section id="schedule" className="container prose">
      <h2>Schedule</h2>
      <div className="flex w-full flex-col">
        <div className="card grid rounded-box bg-base-300 px-8">
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                {props.schedules?.map((schedule) => (
                  <tr
                    key={schedule.id}
                    className="grid grid-cols-9 data-[alert=Error]:text-error data-[alert=Info]:text-info data-[alert=Primary]:text-primary data-[alert=Secondary]:text-secondary data-[alert=Success]:text-success data-[alert=Warning]:text-warning data-[alert=Accent]:text-accent"
                    data-alert={schedule.alert}
                  >
                    <td>{getScheduledTime(schedule.timeFrom)}</td>
                    <td className="col-span-2">{schedule.name}</td>
                    <td className="col-span-6">{schedule.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
