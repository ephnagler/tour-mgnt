import { MetaFunction } from "@remix-run/node";
import { Link, Outlet } from "@remix-run/react";

const links = {
  data: [
    {
      text: "Contacts",
      url: "contacts",
    },
    {
      text: "Daysheets",
      url: "daysheets",
    },
    {
      text: "Hotels",
      url: "hotels",
    },
    {
      text: "Venues",
      url: "venues",
    },
    {
      text: "Schedules",
      url: "schedules",
    },
  ],
};

export const meta: MetaFunction = () => [{ title: "Admin - Suuns 2024" }];

export default function Admin() {
  return (
    <main className="container">
      <section className="prose prose-invert">
        <h1 className="text-center">Admin</h1>
        <ul className="flex list-none justify-center gap-2">
          {links.data.map((link) => (
            <li key={link.url}>
              <Link
                to={`/admin/${link.url}`}
                className="btn rounded-none text-xl hover:bg-accent/20"
              >
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <Outlet />
      </section>
    </main>
  );
}
