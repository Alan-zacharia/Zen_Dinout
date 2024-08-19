import { uploadImages } from "../../presentation/services/shared/imageService";

export const handleImageUploads = async (images: any) => {
  const uploadedImages = await uploadImages(
    Array.isArray(images) ? images : [images]
  );
  return uploadedImages.map((img: any) => ({
    public_id: img.public_id,
    url: img.secure_url,
  }));
};
