import { useEffect, useState } from "react";
import axios from "axios";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GalleryClient = () => {
  const [images, setImages] = useState([]);
  console.log(images);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/gallery`);

      if (res.status !== 200) {
        throw new Error("Failed to fetch images");
      }
      setImages(res.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 p-4">
      {images.map((image, index) => (
        <div
          key={index}
          className="overflow-hidden shadow-lg flex flex-col"
          style={{ width: "100%" }}
        >
          <div className="w-full h-48 overflow-hidden">
            <img
              src={`${VITE_API_BASE_URL}/uploads/${image.filename}`}
              alt={image.description || `Gallery Image ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold">{image.title}</h3>
            <p className="text-gray-600">{image.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleryClient;
