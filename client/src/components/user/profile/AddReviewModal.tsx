import axiosInstance from "../../../api/axios";
import React, { useState } from "react";
import  ReactStars from "react-rating-stars-component";
import toast from "react-hot-toast";

interface AddReviewModalProps {
  onClose: () => void;
  userId: string | null | undefined;
  restaurantId: string;
};

const AddReviewModal: React.FC<AddReviewModalProps> = ({
  onClose,
  userId,
  restaurantId,
}) => {
  const [reviewText, setReviewText] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const handleReviewSubmit = async () => {
    if (reviewText && rating) {
      try {
        await axiosInstance.post("/api/reviews", {
          userId,
          restaurantId,
          reviewText,
          rating,
        });
        toast.success("Thank you so much. Your review has been saved.",{
          style :{
            minWidth : "400px",
            maxWidth : "600px"
          }
        })
        onClose();
      } catch (error) {
        console.error("Error submitting review:", error);
      }
    }
  };

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
          <p className="mb-2">
            Rating:{" "}
            <ReactStars
              count={5}
              size={24}
              activeColor="#ffd700"
              onChange={(newRating: number) => setRating(newRating)}
            />
          </p>
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
