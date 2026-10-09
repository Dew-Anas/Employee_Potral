const Footer = () => {
  return (
    <footer className="bg-slate-900 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row">
          <div>
            <h2 className="text-xl font-bold">ServicePro</h2>

            <p className="mt-2 max-w-md text-sm text-slate-400">
              A simple and reliable platform for managing professional
              services.
            </p>
          </div>

          <div className="text-sm text-slate-400">
            © 2026 ServicePro. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;