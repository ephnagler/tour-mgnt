import { Link, useNavigate } from "@remix-run/react";

export default function Nav() {
  const navigate = useNavigate();
  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <Link to="/" className="btn sm:btn-ghost rounded-none text-xl">
          Suuns 2024
        </Link>
      </div>
      <div className="flex-none">
        <button
          className="btn btn-square sm:btn-ghost rounded-none"
          onClick={() => {
            navigate("/admin");
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-5 w-5 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            ></path>
          </svg>
        </button>
      </div>
    </nav>
  );
}
