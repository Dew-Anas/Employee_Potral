const SectionTitle = ({ eyebrow, title, description }) => {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
          {eyebrow}
        </p>
      )}

      <h2 className="mt-2 text-3xl font-bold text-slate-900 md:text-4xl">
        {title}
      </h2>

      {description && (
        <p className="mt-4 text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;