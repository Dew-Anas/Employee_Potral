import mongoose from "mongoose";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

const populateReview = (query) =>
  query
    .populate("customer", "firstName lastName email")
    .populate("employee", "firstName lastName")
    .populate("service", "name category")
    .populate("booking", "status preferredDate");

const formatPublicReview = (review) => ({
  _id: review._id,
  rating: review.rating,
  comment: review.comment,
  customerName: review.customer
    ? `${review.customer.firstName} ${review.customer.lastName}`
    : "Customer",
  serviceName: review.service?.name || "Service",
  createdAt: review.createdAt,
});

export const submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Booking, rating and comment are required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      });
    }

    const numericRating = Number(rating);

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const trimmedComment = comment.trim();

    if (trimmedComment.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Review must contain at least 10 characters.",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      customer: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found.",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Reviews can only be submitted after service completion.",
      });
    }

    const existing = await Review.findOne({ booking: bookingId });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "A review has already been submitted for this booking.",
      });
    }

    const review = await Review.create({
      booking: booking._id,
      customer: req.user._id,
      employee: booking.employee,
      service: booking.service,
      rating: numericRating,
      comment: trimmedComment,
      status: "pending",
    });

    const populated = await populateReview(Review.findById(review._id));

    return res.status(201).json({
      success: true,
      message: "Review submitted and pending admin approval.",
      review: populated,
    });
  } catch (error) {
    console.error("Submit review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit review.",
    });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find({ customer: req.user._id }).sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get my reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews.",
    });
  }
};

export const getApprovedReviews = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find({ status: "approved" }).sort({ createdAt: -1 }).limit(12)
    );

    return res.status(200).json({
      success: true,
      reviews: reviews.map(formatPublicReview),
    });
  } catch (error) {
    console.error("Get approved reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews.",
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await populateReview(
      Review.find().sort({ createdAt: -1 })
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get all reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve reviews.",
    });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.status = status;
    review.reviewedAt = new Date();
    await review.save();

    const populated = await populateReview(Review.findById(review._id));

    return res.status(200).json({
      success: true,
      message: `Review ${status} successfully.`,
      review: populated,
    });
  } catch (error) {
    console.error("Update review status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review.",
    });
  }
};
