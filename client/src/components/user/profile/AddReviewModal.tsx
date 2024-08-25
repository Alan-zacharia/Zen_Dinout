import axiosInstance from "../../../api/axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
interface AddReviewModalProps {
  onClose: () => void;
  userId: string | null | undefined;
  restaurantId: string;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  onClose,
  userId,
  restaurantId,
}) => {
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => {
    axiosInstance
      .get(`/api/review/${restaurantId}`)
      .then((res) => {
        setReviewText(res.data.review.reviewText);
        setRating(res.data.review.rating);
      })
      .catch(({ response }) => {
        console.log(response.data.message);
      });
  }, [restaurantId]);
  const handleReviewSubmit = async () => {
    if (reviewText && rating) {
      try {
        await axiosInstance.post("/api/review", {
          userId,
          restaurantId,
          reviewText,
          rating,
        });
        toast.success("Thank you so much. Your review has been saved.", {
          style: {
            minWidth: "400px",
            maxWidth: "600px",
          },
        });
        onClose();
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    } else {
      toast.error("Please fill in all fields.");
    }
  };
  console.log(rating);
  return (
    <div className="modal" role="dialog" id="my_review">
      <div className="modal-box">
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Write your review here..."
          className="w-full h-32 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
        />

        <div className="mt-4">
          <p className="mb-2">Rating: </p>
          <div className="flex">
            {[...Array(5)].map((star, index) => {
              const currentRating = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    className="hidden"
                    value={currentRating}
                    onClick={() => setRating(currentRating)}
                  />
                  <FaStar
                    size={20}
                    className="cursor-pointer"
                    color={
                      currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"
                    }
                    onMouseEnter={() => setHover(currentRating)}
                    onMouseLeave={() => setHover(null)}
                  />
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            onClick={handleReviewSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Submit Review
          </button>
          <div className="modal-action text-left">
            <a onClick={onClose} href="#" className="btn">
              Close
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddReviewModal;
