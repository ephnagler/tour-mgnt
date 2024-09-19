import { Contact, Hotel, Venue } from "@prisma/client";

import { formatPhoneNumber } from "~/utils";

interface VenueWithContacts extends Venue {
  contacts?: Contact[];
}

interface InformationProps {
  venue?: VenueWithContacts;
  hotel?: Hotel;
}

export default function Information(props: InformationProps) {
  const venueAddress = `${props.venue?.street ? props.venue?.street + ", " : ""}${props.venue?.city ? props.venue?.city + ", " : ""}${props.venue?.state ? props.venue?.state + ", " : ""}${props.venue?.zip ? props.venue?.zip : ""}`;
  const venueAddressUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`;
  const hotelAddress = `${props.hotel?.street ? props.hotel?.street + ", " : ""}${props.hotel?.city ? props.hotel?.city + ", " : ""}${props.hotel?.state ? props.hotel?.state + ", " : ""}${props.hotel?.zip ? props.hotel?.zip : ""}`;
  const hotelAddressUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelAddress)}`;

  return (
    <section id="information" className="container prose">
      {props.hotel && props.venue ? <h2>Information</h2> : ""}
      <div className="flex w-full flex-col">
        {props.hotel ? (
          <div className="card grid rounded-box bg-base-300 px-8">
            <h3>{props.venue?.name ? props.venue?.name : "Venue"}</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  <tr className="flex grid-cols-5 flex-col sm:grid">
                    <td>Info</td>
                    <td>
                      <a
                        href={props.venue?.site}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {props.venue?.site}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${props.venue?.phone}`}>
                        {formatPhoneNumber(
                          props.venue?.phone ? props.venue?.phone : "",
                        )}
                      </a>
                    </td>
                    <td>
                      <a href={`mailto:${props.venue?.email}`}>
                        {props.venue?.email}
                      </a>
                    </td>
                  </tr>
                  <tr className="flex grid-cols-5 flex-col sm:grid">
                    <td>Address</td>
                    <td className="col-span-4">
                      <a
                        href={venueAddressUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {venueAddress}
                      </a>
                    </td>
                  </tr>
                  {props.venue?.contacts?.map((contact) => (
                    <tr
                      key={contact.id}
                      className="flex grid-cols-5 flex-col sm:grid"
                    >
                      <td>Contacts</td>
                      <td>{contact.role}</td>
                      <td>{contact.name}</td>
                      <td>
                        <a href={`tel:${contact.phone}`}>
                          {formatPhoneNumber(contact.phone)}
                        </a>
                      </td>
                      <td>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
        {props.hotel && props.venue ? <div className="divider"></div> : ""}
        {props.hotel ? (
          <div className="card grid rounded-box bg-base-300 px-8">
            <h3>{props.hotel?.name ? props.hotel.name : "Hotel"}</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <tbody>
                  <tr className="flex grid-cols-5 flex-col sm:grid">
                    <td>Info</td>
                    <td>
                      <a
                        href={props.hotel?.site}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {props.hotel?.site}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${props.hotel?.phone}`}>
                        {props.hotel?.phone}
                      </a>
                    </td>
                    <td>
                      <a href={`mailto:${props.hotel?.email}`}>
                        {props.hotel?.email}
                      </a>
                    </td>
                  </tr>
                  <tr className="flex grid-cols-5 flex-col sm:grid">
                    <td>Address</td>
                    <td className="col-span-4">
                      <a
                        href={hotelAddressUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {hotelAddress}
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </section>
  );
}
