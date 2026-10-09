export const isQuotationExpired = (validUntil) => {
  if (!validUntil) {
    return false;
  }

  const expiryDate = new Date(validUntil);
  const today = new Date();

  // Compare only dates
  expiryDate.setHours(23, 59, 59, 999);

  return today > expiryDate;
};

export const getQuotationStatus = (
  status,
  validUntil
) => {
  if (status === "accepted") {
    return "accepted";
  }

  if (status === "rejected") {
    return "rejected";
  }

  if (isQuotationExpired(validUntil)) {
    return "expired";
  }

  return "pending";
};