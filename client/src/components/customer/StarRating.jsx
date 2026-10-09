import { Star } from "lucide-react";

const StarRating = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onChange(star)}
          className="rounded-md p-1 transition hover:bg-yellow-50 disabled:cursor-not-allowed"
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            size={30}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;