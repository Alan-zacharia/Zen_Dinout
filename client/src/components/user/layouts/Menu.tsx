import { useState } from "react";

const RestaurantMenu = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const toggleModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setShowModal(!showModal);
  };

  return (
    <div className="xl:px-20">
      <h3 className="text-lg font-bold">Menu</h3>
      <div className="relative">
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300 cursor-pointer"
          onClick={() =>
            toggleModal(
              "https://marketplace.canva.com/EADanmZk70E/1/0/1131w/canva-green-italian-chef-restaurant-menu-bWKp8PISjfk.jpg"
            )
          }
        ></div>
        <img
          src="https://marketplace.canva.com/EADanmZk70E/1/0/1131w/canva-green-italian-chef-restaurant-menu-bWKp8PISjfk.jpg"
          alt=""
          className="w-44 h-44 transition duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg cursor-pointer"
          onClick={() =>
            toggleModal(
              "https://marketplace.canva.com/EADanmZk70E/1/0/1131w/canva-green-italian-chef-restaurant-menu-bWKp8PISjfk.jpg"
            )
          }
        />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-w-full max-h-full overflow-auto">
            <img src={selectedImage} alt="" className="max-w-full max-h-full" />
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
