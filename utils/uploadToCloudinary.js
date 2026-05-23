import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ahir-samaj/results",
        resource_type: "auto", // handles both PDF and images
        public_id: `${Date.now()}-${originalName.replace(/\s+/g, "-")}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    uploadStream.end(fileBuffer);
  });
};
