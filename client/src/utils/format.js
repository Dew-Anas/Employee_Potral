export const formatDate = (value) => {
  if (!value) return "N/A";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString();
};

export const formatMoney = (value) =>
  `LKR ${Number(value || 0).toLocaleString()}`;

export const fullName = (user) => {
  if (!user) return "Not assigned";

  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
};
