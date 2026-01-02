const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "wemakecorder/roadmaps",
    resource_type: "raw", // ✅ FORCE RAW FOR PDFs
    public_id: () => `roadmap_${Date.now()}`,
  },
});

module.exports = { cloudinary, storage };
