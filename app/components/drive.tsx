import Map from "./map";

export default function Drive() {
  return (
    <section className="container prose">
      <h2>Drive</h2>
      <div className="flex w-full">
        <div className="card grid flex-grow place-items-center rounded-box bg-base-300 ">
          <Map/>
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="card grid flex-grow place-items-center rounded-box bg-base-300">
          <Map/>
        </div>
      </div>
    </section>
  );
}
