import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import { getUser } from "~/session.server";
import stylesheet from "~/tailwind.css";

import Nav from "./components/nav";
import { prisma } from "./db.server";


export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export const loader = async ({ request }: LoaderFunctionArgs) => {

  const daysheets = await prisma.daysheet.findMany({
    select: {
      date: true,
    },
    orderBy: [
      {
        date: "asc",
      },
    ],
  })

  return json({ user: await getUser(request), daysheets });
};

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en" className="h-full" data-theme="sunset">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="https://fav.farm/🍣" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <Nav daysheets={data.daysheets} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
