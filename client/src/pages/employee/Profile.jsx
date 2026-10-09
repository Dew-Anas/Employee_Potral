const Profile = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        My Profile
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        View your employee profile information.
      </p>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">
          Employee profile information will be loaded
          from the backend.
        </p>
      </div>
    </div>
  );
};

export default Profile;