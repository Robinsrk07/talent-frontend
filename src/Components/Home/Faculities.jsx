import { useRef, useState, useEffect } from "react";
import Default from "../../assets/stock.jpg";

const Faculties = () => {
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 }); // Store original dimensions
  const [content, setContent] = useState({
    title: "",
    subTitle: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    subTitle: "",
    image: "",
  });

  // Validation constants
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const resizeImage = (file, width = 1090, height = 800) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const resizedFile = new File([blob], file.name, { type: file.type });
              const previewUrl = URL.createObjectURL(blob);
              resolve({ file: resizedFile, previewUrl });
            },
            file.type,
            0.8
          );
        };

        img.onerror = (err) => reject(err);
      };

      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const validateInput = (name, value) => {
    if (value.length < MIN_LENGTH) {
      return `${name} must be at least ${MIN_LENGTH} characters long`;
    }
    if (value.length > MAX_LENGTH) {
      return `${name} must not exceed ${MAX_LENGTH} characters`;
    }
    return "";
  };

  const validateImage = (file) => {
    if (!file) return "Please select an image";
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return "Only JPEG or PNG images are allowed";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Image size must not exceed 5MB";
    }
    return "";
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageError = validateImage(file);
      if (imageError) {
        setErrors((prev) => ({ ...prev, image: imageError }));
        setPreviewUrl(null);
        setUploadedFile(null);
        setImageDimensions({ width: 0, height: 0 });
        fileInputRef.current.value = "";
        return;
      }

      try {
        // Get original image dimensions
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.src = objectUrl;

        await new Promise((resolve, reject) => {
          img.onload = () => {
            setImageDimensions({ width: img.width, height: img.height });
            URL.revokeObjectURL(objectUrl);
            resolve();
          };
          img.onerror = (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
          };
        });

        // Resize the image
        const { file: resizedFile, previewUrl: newPreviewUrl } = await resizeImage(file, 1090, 800);

        // Revoke previous URL if exists
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }

        // Set resized file and preview
        setPreviewUrl(newPreviewUrl);
        setUploadedFile(resizedFile);
        setErrors((prev) => ({ ...prev, image: "" }));
      } catch (error) {
        setErrors((prev) => ({ ...prev, image: "Failed to process image" }));
        setPreviewUrl(null);
        setUploadedFile(null);
        setImageDimensions({ width: 0, height: 0 });
        fileInputRef.current.value = "";
      }
    } else {
      setErrors((prev) => ({ ...prev, image: "Please select an image" }));
      setPreviewUrl(null);
      setUploadedFile(null);
      setImageDimensions({ width: 0, height: 0 });
      fileInputRef.current.value = "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));

    const error = validateInput(name === "title" ? "Title" : "Subtitle", value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

const handleUpload = async () => {
  const titleError = validateInput("Title", content.title);
  const subTitleError = validateInput("Subtitle", content.subTitle);
  const imageError = !uploadedFile ? "Please select an image" : validateImage(uploadedFile);

  setErrors({
    title: titleError,
    subTitle: subTitleError,
    image: imageError,
  });

  if (titleError || subTitleError || imageError) {
    return;
  }

  const formData = new FormData();
  formData.append("title", content.title.trim());
  formData.append("subTitle", content.subTitle.trim());
  formData.append("photo", uploadedFile);

  // Log dimensions (original and resized)
  console.log("Form Data:", {
    title: content.title,
    subTitle: content.subTitle,
    file: uploadedFile,
    originalDimensions: `${imageDimensions.width}x${imageDimensions.height} pixels`,
    resizedDimensions: "1090x800 pixels",
  });

  try {
    // Make POST API call
    const response = await fetch("https://your-api.com/update", {
      method: "POST",
      body: formData,
      // Optional: Add headers if needed (e.g., for authentication)
      // headers: {
      //   Authorization: `Bearer ${yourToken}`,
      // },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

    // Reset form only on successful response
    setContent({ title: "", subTitle: "" });
    setUploadedFile(null);
    setPreviewUrl(null);
    setImageDimensions({ width: 0, height: 0 });
    fileInputRef.current.value = "";
    setErrors({ title: "", subTitle: "", image: "" });

    // Optional: Show success message to user
    alert("Update successful!");
  } catch (error) {
    console.error("API Error:", error.message);
    setErrors((prev) => ({
      ...prev,
      image: "Failed to upload data. Please try again.",
    }));
  }
};

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col lg:flex-row w-full m-2 rounded-lg bg-white p-8 gap-2">
        <div className="flex flex-col items-center w-full max-w-[300px] h-[300px] border border-gray-400 rounded-lg p-2">
          <img
            src={previewUrl || Default}
            alt="Banner Preview"
            className="w-[250px] h-[230px] object-cover rounded"
          />

          <input
            type="file"
            accept="image/jpeg,image/png"
            ref={fileInputRef}
            className="hidden"
            onChange={handlePhotoUpload}
            multiple={false}
          />

          <button
            className="bg-[#AE89FF] w-[200px] rounded-lg font-semibold text-white m-4"
            onClick={handleButtonClick}
          >
            Upload Image
          </button>

          {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
          <p>Images are converted to 1090*800 px</p>
        </div>

        <div className="w-full min-h-[200px] bg-white">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            New Main Title *
          </label>
          <textarea
            id="title"
            name="title"
            value={content.title}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.title ? "border-red-500" : ""
            }`}
            placeholder="Enter your Main content here (10-500 characters)..."
            onChange={handleInputChange}
            rows={3}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          <p className="mt-1 text-xs text-gray-500">{content.title.length}/{MAX_LENGTH} characters</p>

          <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Sub Title *
          </label>
          <textarea
            id="subTitle"
            name="subTitle"
            value={content.subTitle}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.subTitle ? "border-red-500" : ""
            }`}
            placeholder="Enter your Main content here (10-500 characters)..."
            onChange={handleInputChange}
            rows={3}
          />
          {errors.subTitle && <p className="mt-1 text-sm text-red-600">{errors.subTitle}</p>}
          <p className="mt-1 text-xs text-gray-500">{content.subTitle.length}/{MAX_LENGTH} characters</p>

          <div className="flex justify-end mt-4">
            <button
              className="bg-[#6C63FF] hover:bg-[#5A52d4] transition-colors duration-200 px-6 py-2 text-white rounded-lg font-semibold"
              onClick={handleUpload}
            >
              Upload data
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-[1050px] max-w-[1060px] bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border-b w-[200px]">Image</th>
              <th className="px-4 py-2 border-b w-[600px]">Title</th>
              <th className="px-4 py-2 border-b text-center w-[250px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-50 text-sm text-gray-700">
              <td className="px-4 py-2 border-b">
                <img src={previewUrl || Default} alt="Banner" className="w-20 h-14 object-cover rounded" />
              </td>
              <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[600px]">
                {content.title || <span className="text-gray-400 italic">No title</span>}
              </td>
              <td className="px-4 py-2 border-b text-center space-x-2">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => {
                    alert("Edit clicked");
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  onClick={() => {
                    alert("Delete clicked");
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Faculties;