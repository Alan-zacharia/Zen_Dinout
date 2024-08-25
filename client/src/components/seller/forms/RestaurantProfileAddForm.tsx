import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import GoogleMap from "../../GoogleMap";
import CuisinesAddForm from "../forms/CuisinesAddForm";
import { useFormik } from "formik";
import {
  RestaurantDetailType,
  RestaurantImageType,
} from "../../../types/restaurantTypes";
import { RootState } from "../../../redux/store";
import axiosInstance from "../../../api/axios";
import { restaurantProfileValidationSchema } from "../../../validations/restaurantValidationSchema";
import { getLocations } from "../../../services/getPlaceApi";
import { IoRemoveCircle } from "react-icons/io5";
import toast from "react-hot-toast";
import { Modal, Button } from "@mui/material";
import { TiDeleteOutline } from "react-icons/ti";

const RestaurantProfileAddForm: React.FC = () => {
  const { id } = useSelector((state: RootState) => state.user);
  const [restaurantDetails, setRestaurantDetails] =
    useState<RestaurantDetailType | null>(null);
  const featuredImageRef = useRef<HTMLInputElement | null>(null);
  const [suggestion, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<string[]>([]);
  const [images, setImages] = useState<RestaurantImageType[]>([]);
  const [featuredImage, setFeaturedImage] =
    useState<RestaurantImageType | null>(null);
  const [lat, setLat] = useState<number>(10.0);
  const [lng, setLng] = useState<number>(76.5);
  const [selectedImagesForDeletion, setSelectedImagesForDeletion] = useState<
    string[]
  >([]);
  const [open, setOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      restaurantName: "",
      email: "",
      contact: "",
      description: "",
      tableRate: 200,
      place_name: "",
      location: {
        type: "",
        coordinates: [0, 0],
      },
      address: "",
      openingTime: "",
      closingTime: "",
      cuisines: [""],
      vegOrNonVegType: "both",
      featuredImage: "",
      secondaryImages: [],
    },
    validationSchema: restaurantProfileValidationSchema,
    onSubmit: async (datas) => {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("restaurantName", datas.restaurantName || "");
        formData.append("email", datas.email || "");
        formData.append("contact", datas.contact || "");
        formData.append("description", datas.description || "");
        formData.append(
          "tableRate",
          datas.tableRate ? datas.tableRate.toString() : "200"
        );
        formData.append("place_name", datas.place_name || "");
        formData.append("location", JSON.stringify(datas.location || {}));
        formData.append("address", datas.address || "");
        formData.append("openingTime", datas.openingTime || "");
        formData.append("closingTime", datas.closingTime || "");
        formData.append("vegOrNonVegType", datas.vegOrNonVegType || "both");
        datas.cuisines.forEach((cuisine) => {
          formData.append("cuisines", cuisine);
        });

        if (image) {
          formData.append("featuredImage", datas.featuredImage);
        }
        if (secondaryImages && secondaryImages.length > 0) {
          datas.secondaryImages.forEach((img) => {
            if (img) formData.append("secondaryImages", img);
          });
        }

        const res = await axiosInstance.put(
          `/restaurant/restaurant-details/${id}`,
          formData
        );
        setFeaturedImage(res.data.restaurant.featuredImage);
        setImages(res.data.restaurant.secondaryImages);
        setSecondaryImages([]);
        toast.success("Update successfully..");
      } catch (error) {
        toast.error("Something went wrong....");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/restaurant/restaurant-details/${id}`
        );
        const restaurantDetails = res.data.restaurantDetails;
        const openingTime = new Date(
          restaurantDetails.openingTime
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });

        const closingTime = new Date(
          restaurantDetails.closingTime
        ).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        });
        formik.setValues({
          ...restaurantDetails,
          openingTime,
          closingTime,
        });
        setLat(restaurantDetails.location.coordinates[1]);
        setLng(restaurantDetails.location.coordinates[0]);
        setRestaurantDetails(restaurantDetails);
        setFeaturedImage(restaurantDetails.featuredImage);
        setImages(restaurantDetails.secondaryImages);
      } catch (error) {
        console.error(error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    formik.setFieldValue("place_name", value);
    try {
      if (value.trim() !== "") {
        const data = await getLocations(value);
        setSuggestions(data);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const handleSuggestions = (suggestion: any) => {
    const lat = suggestion.center[1];
    const lng = suggestion.center[0];
    const search = suggestion.place_name;

    formik.setValues({
      ...formik.values,
      place_name: search,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },
    });

    setLat(lat);
    setLng(lng);
    setSuggestions([]);
  };

  const handleFeaturedImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFeaturedImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFeaturedImage(file);
      formik.setFieldValue("featuredImage", file);
    }
  };

  const handleFeaturedImageDelete = () => {
    setImage("");
    if (featuredImageRef.current) {
      featuredImageRef.current.value = "";
    }
  };

  const handleImageDelete = (imageId: string) => {
    axiosInstance
      .delete("/restaurant/featuredImage", { params: { imageId } })
      .then((res) => {
        setFeaturedImage(null);
        setImage(null);
        toast.success("Deleted successfully...");
      })
      .catch((response) => {
        console.log(response); 
      });
  };

  const handleSecondaryImage = (files: any) => {
    const images: any = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = () => {
          images.push(reader.result);
          if (images.length === files.length) {
            setSecondaryImages(images);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };
  const handleSecondaryImageChange = (event: any) => {
    const files = Array.from(event.target.files);
    handleSecondaryImage(files);
    formik.setFieldValue("secondaryImages", files);
  };

  const handleDeleteSecondaryImage = (imageId: string) => {
    if (imageId) {
      setSelectedImagesForDeletion((prev) => {
        if (prev.includes(imageId)) {
          return prev.filter((id) => id !== imageId);
        } else {
          return [...prev, imageId];
        }
      });
    }
  };
  const handleDeleteSelectedImages = async () => {
    await axiosInstance
      .delete("/restaurant/secondary-images", {
        params: { ids: selectedImagesForDeletion },
      })
      .then((res) => {
        setImages((img) => {
          return img.filter(
            (img) => !selectedImagesForDeletion.includes(img.public_id)
          );
        });
        setSelectedImagesForDeletion([]);
        toast.success("Deleted successfully...");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOpen = (publicId: string) => {
    setImageToDelete(publicId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setImageToDelete(null);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      handleImageDelete(imageToDelete);
    }
    handleClose();
  };
  return (
    <section>
      <form
        className="px-4 md:px-10 lg:px-16 font-semibold"
        onSubmit={formik.handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block">Restaurant name</label>
            <input
              type="text"
              placeholder="Restaurant name"
              className="input input-bordered input-warning w-full max-w-xs h-11"
              {...formik.getFieldProps("restaurantName")}
            />
            {formik.touched.restaurantName && formik.errors.restaurantName && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.restaurantName}
              </div>
            )}
          </div>

          <div>
            <label className="block">Email</label>
            <input
              type="text"
              placeholder="Email"
              className="input input-bordered input-warning w-full h-11 max-w-xs cursor-not-allowed"
              readOnly
              {...formik.getFieldProps("email")}
            />
          </div>
          <div>
            <label className="block">Contact</label>
            <input
              type="text"
              placeholder="Phone number"
              className="input input-bordered input-warning w-full h-11 max-w-xs"
              {...formik.getFieldProps("contact")}
            />
            {formik.submitCount > 0 && formik.errors.contact && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.contact}
              </div>
            )}
          </div>
          <div className="flex gap-3 items-center pb-5">
            <div className="relative">
              <label className="block">Table rate</label>
              <input
                type="number"
                placeholder="399"
                className="input input-bordered input-warning w-48 h-11 max-w-xs"
                {...formik.getFieldProps("tableRate")}
              />
              {formik.submitCount > 0 && formik.errors.tableRate && (
                <div className="text-red-500  pt-2 text-sm absolute ">
                  {formik.errors.tableRate}
                </div>
              )}
            </div>
            <div className="relative">
              <select
                id="foodType"
                className="select select-warning mt-7 font-bold "
                {...formik.getFieldProps("vegOrNonVegType")}
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="both">veg&Non-veg</option>
              </select>
              {formik.submitCount > 0 && formik.errors.vegOrNonVegType && (
                <div className="text-red-500 text-sm absolute ">
                  {formik.errors.vegOrNonVegType}
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block">Description</label>
            <textarea
              placeholder="Description"
              className="textarea textarea-warning w-full max-w-xs"
              {...formik.getFieldProps("description")}
            />
            {formik.submitCount > 0 && formik.errors.description && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.description}
              </div>
            )}
          </div>
          <div>
            <label className="block">Address</label>
            <textarea
              placeholder="Address"
              className="textarea textarea-warning w-full max-w-xs"
              {...formik.getFieldProps("address")}
            />
            {formik.errors.address && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.address}
              </div>
            )}
          </div>
        </div>
        <div className="pt-2">
          <label className="block">Location</label>
          <div className="flex flex-col md:flex-row gap-5 pt-2 items-center">
            <div className="flex flex-col lg:w-[500px] w-[300px]">
              <input
                type="text"
                placeholder="place_name"
                className="input input-bordered input-warning w-[300px] max-w-sm lg:max-w-[500px]"
                {...formik.getFieldProps("place_name")}
                onChange={handleChange}
              />
              {formik.errors.place_name && formik.submitCount > 0 && (
                <div className="text-red-500 text-sm pt-2">
                  {formik.errors.place_name}
                </div>
              )}
              {suggestion && (
                <ul className=" w-[300px] mt-2 overflow-x-auto h-32 bg-white">
                  {suggestion?.map((suggestion: any, index) => (
                    <li
                      key={index}
                      className="px-4 py-3 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSuggestions(suggestion)}
                    >
                      {suggestion.place_name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="border border-orange-400 h-64 lg:w-[500px] w-[300px] rounded-lg">
              <GoogleMap latitude={lat} longitude={lng} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2">
          <div>
            <label className="block">Opening time</label>
            <input
              type="time"
              placeholder="Opening time"
              className="input input-bordered input-warning w-full max-w-xs h-11"
              {...formik.getFieldProps("openingTime")}
            />
            {formik.errors.openingTime && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.openingTime}
              </div>
            )}
          </div>
          <div>
            <label className="block">Closing time</label>
            <input
              type="time"
              placeholder="Closing time"
              className="input input-bordered input-warning w-full max-w-xs h-11"
              {...formik.getFieldProps("closingTime")}
            />
            {formik.errors.closingTime && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.closingTime}
              </div>
            )}
          </div>
        </div>
        <div className="pt-2">
          <label className="block">Add cuisines</label>
          <CuisinesAddForm
            cuisines={formik.values.cuisines}
            setCuisines={(cuisines) =>
              formik.setFieldValue("cuisines", cuisines)
            }
          />
          {formik.errors.cuisines && formik.submitCount > 0 && (
            <div className="text-red-500 text-sm pt-2">
              {formik.errors.cuisines}
            </div>
          )}
        </div>
        <div className="pt-5 flex flex-col gap-5">
          <label htmlFor="FeaturedImage">Featured Image</label>
          <div className="flex flex-col w-full max-w-xs">
            {!featuredImage && image ? (
              <div className="relative">
                <img src={image} alt="" />
                <div
                  className="tooltip tooltip-error absolute top-0 right-0 cursor-pointer"
                  data-tip="Remove"
                >
                  <IoRemoveCircle
                    className="text-error size-6"
                    onClick={handleFeaturedImageDelete}
                  />
                </div>
              </div>
            ) : featuredImage ? (
              <div className="relative">
                <TiDeleteOutline
                  size={25}
                  className="absolute top-0 right-0  text-red-500"
                  onClick={() => handleOpen(featuredImage?.public_id as string)}
                />
                <img src={featuredImage?.url} alt="" />
              </div>
            ) : (
              <>
                <label htmlFor="fileInput" className="relative cursor-pointer">
                  <div className="w-full h-44 border-4 border-dashed border-gray-400 flex items-center justify-center overflow-hidden">
                    <span className="text-gray-500">Upload Main Image</span>
                  </div>
                </label>
              </>
            )}
            <input
              type="file"
              className="file-input file-input-bordered file-input-accent w-full max-w-xs mt-3"
              onChange={handleFeaturedImageChange}
              accept=".jpg, .jpeg, .png"
              ref={featuredImageRef}
            />
            {formik.errors.featuredImage && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.featuredImage}
              </div>
            )}

            <Modal open={open} onClose={handleClose}>
              <div className="flex items-center justify-center min-h-screen">
                <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-semibold mb-4">
                    Are you sure you want to delete this image?
                  </h2>
                  <div className="flex justify-end space-x-4">
                    <Button
                      onClick={confirmDelete}
                      color="primary"
                      variant="contained"
                    >
                      Yes
                    </Button>
                    <Button
                      onClick={handleClose}
                      color="secondary"
                      variant="outlined"
                    >
                      No
                    </Button>
                  </div>
                </div>
              </div>
            </Modal>
          </div>
        </div>

        <div className="pt-5 flex flex-col gap-5">
          <label htmlFor="SecondaryImages">Secondary Images</label>
          <div className="flex flex-col w-full ">
            {images && images.length > 0 && (
              <div className="flex gap-2 overflow-auto no-scrollbar pb-5 ">
                {images.map((image) => (
                  <div className="relative ">
                    <input
                      type="checkbox"
                      className="absolute top-0 right-0 size-4"
                      checked={selectedImagesForDeletion.includes(
                        image.public_id
                      )}
                      onClick={() =>
                        handleDeleteSecondaryImage(image.public_id)
                      }
                    />
                    <img src={image.url} alt="" className="w-44 h-44" />
                  </div>
                ))}
              </div>
            )}
            {selectedImagesForDeletion.length > 0 && (
              <button
                onClick={handleDeleteSelectedImages}
                className="mt-4 btn hover:bg-red-200"
                type="button"
              >
                Delete Selected Images
              </button>
            )}

            {secondaryImages && secondaryImages.length > 0 && (
              <>
                <p className="pb-2">New Images</p>
                <div className="flex gap-1 overflow-auto no-scrollbar">
                  {secondaryImages.map((image) => (
                    <img src={image} alt="" className="w-44 h-44" />
                  ))}
                </div>
              </>
            )}
            <input
              type="file"
              multiple
              className="file-input file-input-bordered file-input-accent w-full max-w-xs mt-3"
              onChange={handleSecondaryImageChange}
              accept=".jpg, .jpeg, .png"
            />
            {formik.errors.secondaryImages && formik.submitCount > 0 && (
              <div className="text-red-500 text-sm pt-2">
                {formik.errors.secondaryImages}
              </div>
            )}
          </div>
        </div>
        <div className="pt-2 pb-2 flex justify-center">
          <button className="btn btn-warning font-bold" disabled={loading}>
            Save Changes
            <span
              className={`${loading ? " loading loading-spinner" : ""}`}
            ></span>
          </button>
        </div>
      </form>
    </section>
  );
};

export default RestaurantProfileAddForm;
