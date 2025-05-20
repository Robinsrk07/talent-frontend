import { useRef, useState } from "react";
import Default from "../../assets/stock.jpg";

const Banner = () => {
 const [banner, setBanner] = useState({
  title: "",
  image: "",
  file: null // for resized image
});


  const resizeImage = (file, width = 1920, height = 600) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          const resizedFile = new File([blob], file.name, { type: file.type });
          const previewUrl = URL.createObjectURL(blob);
          resolve({ file: resizedFile, previewUrl });
        }, file.type);
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

  const [errors, setErrors] = useState({
    title: ""
  });

  const fileInputRef = useRef(null);

 const handleImageChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      const { file: resizedFile, previewUrl } = await resizeImage(file, 1920, 600);

      setBanner((prev) => ({
        ...prev,
        image: previewUrl, // for preview
        file: resizedFile  // actual file to upload if needed later
      }));
    } catch (error) {
      console.error("Image resizing failed", error);
    }
  }
};


  const handleTitleChange = (e) => {
  setBanner({ ...banner, title: e.target.value });
};

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

   const validateForm = () => {
  let isValid = true;
  const newErrors = { title: "" };

  if (!banner.title.trim()) {
    newErrors.title = "Banner content is required";
    isValid = false;
  } else if (banner.title.length < 10) {
    newErrors.title = "Content must be at least 10 characters";
    isValid = false;
  } else if (banner.title.length > 500) {
    newErrors.title = "Content cannot exceed 500 characters";
    isValid = false;
  }

  setErrors(newErrors);
  return isValid;
}
  return (

    <div className=" w-full flex flex-col ">
   <div className="flex flex-col lg:flex-row w-full m-2 rounded-lg bg-white p-8 gap-2">
        <div className="flex flex-col items-center w-full max-w-[300px] h-[300px] border border-gray-400 rounded-lg p-2">
              <img
                src={banner.image || Default}
                alt="Banner"
                className="w-[250px] h-[230px] object-cover rounded"
              />
              

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageChange}
              />

              <button
                className="bg-[#AE89FF] w-[200px] rounded-lg font-semibold text-white m-4"
                onClick={handleButtonClick}
              >
                Upload Image
              </button>
              <p> Images are converted to 1920* 600 px</p>
            </div>

                    <div className=" w-full min-h-[200px]  bg-white">
                            <label htmlFor="scrollContent" className="block text-sm font-medium text-gray-700 mb-2">
                                New Banner Content *
                            </label>
                            <textarea
                                id="bannerContent"
                                value={banner.title}
                                className={`w-full px-4 py-3 border ${errors.scroll ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                placeholder="Enter your scroll content here (10-500 characters)..."
                                onChange={handleTitleChange}
                                rows={4}
                            />
                            {errors.title && (
                                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {banner.title.length}/500 characters
                            </p>
                             <div className="flex justify-end mt-4">
                        <button
                          className="bg-[#6C63FF] hover:bg-[#5A52d4] transition-colors duration-200 px-6 py-2 text-white rounded-lg font-semibold"
                          onClick={() => {
                            if (validateForm()) {
                              console.log("✅ Banner updated:", banner);
                              // Add your update logic here
                            }
                          }}
                        >
                          Update Banner
                        </button>
                      </div>
                        </div>
                        
    </div>
    {/* Banner Table Section */}
<div className="overflow-x-auto p-4">
  <table className="min-w-[1050px] max-w-[1060px] bg-white border border-gray-300 rounded-lg">
    <thead>
      <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
        <th className="px-4 py-2 border-b w-[200px]" >Image</th>
        <th className="px-4 py-2 border-b w-[600px]">Title</th>
        <th className="px-4 py-2 border-b text-center w-[250px]">Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* Replace with actual data.map when connected to backend */}
      <tr className="hover:bg-gray-50 text-sm text-gray-700">
        <td className="px-4 py-2 border-b">
          <img src={banner.image || Default} alt="Banner" className="w-20 h-14 object-cover rounded" />
        </td>
       <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[600px]">
  {banner.title || <span className="text-gray-400 italic">No title</span>}
</td>

        <td className="px-4 py-2 border-b text-center space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
            onClick={() => {
              // TODO: Edit logic here
              alert("Edit clicked");
            }}
          >
            Edit
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
            onClick={() => {
              // TODO: Delete logic here
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

export default Banner;
