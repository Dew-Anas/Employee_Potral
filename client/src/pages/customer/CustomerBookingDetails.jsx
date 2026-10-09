import ReviewForm from "../../components/customer/ReviewForm";

{booking?.status === "completed" &&
  booking?.customerSignedOff && (
    <div className="mt-8">
      <ReviewForm
        bookingId={booking._id}
        onSubmitted={() => {
          console.log(
            "Review submitted successfully"
          );
        }}
      />
    </div>
  )}