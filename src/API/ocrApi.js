import axios from "axios";

export const uploadOCR = async (file, docType) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("docType", docType);

  try {
    const response = await axios.post(
      "http://localhost:5000/api/ocr/extract",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("OCR Universal API Error:", error);
    throw error;
  }
};
