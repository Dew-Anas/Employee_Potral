import { Link, useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { serviceId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex min-h-96 items-center justify-center rounded-2xl bg-blue-100 text-7xl">
            🛠️
          </div>

          <div>
            <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Service Details
            </span>

            <h1 className="mt-3 text-4xl font-bold text-slate-900">
              {serviceId.replaceAll("-", " ")}
            </h1>

            <p className="mt-6 leading-7 text-slate-600">
              Our professional team provides reliable service based
              on your requirements. Submit a request to receive a
              quotation.
            </p>

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex justify-between border-b border-slate-100 pb-4">
                <span className="text-slate-500">
                  Starting Price
                </span>

                <span className="font-semibold text-slate-900">
                  From $50
                </span>
              </div>

              <div className="flex justify-between pt-4">
                <span className="text-slate-500">
                  Estimated Duration
                </span>

                <span className="font-semibold text-slate-900">
                  2 hours
                </span>
              </div>
            </div>

            <Link
              to="/login"
              className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Request This Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;