import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ActionFunction, MetaFunction, redirect } from "@remix-run/node";
import {
  Form,
  json,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { deleteSchedule } from "~/models/tour.server";
import { getScheduledTime } from "~/utils";

export const meta: MetaFunction = () => [
  { title: "Schedule Admin - Suuns 2024" },
];

export async function loader() {
  const schedules = await prisma.schedule.findMany({
    orderBy: [
      {
        timeFrom: "asc",
      },
    ],
    select: {
      id: true, slug: true, timeFrom: true, name: true
    },
  });

  return json({ schedules });
}

const tm = z.string();

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const slug = tm.parse(formData.get("slug"));

  await deleteSchedule({ slug });
  return redirect(`/admin/schedules`);
};

export default function AdminSchedules() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && location.search === "?delete") {
        navigate(-1);
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [location.search, navigate]); // Dependency on modal state

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
      <div className="order-2 bg-base-300 p-4 md:order-1">
        <Outlet />
      </div>
      <div className="order-1 bg-base-300 p-4 md:order-2">
        <div className="flex justify-between">
          <h2 className="mt-0">Schedules</h2>
          <button
            onClick={() => {
              navigate(`/admin/schedules`, {
                replace: true,
              });
            }}
            className="badge flex items-center gap-2 bg-base-100 p-4 hover:bg-accent/20"
          >
            <PlusIcon />
            Add Schedule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table mt-0">
            <tbody>
              {data.schedules.map((schedule, index) => (
                <tr
                  data-here={
                    location.pathname === `/admin/schedules/${schedule.slug}`
                      ? true
                      : false
                  }
                  className="data-[here='true']:border-1 cursor-pointer hover:bg-base-200 data-[here='true']:cursor-default data-[here='true']:bg-accent/20"
                  key={schedule.id}
                  onClick={() => {
                    navigate(`${schedule.slug}?edit`, {
                      replace: true,
                    });
                  }}
                >
                  <th>{index + 1}</th>
                  <td>{getScheduledTime(schedule.timeFrom)}</td>
                  <td>{schedule.name}</td>
                  <td className="text-right">
                    <button
                      className="btn rounded-none hover:bg-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`${schedule.slug}?delete`, {
                          state: { schedule: schedule },
                        });
                      }}
                    >
                      <Cross2Icon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {location.search === "?delete" ? (
        <dialog id="my_modal_1" className="modal text-center" open>
          <div className="modal-box">
            <h3 className="text-lg font-bold">Warning!</h3>
            <p className="py-4">
              Are you sure you want to delete {location.state.schedule.name}?
            </p>
            <div className="modal-action">
              <Form
                method="post"
                className="flex w-full flex-col justify-center gap-4 sm:flex-row"
              >
                <input
                  hidden
                  name="slug"
                  value={location.state.schedule.slug}
                />
                <button
                  type="submit"
                  name="_action"
                  value="cancel"
                  className="btn w-2/5 hover:bg-accent hover:text-black"
                  onClick={() => navigate(-1)}
                >
                  NAH
                </button>
                <button
                  type="submit"
                  name="_action"
                  value="delete"
                  className="btn w-2/5 p-2 hover:bg-red-500 hover:text-black"
                >
                  YEAH
                </button>
              </Form>
            </div>
          </div>
          <div className="modal-backdrop bg-black/35 backdrop-blur-sm">
            <button onClick={() => navigate(-1)} className="cursor-default">
              close
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
