import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OurCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    heading: "",
    subheading: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState({
    heading: "",
    subheading: "",
    description: "",
    image: "",
  });

  // Fetch all courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${VITE_API_BASE_URL}/courses`, {
          withCredentials: true,
        });
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to fetch courses");
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPEG, PNG, or WebP images are allowed",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        image: "Image must be less than 2MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.heading.trim()) {
      newErrors.heading = "Heading is required";
      isValid = false;
    } else if (formData.heading.length > 100) {
      newErrors.heading = "Heading must be less than 100 characters";
      isValid = false;
    }

    if (!formData.subheading.trim()) {
      newErrors.subheading = "Subheading is required";
      isValid = false;
    } else if (formData.subheading.length > 150) {
      newErrors.subheading = "Subheading must be less than 150 characters";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
      isValid = false;
    }

    // For new course, image is required
    if (!isEditing && !formData.image) {
      newErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      toast.error("Please fix all errors before submitting");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("heading", formData.heading);
      formDataToSend.append("subheading", formData.subheading);
      formDataToSend.append("description", formData.description);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      let response;
      if (isEditing && currentCourseId) {
        response = await axios.put(
          `${VITE_API_BASE_URL}/courses/${currentCourseId}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Course updated successfully");
      } else {
        response = await axios.post(
          `${VITE_API_BASE_URL}/courses`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
        toast.success("Course created successfully");
      }

      // Refresh the courses list
      const updatedCourses = await axios.get(`${VITE_API_BASE_URL}/courses`, {
        withCredentials: true,
      });
      setCourses(updatedCourses.data);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to save course. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit a course
  const handleEdit = (course) => {
    setFormData({
      heading: course.heading,
      subheading: course.subheading,
      description: course.description,
      image: null,
      imagePreview: course.image
        ? `${VITE_API_BASE_URL}/uploads/${course.image}`
        : null,
    });
    setCurrentCourseId(course.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a course
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      await axios.delete(`${VITE_API_BASE_URL}/courses/${id}`, {
        withCredentials: true,
      });
      toast.success("Course deleted successfully");
      
      // Refresh the courses list
      const updatedCourses = await axios.get(`${VITE_API_BASE_URL}/courses`, {
        withCredentials: true,
      });
      setCourses(updatedCourses.data);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to delete course");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      heading: "",
      subheading: "",
      description: "",
      image: null,
      imagePreview: null,
    });
    setErrors({
      heading: "",
      subheading: "",
      description: "",
      image: "",
    });
    setIsEditing(false);
    setCurrentCourseId(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white flex flex-col m-3 rounded-lg">
      {/* Form Section */}
      <div className="flex flex-col justify-center border border-gray-300 md:flex-row shadow-lg rounded-lg m-2 gap-8">
        {/* Image Upload */}
        <div className="flex flex-col m-4 border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <label className="text-gray-500 font-semibold mt-2">
            Course Image (1090x400)
          </label>
          <img
            src={
              formData.imagePreview ||
              formData.image ||
              "default-banner-placeholder.jpg"
            }
            alt="Course Banner"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1 ml-4">{errors.image}</p>
          )}
        </div>

        {/* Form Fields */}
        <div className="flex flex-col w-full p-4">
          <div className="relative m-4 mt-8 w-[88%]">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
              Heading
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className={`w-full border ${
                errors.heading ? "border-red-500" : "border-gray-300"
              } rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3`}
            />
            {errors.heading && (
              <p className="text-red-500 text-sm mt-1">{errors.heading}</p>
            )}
          </div>

          <div className="relative m-4 mt-8 w-[88%]">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
              Subheading
            </label>
            <input
              type="text"
              name="subheading"
              value={formData.subheading}
              onChange={handleInputChange}
              className={`w-full border ${
                errors.subheading ? "border-red-500" : "border-gray-300"
              } rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3`}
            />
            {errors.subheading && (
              <p className="text-red-500 text-sm mt-1">{errors.subheading}</p>
            )}
          </div>

          <div className="relative w-[88%] m-4 mt-8">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className={`w-full border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-md text-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-center items-center gap-3 p-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF] text-white font-semibold h-10 flex items-center justify-center ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-[#9c7ae6]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Course"
              ) : (
                "Create Course"
              )}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="w-[80%] rounded-lg md:w-[200px] bg-gray-500 text-white font-semibold h-10 hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Courses List Section */}
      <div className="mt-8 p-4">
  <h2 className="text-2xl font-bold mb-4">Existing Courses</h2>
  {courses.length === 0 ? (
    <div className="text-center py-8 text-gray-500">
      No courses found. Create your first course above.
    </div>
  ) : (
    <div className="relative">
      {/* Horizontal scroll container */}
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 w-max min-w-full">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow flex-shrink-0"
              style={{ width: '300px' }} // Fixed width for each card
            >
              <img
                src={`${VITE_API_BASE_URL}/uploads/${course.image}`}
                alt={course.heading}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{course.heading}</h3>
                <h4 className="text-gray-600 mb-2">{course.subheading}</h4>
                <p className="text-gray-700 text-sm line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleEdit(course)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(course.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional scroll indicators */}
      <div className="flex justify-center mt-2 space-x-2">
        <button 
          className="scroll-left-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            const container = document.querySelector('.overflow-x-auto');
            container.scrollBy({ left: -300, behavior: 'smooth' });
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <button 
          className="scroll-right-btn p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          onClick={() => {
            const container = document.querySelector('.overflow-x-auto');
            container.scrollBy({ left: 300, behavior: 'smooth' });
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )}
</div>
    </div>
  );
};

export default OurCourses;