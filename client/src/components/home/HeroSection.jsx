import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Professional Service Management
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight text-slate-900 md:text-6xl">
            Reliable services,
            <span className="text-blue-600"> managed simply.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover professional services, request a quotation,
            manage your bookings, and track your service journey
            from one place.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/services"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Explore Services
            </Link>

            <Link
              to="/register"
              className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-800 hover:bg-slate-50"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="flex min-h-80 items-center justify-center rounded-2xl bg-blue-100 p-8">
          <div className="text-center">
            <div className="text-6xl">🛠️</div>

            <h2 className="mt-4 text-2xl font-bold text-slate-900">
              Professional Service
            </h2>

            <p className="mt-2 text-slate-600">
              From request to completion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;