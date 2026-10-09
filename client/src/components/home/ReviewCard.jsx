import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  if (!review) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Rating */}
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={
              star <= review.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }
          />
        ))}
      </div>

      {/* Review */}
      <p className="mt-4 text-sm leading-6 text-slate-600">
        "{review.comment}"
      </p>

      {/* Customer */}
      <div className="mt-5 border-t border-slate-100 pt-4">
        <p className="font-semibold text-slate-900">
          {review.customerName}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {review.serviceName}
        </p>
      </div>
    </div>
  );
};

export default ReviewCard;