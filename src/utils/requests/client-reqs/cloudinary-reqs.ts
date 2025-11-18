import axios from "axios";

export const handleUpload = async (event: any, folderName: string) => {
  const file = event.target.files[0];
  if (!file) {
    return "Please select a post image.";
  }

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!validImageTypes.includes(file.type)) {
    return "The uploaded file is not a valid image!";
  }

  const img = new globalThis.Image();
  const imageLoaded = new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image."));
  });

  img.src = URL.createObjectURL(file);
  try {
    await imageLoaded;
    if (img.width / img.height > 2 || img.width / img.height < 1.1) {
      return `Invalid image dimensions.`;
    }
  } catch {
    return `There is problem, please try again later`;
  }
  // if ((type === "Post" && data.image !== "") || data.image !== oldImage) {
  //   await DELETE_IMAGE_REQ({
  //     fileName: `temporary-uploads/${data.image}`,
  //   });
  // }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "mio_present");
  formData.append("folder", `POWER_SOFT/CRM_System/${folderName}`);
  const response: any = await UPLOAD_IMAGE_REQ({ formData });
  if (response.done) {
    return response.filename;
  } else {
    return response.message;
  }
};

const UPLOAD_IMAGE_REQ = async ({ formData }: any) => {
  try {
    const response: any = await axios.post(
      `https://api.cloudinary.com/v1_1/doy0la086/image/upload`,
      formData
    );
    return response?.data?.public_id
      ? { done: true, filename: response?.data?.public_id }
      : {
          done: false,
          message: `There is problem, please try again later`,
          status: response.status,
        };
  } catch (error: any) {
    let message = `There is problem, please try again later`;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};
const DELETE_IMAGE_REQ = async ({
  fileName,
  cloudName,
  publicId,
}: {
  fileName: string;
  publicId: string;
  cloudName: string;
}) => {
  try {
    const response: any = await axios.delete(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?public_ids=${publicId}&type=upload`
    );
    return response?.data?.deleted[fileName] === "deleted"
      ? { done: true }
      : {
          done: false,
          message: `There is problem, please try again later`,
          status: response.status,
        };
  } catch (error: any) {
    let message = `There is problem, please try again later`;
    if (error?.response?.status !== 400) {
      message = error?.response?.data?.error?.message;
    }
    return {
      done: false,
      message: message,
      status: error.status,
    };
  }
};