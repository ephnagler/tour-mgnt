import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { ActionFunction, MetaFunction } from "@remix-run/node";
import {
  Form,
  json,
  Outlet,
  useActionData,
  useLoaderData,
  useLocation,
  useNavigate,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { prisma } from "~/db.server";
import { deleteDaysheet } from "~/models/tour.server";

export const meta: MetaFunction = () => [
  { title: "Daysheet Admin - Suuns 2024" },
];

export async function loader() {
  const daysheets = await prisma.daysheet.findMany({
    orderBy: [
      {
        date: "asc",
      },
    ],
    select: { id: true, slug: true, date: true, venue: { select: { name: true } } },
  });

  return json({ daysheets });
}

const tm = z.string();

interface ActionData {
  status: "deleted" | "canceled" | null;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { _action } = Object.fromEntries(formData);

  if (_action === "cancel") {
    return json({ status: "cancled" });
  }
  const slug = tm.parse(formData.get("slug"));
  if (_action === "delete") {
    await deleteDaysheet({ slug });
    return json({ status: "deleted" });
  }
};

export default function AdminDaysheets() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData | null>();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDaysheet, setSelectedDaysheet] = useState<{
    slug: string;
    date: string;
  } | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (slug: string, date: string) => {
    setSelectedDaysheet({ slug, date });
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDaysheet(null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (actionData?.status === "deleted") {
      closeModal();
    }
  }, [actionData]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isModalOpen]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-8">
      <div className="order-2 bg-base-300 p-4 md:order-1">
        <Outlet />
      </div>
      <div className="order-1 bg-base-300 p-4 md:order-2">
        <div className="flex justify-between">
          <h2 className="mt-0">Daysheets</h2>
          <button
            onClick={() => {
              navigate(`/admin/daysheets`, {
                replace: true,
              });
            }}
            className="badge flex items-center gap-2 bg-base-100 p-4 hover:bg-accent/20"
          >
            <PlusIcon />
            Add Daysheet
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table mt-0">
            <tbody>
              {data.daysheets.map((daysheet, index) => (
                <tr
                  data-here={
                    location.pathname === `/admin/daysheets/${daysheet.slug}`
                      ? true
                      : false
                  }
                  className="data-[here='true']:border-1 cursor-pointer hover:bg-base-200 data-[here='true']:cursor-default data-[here='true']:bg-accent/20"
                  key={daysheet.id}
                  onClick={() => {
                    navigate(`/admin/daysheets/${daysheet.slug}`, {
                      replace: true,
                      state:{formState: "reset"}
                    });
                  }}
                >
                  <th>{index + 1}</th>
                  <td>{daysheet.date}</td>
                  <td>{daysheet.venue ? daysheet.venue.name : null}</td>
                  <td className="text-right">
                    <button
                      className="btn rounded-none hover:bg-red-500"
                      onClick={() => openModal(daysheet.slug, daysheet.date)}
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

      {isModalOpen && selectedDaysheet ? (
        <dialog id="my_modal_1" className="modal text-center" open>
          <div className="modal-box">
            <h3 className="text-lg font-bold">Warning!</h3>
            <p className="py-4">
              Are you sure you want to delete {selectedDaysheet.date.toString()}
              ?
            </p>
            <div className="modal-action">
              <Form
                method="post"
                className="flex w-full flex-col justify-center gap-4 sm:flex-row"
              >
                <input hidden name="slug" value={selectedDaysheet.slug} />
                <button
                  type="submit"
                  name="_action"
                  value="cancel"
                  className="btn w-2/5 hover:bg-accent hover:text-black"
                  onClick={closeModal}
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
            <button onClick={closeModal} className="cursor-default">
              close
            </button>
          </div>
        </dialog>
      ) : null}
    </div>
  );
}
