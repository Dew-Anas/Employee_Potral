export const getDashboardPath = (role) => {
  if (role === "admin") return "/admin/dashboard";
  if (role === "employee") return "/employee/dashboard";
  return "/customer/dashboard";
};
