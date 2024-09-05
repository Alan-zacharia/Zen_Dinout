import React, { useState, useEffect } from "react";
import Form from "../layouts/Form";
import axiosInstance from "../../api/axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { MenuType } from "../../types/restaurantTypes";

const Menu: React.FC = () => {
  const [menuImages, setMenuImages] = useState<MenuType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchMenuImages = async () => {
      try {
        const response = await axiosInstance.get("/restaurant/menu");
        setMenuImages(response.data.menu);
      } catch (err) {
        toast.error("Failed to fetch menu.");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuImages();
  }, []);

  const handleDeleteMultiple = async () => {
    try {
      const ids = Array.from(selectedImages);
      if (ids.length === 0) {
        toast.error("No images selected for deletion.");
        return;
      }
      await axiosInstance.delete(`/restaurant/menu`, {
        params: { ids },
      });
      setMenuImages((prevMenu) => ({
        ...prevMenu!,
        items: prevMenu!.items.filter(
          (item) => !selectedImages.has(item.public_id)
        ),
      }));
      setSelectedImages(new Set());
      toast.success("Deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete images.");
    }
  };

  const toggleSelectImage = (public_id: string) => {
    setSelectedImages((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(public_id)) {
        newSelected.delete(public_id);
      } else {
        newSelected.add(public_id);
      }
      return newSelected;
    });
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color="#4A90E2" />
      </div>
    );
  }
  return (
    <div className="pt-14">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Menu</h1>
        <div className="flex justify-end">
          <Form />
        </div>
      </div>
      {menuImages && menuImages.items.length > 0 && (
        <div className="flex mb-4">
          <button
            onClick={handleDeleteMultiple}
            className="btn btn-error text-white"
            disabled={selectedImages.size === 0}
          >
            Delete Selected
          </button>
        </div>
      )}
      {!menuImages || !menuImages.items.length ? (
        <h1 className="text-2xl font-bold p-20">No menu found</h1>
      ) : (
        <div className="flex flex-wrap gap-5">
          {menuImages.items.map((menu, index) => (
            <div className="relative w-44 h-44 mb-16" key={index}>
              <img
                src={menu.url}
                alt="menuImg"
                className="h-56 w-44 object-cover"
                onLoad={()=>setLoading(false)}
              />
              <input
                type="checkbox"
                checked={selectedImages.has(menu.public_id)}
                onChange={() => toggleSelectImage(menu.public_id)}
                className="absolute top-1 size-5 right-1"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
