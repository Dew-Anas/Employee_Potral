import { Link } from "react-router-dom";
import SectionTitle from "../common/SectionTitle";

const services = [
  {
    id: 1,
    name: "Home Maintenance",
    description: "Professional maintenance services for your property.",
  },
  {
    id: 2,
    name: "Electrical Services",
    description: "Reliable electrical installation and maintenance.",
  },
  {
    id: 3,
    name: "Cleaning Services",
    description: "Professional cleaning solutions for homes and businesses.",
  },
];

const ServicesPreview = () => {
  return (
    <section className="bg-white px-6 py-20">
      <SectionTitle
        eyebrow="Our Services"
        title="Professional services for your needs"
        description="Explore our service categories and find the right solution."
      />

      <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.id}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-xl">
              🛠
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              {service.name}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {service.description}
            </p>

            <Link
              to="/services"
              className="mt-5 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View Service →
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesPreview;