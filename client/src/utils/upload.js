import axios from "axios";

const upload = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ThemeCrafted");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dggxubswq/image/upload",
      data
    );

    const { secure_url } = res.data;
    return secure_url;
  } catch (error) {
    console.log(error);
  }
};

export default upload;