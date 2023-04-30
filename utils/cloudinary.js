const { cloudinary } = require("./cloudinaryConfig");

module.exports.uploadToCloudinary = async (base64img) => {
  const uploadedResponse = await cloudinary.uploader.upload(base64img, {
    upload_preset: `${process.env.CLOUDINARY_UPLOAD_PRESET}`,
  });
    return { url: uploadedResponse.url, publicId: uploadedResponse.public_id };
};