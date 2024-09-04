import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { format } from "timeago.js";

interface ReviewTypes {
  _id: string;
  userId: {
    username: string;
    email: string;
  };
  restaurantId: string;
  reviewText: string;
  rating: number;
  createdAt: string;
}

const RestaurantReview = ({
  restaurantId,
}: {
  restaurantId: string | undefined;
}) => {
  const [reviews, setReviews] = useState<ReviewTypes[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/reviews/${restaurantId}`
        );
        console.log(res.data.reviews)
        setReviews(res.data.reviews);
      } catch (error) {
        console.log(error);
      }
    };

    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);

  const renderRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-yellow-300"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      } else {
        stars.push(
          <svg
            key={i}
            className="w-4 h-4 text-gray-300 dark:text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        );
      }
    }
    return stars;
  };

  return (
    <div className="xl:mx-16 max-h-auto w-full xl:w-[1200px] bg-white shadow-xl rounded-lg flex mb-10 flex-col">
      <div className="p-5">
        <h4 className="text-xl font-bold pb-5">Reviews</h4>
        {reviews && reviews.length > 0 ? (
          <div className="flex flex-col gap-5">
            {reviews.map((data) => (
              <article key={data._id}>
                <div className="flex items-center mb-4 ">
                  <FaUserCircle size={25} className="text-gray-700" />
                  &nbsp;&nbsp;
                  <div className="font-medium dark:text-white">
                    <p className="text-gray-500">{data.userId?.username}</p>
                  </div>
                </div>
                <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
                  {renderRatingStars(data.rating)}
                  <h3 className="ms-2 text-sm font-semibold text-gray-900 dark:text-white">
                    {data.reviewText}
                  </h3>
                </div>

                <footer className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  <p>
                    Reviewed in{" "}
                    <time dateTime={data.createdAt}>
                      {format(data.createdAt)}
                    </time>
                  </p>
                </footer>
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                  {data.reviewText}
                </p>

                <a
                  href="#"
                  className="block mb-5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Read more
                </a>
                <aside>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    19 people found this helpful
                  </p>
                  <div className="flex items-center mt-3">
                    <a
                      href="#"
                      className="px-2 py-1.5 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                    >
                      Helpful
                    </a>
                    <a
                      href="#"
                      className="ps-4 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500 border-gray-200 ms-4 border-s md:mb-0 dark:border-gray-600"
                    >
                      Report abuse
                    </a>
                  </div>
                </aside>
                <div className="w-full bg-gray-200 h-0.5 mt-1" />
              </article>
            ))}
          </div>
        ) : (
          <div>
            <h2 className="font-bold text-gray-500">No reviews found</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantReview;
