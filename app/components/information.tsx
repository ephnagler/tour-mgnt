export default function Information() {
  return (
    <section id="information" className="container prose">
      <h2>Information</h2>
      <div className="flex w-full flex-col">
        <div className="card grid rounded-box bg-base-300 px-8">
          <h3>Venue</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr>
                  <td>Info</td>
                  <td>Site:</td>
                  <td>Phone:</td>
                  <td>Email:</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>Venue Address</td>
                </tr>
                <tr>
                  <td>Contacts</td>
                  <td>Role</td>
                  <td>Contact</td>
                  <td>Phone</td>
                  <td>Email</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="divider"></div>
        <div className="card grid rounded-box bg-base-300 px-8">
          <h3>Hotel</h3>
          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr>
                  <td>Info</td>
                  <td>Site:</td>
                  <td>Phone:</td>
                  <td>Email:</td>
                </tr>
                <tr>
                  <td>Address</td>
                  <td>Venue Address</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
