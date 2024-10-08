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
      {props.schedules ? (
        <>
          <h2>Schedule</h2>
          <div className="flex w-full flex-col">
            <div className="card grid rounded-box bg-base-300 px-8">
              <div className="overflow-x-auto">
                <table className="table">
                  <tbody>
                    {props.schedules?.map((schedule) => (
                      <tr
                        key={schedule.id}
                        className="flex grid-cols-9 flex-col data-[alert=Error]:text-error data-[alert=Performance]:text-primary data-[alert=Production]:text-secondary data-[alert=Show]:text-info data-[alert=Success]:text-success data-[alert=Travel]:text-accent data-[alert=Warning]:text-warning sm:grid"
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
        </>
      ) : (
        ""
      )}
    </section>
  );
}
