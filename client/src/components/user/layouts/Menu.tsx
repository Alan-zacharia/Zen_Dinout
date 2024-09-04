// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import { MenuType } from "../../../types/restaurantTypes";

// const RestaurantMenu = () => {
//   const [showModal, setShowModal] = useState(false);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [menuImages, setMenuImages] = useState<MenuType | null>(null);
//   const { restaurantId } = useParams();
//   const toggleModal = (imageSrc: string) => {
//     setSelectedImage(imageSrc);
//     setShowModal(!showModal);
//   };
//   useEffect(() => {
//     const fetchMenuImages = async () => {
//       try {
//         console.log(restaurantId);
//         if (restaurantId) {
//           const res = await axios.get(
//             `${import.meta.env.VITE_API_BASE_URL}/api/menu/${restaurantId}`
//           );
//           setMenuImages(res.data?.menu);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchMenuImages();
//   }, [restaurantId]);
//   console.log(menuImages);
//   return (
//     <div className="xl:px-20">
//       <h3 className="text-lg font-bold">Menu</h3>
//       {menuImages &&
//         menuImages.items &&
//         menuImages.items.map((data) => (
//           <div className="relative">
//             <div
//               className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300 cursor-pointer"
//               onClick={() => toggleModal(data.url)}
//             ></div>
//             <img
//               src={data.url}
//               alt=""
//               className="w-44 h-44 transition duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg cursor-pointer"
//               onClick={() => toggleModal(data.url)}
//             />
//           </div>
//         ))}

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="max-w-full max-h-full overflow-auto">
//             <img src={selectedImage} alt="" className="max-w-full max-h-full" />
//             <button
//               className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
//               onClick={() => setShowModal(false)}
//             >
//               &times;
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RestaurantMenu;

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import { MenuType } from "../../../types/restaurantTypes";
/* In your CSS file or index.css */
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [menuImages, setMenuImages] = useState<MenuType | null>(null);
  const { restaurantId } = useParams();

  const toggleModal = (index: number) => {
    setSelectedImageIndex(index);
    setShowModal(!showModal);
  };

  useEffect(() => {
    const fetchMenuImages = async () => {
      try {
        if (restaurantId) {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/menu/${restaurantId}`
          );
          setMenuImages(res.data?.menu);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMenuImages();
  }, [restaurantId]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: selectedImageIndex,
  };

  return (
    <div className="xl:px-20">
      <h3 className="text-lg font-bold">Menu</h3>
      {menuImages && menuImages.items.length > 0 && (
        <div className="relative">
          <img
            src={menuImages.items[0].url}
            alt="Menu Item"
            className="w-44 h-44 transition duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg cursor-pointer"
            onClick={() => toggleModal(0)}
          />
        </div>
      )}

      {showModal && menuImages && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="relative  max-w-4xl max-h-4xl rounded-lg shadow-lg">
            <Slider {...sliderSettings}>
              {menuImages.items.map((data, index) => (
                <div
                  key={index}
                  className="h-[90vh] flex items-center justify-center"
                >
                  <img
                    src={data.url}
                    alt={`Menu Item ${index}`}
                    className="w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </Slider>
            <button
              className="absolute top-4 right-4 text-white text-2xl focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
