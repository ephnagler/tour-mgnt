import { Guest } from "@prisma/client";
import { Form } from "@remix-run/react";

interface GuestListProps {
  guests?: Guest[];
  venue?: string;
  guestlimit?: number;
  daysheet?: string;
}

export default function GuestList(props: GuestListProps) {
  return (
    <section id="guest-list" className="container prose">
      <h2>Guest List</h2>
      <div className="flex w-full flex-col">
        <div className="card grid rounded-box bg-base-300 px-8">
          <h3>
            {props.venue} - {props.guestlimit} spots left
          </h3>
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <Form key={props.daysheet}>
                  {props.guests?.map((guest, index) => (
                    <tr
                      key={guest.id}
                      className="grid grid-cols-9 items-center"
                    >
                      <td>{index + 1}</td>
                      <td className="col-span-6">
                        {guest.name} +{guest.party}
                      </td>
                      <td className="col-span-2 flex justify-end gap-4">
                        <button className="btn btn-outline hover:bg-red-500 hover:text-white">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="grid grid-cols-9 items-center">
                    <td>{props.guestlimit}</td>
                    <td className="col-span-4">
                      {/* <input hidden type="text" name="daysheet" value={props.daysheet}/> */}
                      <input
                        type="text"
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
                      <button className="btn btn-outline" type="submit" name="_action" value="save">Save Guests</button>
                    </td>
                  </tr>
                </Form>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
