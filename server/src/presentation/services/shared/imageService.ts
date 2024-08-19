import cloudinary from "../../../configs/cloudinaryConfig";

export const uploadImages = async (images: string[]) => {
  const uploadPromises = images.map((image: any) => {
    return cloudinary.uploader.upload(image, {
      folder: "restaurants",
    });
  });
  return await Promise.all(uploadPromises);
};

export const removeuploadedImage = async (imageId : string) => {
  try {
      await cloudinary.uploader.destroy(imageId);
  } catch (error) {
    throw new Error("Failed to delete images from Cloudinary");
  }
};
