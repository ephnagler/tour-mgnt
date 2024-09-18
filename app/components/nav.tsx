import { Link } from "@remix-run/react";

const navLinks = [
  { url: "#information", title: "Information" },
  { url: "#schedule", title: "Schedule" },
  { url: "#guest-list", title: "Guest List" },
];

interface Daysheet {
  date: string;
}

interface NavProps {
  daysheets: Daysheet[];
}

export default function Nav(props: NavProps) {
  return (
    <div className="navbar sticky top-0 z-50 bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul className="shadow menu dropdown-content menu-md z-[1] mt-3 w-52 rounded-box bg-base-300 px-4 py-2">
            Today
            {navLinks.map((link) => (
              <li key={link.url}>
                <Link to={link.url}>{link.title}</Link>
              </li>
            ))}
            <span className="mt-8">All Dates</span>
            <li>
              <ul className="p-2">
                {props.daysheets.map((daysheet) => (
                  <li key={daysheet.date}>
                    <Link to={"/"}>{daysheet.date}</Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
        <Link to={"/dashboard"} className="btn btn-ghost hidden text-xl lg:inline-flex">
        Daysheet Management
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navLinks.map((link) => (
            <li key={link.url}>
              <Link to={link.url}>{link.title}</Link>
            </li>
          ))}
          <li>
            <details>
              <summary>All Dates</summary>
              <ul className="p-2">
                {props.daysheets.map((daysheet) => (
                  <li key={daysheet.date}>
                    <Link to={`/${daysheet.date}`}>{daysheet.date}</Link>
                  </li>
                ))}
              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link to="/admin/daysheets" className="btn hidden lg:inline-flex">
          ...
        </Link>
        <Link to={"/dashboard"} className="btn btn-ghost text-right text-xl lg:hidden">
          Daysheet Management
        </Link>
      </div>
    </div>
  );
}
