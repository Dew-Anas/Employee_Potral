import { Link } from "react-router-dom";

const services = [
  {
    id: "home-maintenance",
    name: "Home Maintenance",
    category: "Maintenance",
    price: "From $50",
    duration: "2 hours",
  },
  {
    id: "electrical",
    name: "Electrical Services",
    category: "Electrical",
    price: "From $40",
    duration: "1 hour",
  },
  {
    id: "cleaning",
    name: "Cleaning Services",
    category: "Cleaning",
    price: "From $30",
    duration: "2 hours",
  },
  {
    id: "plumbing",
    name: "Plumbing Services",
    category: "Plumbing",
    price: "From $45",
    duration: "1 hour",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Service Catalog
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            Explore Our Services
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            Find the right service for your needs and submit a request.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.id}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex h-40 items-center justify-center bg-slate-100 text-5xl">
                🛠️
              </div>

              <div className="p-5">
                <span className="text-xs font-medium text-blue-600">
                  {service.category}
                </span>

                <h2 className="mt-2 text-lg font-semibold text-slate-900">
                  {service.name}
                </h2>

                <div className="mt-4 space-y-1 text-sm text-slate-500">
                  <p>{service.price}</p>
                  <p>{service.duration}</p>
                </div>

                <Link
                  to={`/services/${service.id}`}
                  className="mt-5 block rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;