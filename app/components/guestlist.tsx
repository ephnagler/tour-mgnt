export default function GuestList() {
  return (
    <section id="guest-list" className="container prose">
      <h2>Guest List</h2>
      <div className="flex w-full flex-col">
        <div className="card grid rounded-box bg-base-300 px-8">
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr className="grid grid-cols-9 items-center">
                  <td>1</td>
                  <td className="col-span-6">Name +1</td>
                  <td className="flex gap-4 justify-end col-span-2">
                    <button className="btn btn-outline" disabled>Save</button>
                    <button className="btn btn-outline hover:text-white hover:bg-red-500">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
