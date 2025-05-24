import axios from "axios";
import { useEffect, useState } from "react";

const Scroll = () => {
  const [scroll, setScroll] = useState("");
  const [errors, setErrors] = useState({
    scroll: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [scrollList, setScrollList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  console.log(scrollList);
  

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      scroll: "",
    };

    if (!scroll.trim()) {
      newErrors.scroll = "Scroll content is required";
      isValid = false;
    } else if (scroll.length < 10) {
      newErrors.scroll = "Content must be at least 10 characters";
      isValid = false;
    } else if (scroll.length > 500) {
      newErrors.scroll = "Content cannot exceed 500 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      if (editingItem) {
        // Edit existing scroll content
        const response = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/scroll/${editingItem.id}`,
          { content: scroll, status: editingItem.status },
          { withCredentials: true }
        );

        setScrollList((prev) =>
          prev.map((item) =>
            item.id === editingItem.id ? response.data.scroll : item
          )
        );
   
        setSuccessMessage("Scroll content updated successfully!");
        setEditingItem(null);
      } else {
        // Add new scroll content
        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/scroll`,
          { content: scroll, status: "active" },
          { withCredentials: true }
        );

        setScrollList((prev) => [response.data.scroll, ...prev]);
        setSuccessMessage("Content saved successfully!");
      }

      setScroll("");
    } catch (error) {
      console.error("Error submitting scroll content:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setScroll(item.content);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scroll item?"))
      return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/scroll/${id}`, {
        withCredentials: true,
      });

      setScrollList((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete scroll item:", error);
    }
  };
  const toggleStatus = async (item) => {
  const newStatus = item.status === "active" ? "inactive" : "active";
  try {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/scroll/${item.id}`,
      { content: item.content, status: newStatus },
      { withCredentials: true }
    );
    setScrollList((prev) =>
      prev.map((el) => (el.id === item.id ? response.data.scroll : el))
    );
  } catch (error) {
    console.error("Failed to update status:", error);
  }
};


  useEffect(() => {
    const fetchScroll = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/scroll`,
          { withCredentials: true }
        );
        setScrollList(response.data);
      } catch (error) {
        console.error("Error fetching scroll content:", error);
      }
    };

    fetchScroll();
  }, []);

  return (
    <div className="w-full h-full p-6">
      <div className="bg-white rounded-lg shadow-sm border  border-gray-200 p-6 ">
        <form onSubmit={handleSubmit} className="flex flex-col h-full ">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Scroll Content Management
            </h2>
            <p className="text-gray-600 mt-1">
              Add or update your scroll content
            </p>
          </div>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="flex-grow flex flex-col ">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                All Scroll Items
              </h3>
              <ul className="space-y-3">
                {scrollList.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50 px-4 py-3 rounded border"
                  >
                    <div className="flex-1 text-gray-800">{item.content}</div>

                    <div className="flex items-center gap-2">
                            {item.status === "active" ? (
                                <button
                                onClick={() => toggleStatus(item)}
                                className="text-sm font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700 hover:bg-red-200 transition"
                                >
                                Click to Deactivate
                                </button>
                            ) : (
                                <button
                                onClick={() => toggleStatus(item)}
                                className="text-sm font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 hover:bg-green-200 transition"
                                >
                                Click to Activate
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => handleEdit(item)}
                                className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                onClick={() => handleDelete(item.id)}
                                className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                                Delete
                            </button>
                            </div>


                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <label
                htmlFor="scrollContent"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {editingItem ? "Edit Scroll Content *" : "New Scroll Content *"}
              </label>
              <textarea
                id="scrollContent"
                value={scroll}
                className={`w-full px-4 py-3 border ${
                  errors.scroll ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                placeholder="Enter your scroll content here (10-500 characters)..."
                onChange={(e) => setScroll(e.target.value)}
                rows={4}
              />
              {errors.scroll && (
                <p className="mt-1 text-sm text-red-600">{errors.scroll}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">{scroll.length}/500 characters</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setScroll("");
                  setErrors({ scroll: "" });
                  setSuccessMessage("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                setScroll("");
                setErrors({ scroll: "" });
                setSuccessMessage("");
                setEditingItem(null);
              }}
            >
              Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
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
                  Saving...
                </span>
              ) : editingItem ? (
                "Save Edit"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Scroll;
