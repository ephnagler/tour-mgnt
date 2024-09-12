interface Summary {
  venue?: string;
  city?: string;
  children?: JSX.Element | JSX.Element[];
}

export default function Summary(props: Summary) {
  const today = new Date();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <section className="container prose">
      <div className="mb-2">{props.city ? props.city : ""}, State, Country</div>
      <h1>
        {months[today.getMonth()]} {today.getDate()}, {today.getFullYear()}
      </h1>

      <div className="shadow stats">
        <div className="stat">
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Drive to Venue</div>
          <div className="stat-value text-primary">3 hr</div>
          <div className="stat-desc">{props.venue ? props.venue : ""}</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
          
          </div>
          <div className="stat-title">Soundcheck</div>
          <div className="stat-value text-secondary">4:30</div>
          <div className="stat-desc">We have 1 hour.</div>
        </div>

        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Doors at</div>
          <div className="stat-value text-secondary">8:00</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Set time</div>
          <div className="stat-value text-secondary">11:00</div>
          <div className="stat-desc">21% more than last month</div>
        </div>
        <div className="stat">
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
          <div className="stat-title">Drive to Hotel</div>
          <div className="stat-value text-secondary">1 hr</div>
          <div className="stat-desc">Marriot</div>
        </div>
      </div>

      <div>{props.children}</div>
    </section>
  );
}
