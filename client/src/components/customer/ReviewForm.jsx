import { useState } from "react";

import {
  submitReview,
} from "../../services/reviewService";

const ReviewForm = ({
  bookingId,
  onSubmitted,
}) => {
  const [rating, setRating] =
    useState(0);

  const [comment, setComment] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (rating < 1 || rating > 5) {
      setError(
        "Please select a rating from 1 to 5."
      );
      return;
    }

    if (!comment.trim()) {
      setError(
        "Please enter your feedback."
      );
      return;
    }

    try {
      setSubmitting(true);

      await submitReview(
        bookingId,
        rating,
        comment
      );

      setSuccess(
        "Thank you! Your review has been submitted for approval."
      );

      setRating(0);
      setComment("");

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-6">

      <h2 className="text-xl font-semibold">
        Rate Your Service
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Tell us about your experience.
      </p>

      {/* Rating */}

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">
          Rating
        </p>

        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <button
                key={star}
                type="button"
                onClick={() =>
                  setRating(star)
                }
                className="text-3xl"
                aria-label={`${star} stars`}
              >
                {star <= rating
                  ? "★"
                  : "☆"}
              </button>
            )
          )}
        </div>
      </div>

      {/* Comment */}

      <div className="mt-5">
        <label className="text-sm font-medium">
          Feedback
        </label>

        <textarea
          value={comment}
          onChange={(e) =>
            setComment(e.target.value)
          }
          rows={5}
          maxLength={1000}
          placeholder="How was your service?"
          className="mt-2 w-full rounded-lg border p-3"
        />

        <p className="mt-1 text-right text-xs text-gray-400">
          {comment.length}/1000
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 rounded-lg bg-green-100 p-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="mt-5 rounded-lg bg-black px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
      >
        {submitting
          ? "Submitting..."
          : "Submit Review"}
      </button>

    </div>
  );
};

export default ReviewForm;