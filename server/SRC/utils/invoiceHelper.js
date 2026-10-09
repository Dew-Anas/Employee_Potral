import Invoice from "../models/Invoice.js";
import Booking from "../models/Booking.js";

export const createInvoiceForBooking = async (bookingId) => {
  const existing = await Invoice.findOne({ booking: bookingId });

  if (existing) {
    return existing;
  }

  const booking = await Booking.findById(bookingId)
    .populate("service")
    .populate("quotation");

  if (!booking) {
    return null;
  }

  const amount = Number(booking.quotation?.amount || booking.service?.price || 0);
  const taxAmount = 0;
  const totalAmount = amount + taxAmount;
  const year = new Date().getFullYear();
  const count = await Invoice.countDocuments();
  const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, "0")}`;

  return Invoice.create({
    invoiceNumber,
    booking: booking._id,
    customer: booking.customer,
    service: booking.service?._id || booking.service,
    quotation: booking.quotation?._id || booking.quotation || null,
    items: [
      {
        description: booking.service?.name || "Service charge",
        amount,
      },
    ],
    subtotal: amount,
    taxAmount,
    totalAmount,
    amountPaid: 0,
    balanceDue: totalAmount,
    paymentStatus: "unpaid",
    issueDate: new Date(),
  });
};

export const populateInvoice = (query) =>
  query
    .populate("customer", "firstName lastName email phone")
    .populate("service", "name category price duration")
    .populate("booking", "status preferredDate preferredTime address")
    .populate("quotation", "amount description");
