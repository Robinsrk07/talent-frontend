import { useRef, useState, useEffect } from "react";
import Default from "../../assets/stock.jpg";
import axios from "axios";
import { toast } from "react-toastify";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [banner, setBanner] = useState({
    title: "",
    image: "",
    file: null,
    active: true
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentBannerId, setCurrentBannerId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [errors, setErrors] = useState({
    title: ""
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/allbanners`);
      setBanners(response.data);
    } catch (error) {
      toast.error("Failed to fetch banners");
      console.error("Error fetching banners:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setBanner(prev => ({
        ...prev,
        image: previewUrl,
        file: file
      }));
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
  };

  const resetForm = () => {
    setBanner({
      title: "",
      image: "",
      file: null,
      active: true
    });
    setIsEditing(false);
    setCurrentBannerId(null);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('title', banner.title);
      formData.append('active', banner.active);
      if (banner.file) {
        formData.append('image', banner.file);
      }

      let response;
      if (isEditing && currentBannerId) {
        response = await axios.put(`${BASE_URL}/banner/${currentBannerId}`, formData, {
          withCredentials: true,
        });
        toast.success("Banner updated successfully");
      } else {
        response = await axios.post(`${BASE_URL}/upload-image`, formData, {
          withCredentials: true,
        });
        toast.success("Banner created successfully");
      }

      fetchBanners();
      resetForm();
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} banner`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (bannerItem) => {
    setBanner({
      title: bannerItem.title,
      image: bannerItem.filename ? `${BASE_URL}/uploads/${bannerItem.filename}` : "",
      file: null,
      active: bannerItem.active
    });
    setIsEditing(true);
    setCurrentBannerId(bannerItem.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${BASE_URL}/banner/${id}`, { withCredentials: true });
        toast.success("Banner deleted successfully");
        fetchBanners();
      } catch (error) {
        console.error("Error deleting banner:", error);
        toast.error("Failed to delete banner");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col">
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
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Upload Image"}
          </button>
        </div>

        <div className="w-full min-h-[200px] bg-white">
          <label htmlFor="scrollContent" className="block text-sm font-medium text-gray-700 mb-2">
            Banner Content *
          </label>
          <textarea
            id="bannerContent"
            value={banner.title}
            className={`w-full px-4 py-3 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
            placeholder="Enter your scroll content here (10-500 characters)..."
            onChange={handleTitleChange}
            rows={4}
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            {banner.title.length}/500 characters
          </p>
          
          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="active"
              checked={banner.active}
              onChange={(e) => setBanner({...banner, active: e.target.checked})}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            {isEditing && (
              <button
                className="bg-gray-500 hover:bg-gray-600 transition-colors duration-200 px-6 py-2 text-white rounded-lg font-semibold"
                onClick={resetForm}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              className="bg-[#6C63FF] hover:bg-[#5A52d4] transition-colors duration-200 px-6 py-2 text-white rounded-lg font-semibold"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isEditing ? "Update Banner" : "Add Banner"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Banner Table Section */}
      <div className="overflow-x-auto p-4">
        <table className="min-w-[1050px] max-w-[1060px] bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border-b w-[200px]">Image</th>
              <th className="px-4 py-2 border-b w-[400px]">Title</th>
              <th className="px-4 py-2 border-b w-[100px]">Status</th>
              <th className="px-4 py-2 border-b text-center w-[250px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && banners.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center">
                  Loading banners...
                </td>
              </tr>
            ) : banners.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center">
                  No banners found
                </td>
              </tr>
            ) : (
              banners.map((bannerItem) => (
                <tr key={bannerItem.id} className="hover:bg-gray-50 text-sm text-gray-700">
                  <td className="px-4 py-2 border-b">
                    <img 
                      src={bannerItem.filename ? `${BASE_URL}/uploads/${bannerItem.filename}` : Default}
                      alt="Banner" 
                      className="w-20 h-14 object-cover rounded" 
                    />
                  </td>
                  <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[400px]">
                    {bannerItem.title || <span className="text-gray-400 italic">No title</span>}
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      bannerItem.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {bannerItem.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleEdit(bannerItem)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(bannerItem.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banner;