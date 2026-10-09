import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import StarRating from "../../components/customer/StarRating";

const SubmitReview = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const booking = {
    id: bookingId,
    service: "Home Maintenance",
    employee: "John Employee",
    completedDate: "2026-09-29",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating from 1 to 5.");
      return;
    }

    const trimmedReview = review.trim();

    if (!trimmedReview) {
      toast.error("Please enter your review.");
      return;
    }

    if (trimmedReview.length < 10) {
      toast.error(
        "Review must contain at least 10 characters."
      );
      return;
    }

    if (trimmedReview.length > 1000) {
      toast.error(
        "Review cannot exceed 1000 characters."
      );
      return;
    }

    setSubmitting(true);

    const reviewData = {
      bookingId: booking.id,
      rating,
      comment: trimmedReview,
    };

    console.log("Review data:", reviewData);

    // Temporary mock delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    setSubmitting(false);

    toast.success(
      "Review submitted successfully. It is pending admin approval."
    );

    navigate("/customer/bookings");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/customer/bookings"
        className="text-sm font-medium text-blue-600 hover:text-blue-700"
      >
        ← Back to Bookings
      </Link>

      <div className="mt-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Leave a Review
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Share your experience with the service.
        </p>
      </div>

      {/* Booking Information */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Completed Service
        </h2>

        <div className="mt-4 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Service
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {booking.service}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Employee
            </p>

            <p className="mt-1 font-medium text-slate-900">
              {booking.employee}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase text-slate-500">
              Completed
            </p>

            <p className="mt-1 text-sm text-slate-600">
              {booking.completedDate}
            </p>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-800">
            Your Rating
          </label>

          <p className="mt-1 text-sm text-slate-500">
            How would you rate this service?
          </p>

          <div className="mt-3">
            <StarRating
              value={rating}
              onChange={setRating}
              disabled={submitting}
            />
          </div>

          {rating > 0 && (
            <p className="mt-2 text-sm font-medium text-slate-600">
              {rating} out of 5 stars
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mt-6">
          <label
            htmlFor="review"
            className="block text-sm font-semibold text-slate-800"
          >
            Your Review
          </label>

          <textarea
            id="review"
            value={review}
            onChange={(event) =>
              setReview(event.target.value)
            }
            rows={6}
            maxLength={1000}
            placeholder="Tell us about your experience..."
            disabled={submitting}
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
          />

          <div className="mt-1 text-right text-xs text-slate-500">
            {review.length}/1000
          </div>
        </div>

        {/* Notice */}
        <div className="mt-5 rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-blue-800">
            Your review will be reviewed by an administrator
            before it is displayed publicly.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting
            ? "Submitting Review..."
            : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default SubmitReview;