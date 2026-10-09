import SectionTitle from "../common/SectionTitle";

const steps = [
  {
    number: "01",
    title: "Choose a Service",
    description: "Browse our services and select what you need.",
  },
  {
    number: "02",
    title: "Send a Request",
    description: "Tell us your requirements and preferred schedule.",
  },
  {
    number: "03",
    title: "Accept Your Quote",
    description: "Review the quotation and confirm your service.",
  },
  {
    number: "04",
    title: "Get It Done",
    description: "Track your booking until the service is completed.",
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-slate-50 px-6 py-20">
      <SectionTitle
        eyebrow="How It Works"
        title="Simple from start to finish"
        description="ServicePro connects every step of your service journey."
      />

      <div className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-4">
        {steps.map((step) => (
          <div key={step.number} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
              {step.number}
            </div>

            <h3 className="mt-5 font-semibold text-slate-900">
              {step.title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;