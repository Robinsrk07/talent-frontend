import { useRef, useState, useEffect } from "react";
import Default from "../../assets/stock.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const Faculties = () => {
  const fileInputRef = useRef(null);
  const [faculties, setFaculties] = useState([]);
  const [currentFaculty, setCurrentFaculty] = useState({
    id: null,
    title: "",
    subTitle: "",
    file: null,
    previewUrl: null,
    active: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    subTitle: "",
    image: ""
  });

  // Validation constants
  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

  // API base URL from environment variables
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (currentFaculty.previewUrl) {
        URL.revokeObjectURL(currentFaculty.previewUrl);
      }
    };
  }, [currentFaculty.previewUrl]);

  // Fetch all faculties on component mount
  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/faculty-main`,{withCredentials: true});
      setFaculties(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch faculty data");
      console.error("Error fetching faculties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateInput = (name, value) => {
    if (!value.trim()) {
      return `${name} is required`;
    }
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
    if (!file) return;

    const imageError = validateImage(file);
    if (imageError) {
      setErrors((prev) => ({ ...prev, image: imageError }));
      resetImageState();
      fileInputRef.current.value = "";
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setCurrentFaculty(prev => ({
        ...prev,
        file,
        previewUrl
      }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, image: "Failed to process image" }));
      resetImageState();
      fileInputRef.current.value = "";
    }
  };

  const resetImageState = () => {
    setCurrentFaculty(prev => ({
      ...prev,
      file: null,
      previewUrl: null
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setCurrentFaculty(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateInput(name === "title" ? "Title" : "Subtitle", value);
    setErrors((prev) => ({
      ...prev,
      [name]: error
    }));
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const titleError = validateInput("Title", currentFaculty.title);
    const subTitleError = validateInput("Subtitle", currentFaculty.subTitle);
    const imageError = isEditing && !currentFaculty.file ? "" : validateImage(currentFaculty.file);

    setErrors({
      title: titleError,
      subTitle: subTitleError,
      image: imageError
    });

    return !(titleError || subTitleError || imageError);
  };

  const resetForm = () => {
    setCurrentFaculty({
      id: null,
      title: "",
      subTitle: "",
      file: null,
      previewUrl: null,
      active: false
    });
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("title", currentFaculty.title.trim());
      formData.append("subtitle", currentFaculty.subTitle.trim());
      formData.append("active", currentFaculty.active.toString());
      if (currentFaculty.file) {
        formData.append("image", currentFaculty.file);
      }

      let response;
      if (isEditing && currentFaculty.id) {
        response = await axios.put(
          `${API_BASE_URL}/faculty-main/${currentFaculty.id}`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Faculty updated successfully");
      } else {
        response = await axios.post(
          `${API_BASE_URL}/faculty-main`,
          formData,
          {
            withCredentials: true,
          }
        );
        toast.success("Faculty created successfully");
      }

      fetchFaculties();
      resetForm();
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} faculty`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (faculty) => {
    setCurrentFaculty({
      id: faculty.id,
      title: faculty.title,
      subTitle: faculty.subtitle,
      file: null,
      previewUrl: faculty.filename ? `${API_BASE_URL}/uploads/${faculty.filename}` : null,
      active: faculty.active
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_BASE_URL}/faculty-main/${id}`, { withCredentials: true });
        toast.success("Faculty deleted successfully");
        fetchFaculties();
      } catch (error) {
        console.error("Error deleting faculty:", error);
        toast.error("Failed to delete faculty");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      setIsLoading(true);
      await axios.patch(`${API_BASE_URL}/faculty-main/${id}/activate`, {}, { withCredentials: true });
      toast.success("Active status updated");
      fetchFaculties();
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update active status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col lg:flex-row w-full m-2 rounded-lg bg-white p-8 gap-2">
        <div className="flex flex-col items-center w-full max-w-[300px] h-[300px] border border-gray-400 rounded-lg p-2">
          <img
            src={currentFaculty.previewUrl || Default}
            alt="Faculty Preview"
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
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Upload Image"}
          </button>

          {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
        </div>

        <div className="w-full min-h-[200px] bg-white">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Main Title *
          </label>
          <textarea
            id="title"
            name="title"
            value={currentFaculty.title}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.title ? "border-red-500" : ""
            }`}
            placeholder="Enter your Main content here (10-500 characters)..."
            onChange={handleInputChange}
            rows={3}
            disabled={isLoading}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          <p className="mt-1 text-xs text-gray-500">{currentFaculty.title.length}/{MAX_LENGTH} characters</p>

          <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700 mb-2">
            Sub Title *
          </label>
          <textarea
            id="subTitle"
            name="subTitle"
            value={currentFaculty.subTitle}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              errors.subTitle ? "border-red-500" : ""
            }`}
            placeholder="Enter your Sub content here (10-500 characters)..."
            onChange={handleInputChange}
            rows={3}
            disabled={isLoading}
          />
          {errors.subTitle && <p className="mt-1 text-sm text-red-600">{errors.subTitle}</p>}
          <p className="mt-1 text-xs text-gray-500">{currentFaculty.subTitle.length}/{MAX_LENGTH} characters</p>

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="active"
              checked={currentFaculty.active}
              onChange={(e) => setCurrentFaculty(prev => ({
                ...prev,
                active: e.target.checked
              }))}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Make this the active faculty
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
              {isLoading ? "Processing..." : isEditing ? "Update Faculty" : "Add Faculty"}
            </button>
          </div>
        </div>
      </div>

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
            {isLoading && faculties.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center">
                  Loading faculties...
                </td>
              </tr>
            ) : faculties.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-4 text-center">
                  No faculties found
                </td>
              </tr>
            ) : (
              faculties.map((faculty) => (
                <tr key={faculty.id} className="hover:bg-gray-50 text-sm text-gray-700">
                  <td className="px-4 py-2 border-b">
                    <img 
                      src={faculty.filename ? `${API_BASE_URL}/uploads/${faculty.filename}` : Default} 
                      alt="Faculty" 
                      className="w-20 h-14 object-cover rounded" 
                    />
                  </td>
                  <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[400px]">
                    <div className="font-medium">{faculty.title}</div>
                    <div className="text-gray-500 text-sm">{faculty.subtitle}</div>
                  </td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      faculty.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {faculty.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    {!faculty.active && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleToggleActive(faculty.id)}
                        disabled={isLoading}
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleEdit(faculty)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(faculty.id)}
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

export default Faculties;