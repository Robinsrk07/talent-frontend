import { useState } from "react";

const Scroll = () => {
    const [scroll, setScroll] = useState("");
    const [errors, setErrors] = useState({
        scroll: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            scroll: "",
        };

        // Scroll content validation
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setSuccessMessage("");
        
        if (validateForm()) {
            setIsSubmitting(true);
            
            // Simulate API call
            setTimeout(() => {
                console.log("Submitted content:", scroll);
                setIsSubmitting(false);
                setSuccessMessage("Content saved successfully!");
                setScroll("");
            }, 1500);
        }
    };

    return (
        <div className="w-full h-full p-6">
            <div className="bg-white rounded-lg shadow-sm border  border-gray-200 p-6 ">
                <form onSubmit={handleSubmit} className="flex flex-col h-full ">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Scroll Content Management</h2>
                        <p className="text-gray-600 mt-1">Add or update your scroll content</p>
                    </div>

                    {successMessage && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex-grow flex flex-col ">
                        <div className="mb-4">
                            <label htmlFor="existingContent" className="block text-sm font-medium text-gray-700 mb-2">
                                Existing Content
                            </label>
                            <input
                                id="existingContent"
                                type="text"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                placeholder="No existing content"
                                disabled
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="scrollContent" className="block text-sm font-medium text-gray-700 mb-2">
                                New Scroll Content *
                            </label>
                            <textarea
                                id="scrollContent"
                                value={scroll}
                                className={`w-full px-4 py-3 border ${errors.scroll ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                                placeholder="Enter your scroll content here (10-500 characters)..."
                                onChange={(e) => setScroll(e.target.value)}
                                rows={4}
                            />
                            {errors.scroll && (
                                <p className="mt-1 text-sm text-red-600">{errors.scroll}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                {scroll.length}/500 characters
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                            onClick={() => {
                                setScroll("");
                                setErrors({ scroll: "" });
                                setSuccessMessage("");
                            }}
                        >
                            Reset
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Scroll;