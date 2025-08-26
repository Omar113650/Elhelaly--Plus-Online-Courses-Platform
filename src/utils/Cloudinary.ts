import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";
import dotenv from "dotenv";
import { Readable } from "stream";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const cloudinaryUpload = async (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "video" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

export const cloudinaryRemove = async (
  publicId: string
): Promise<{ result: string } | UploadApiErrorResponse> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
    return result;
  } catch (error: any) {
    console.error("Failed to remove video from Cloudinary:", error);
    return error;
  }
};

/**
 * @desc حذف عدة فيديوهات دفعة واحدة من Cloudinary
 * @param publicIds - مصفوفة بالمعرفات العامة للفيديوهات
 */
export const cloudinaryRemoveMultiple = async (
  publicIds: string[]
): Promise<any> => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "video",
    });
    return result;
  } catch (error: any) {
    console.error("Failed to remove multiple videos from Cloudinary:", error);
    return error;
  }
};
