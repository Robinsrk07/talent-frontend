import { useState } from "react";

const About = () => {
  // State for images
  const [images, setImages] = useState({
    topBanner: { file: null, preview: null },
    image1: { file: null, preview: null },
    image2: { file: null, preview: null }
  });

  // State for form fields
  const [formData, setFormData] = useState({
    titleMain: '',
    heading: '',
    description: '',
    visionTitle: '',
    visionDescription: '',
    missionTitle: '',
    missionDescription: '',
    quote: ''
  });

  // State for errors
  const [errors, setErrors] = useState({
    topBanner: '',
    image1: '',
    image2: '',
    titleMain: '',
    heading: '',
    description: '',
    visionTitle: '',
    visionDescription: '',
    missionTitle: '',
    missionDescription: '',
    quote: ''
  });

  // Validate text fields
  const validateField = (name, value) => {
    let error = '';
    
    if (!value.trim()) {
      error = 'This field is required';
    } else if (value.length > 500) {
      error = 'Maximum 500 characters allowed';
    }

    // Specific validations for certain fields
    if (name === 'titleMain' && value.length > 100) {
      error = 'Maximum 100 characters allowed';
    } else if ((name === 'heading' || name === 'visionTitle' || name === 'missionTitle') && value.length > 150) {
      error = 'Maximum 150 characters allowed';
    } else if (name === 'quote' && value.length > 200) {
      error = 'Maximum 200 characters allowed';
    }

    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  // Handle image changes
  const handleImageChange = (e, imageKey) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type and size
    let error = '';
    if (!file.type.match('image/jpeg|image/png')) {
      error = 'Only JPEG/PNG images allowed';
    } else if (file.size > 2 * 1024 * 1024) {
      error = 'Image must be less than 2MB';
    }

    if (error) {
      setErrors(prev => ({ ...prev, [imageKey]: error }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImages(prev => ({
      ...prev,
      [imageKey]: {
        file,
        preview: previewUrl
      }
    }));
    setErrors(prev => ({ ...prev, [imageKey]: '' }));
  };

  // Validate entire form
  const validateForm = () => {
    let isValid = true;
    
    // Validate text fields
    Object.keys(formData).forEach(key => {
      if (!validateField(key, formData[key])) {
        isValid = false;
      }
    });

    // Validate images (optional - remove if images aren't required)
    Object.keys(images).forEach(key => {
      if (!images[key].file) {
        setErrors(prev => ({ ...prev, [key]: 'This image is required' }));
        isValid = false;
      }
    });

    return isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fix all errors before submitting');
      return;
    }

    const data = new FormData();

    // Append images
    if (images.topBanner.file) data.append('topBanner', images.topBanner.file);
    if (images.image1.file) data.append('image1', images.image1.file);
    if (images.image2.file) data.append('image2', images.image2.file);

    // Append form data
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    console.log("hello");
    
    for (let [key, value] of data.entries()) {
  console.log(key, value);
}
    

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        body: data
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const result = await response.json();
      console.log('Success:', result);
      alert('About page updated successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update about page. Please try again.');
    }
  };

  return (
    <div className="w-full bg-white flex flex-col border border-gray-300 m-3 rounded-lg">
      <div className="flex flex-col md:flex-row p-2 gap-8 items-center justify-center">
        {/* Top Banner */}
        <div className="flex flex-col mt-8 items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <label className="text-gray-500 font-semibold mt-2">Top Banner (1090x400)</label>
          <img
            src={images.topBanner.preview || "default-banner-placeholder.jpg"}
            alt="Top Banner"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
            onChange={(e) => handleImageChange(e, 'topBanner')}
          />
                {errors.topBanner && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.topBanner}
                      <span className="block text-red-500 font-normal">
                        Supported: JPEG/PNG under 2MB
                      </span>
                    </p>
                  </div>
                )}       
 </div>

        {/* Image 1 */}
        <div className="flex flex-col mt-8 items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <label className="text-gray-500 font-semibold mt-2">Image1 (525x675)</label>
          <img
            src={images.image1.preview || "default-image1-placeholder.jpg"}
            alt="Image 1"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
            onChange={(e) => handleImageChange(e, 'image1')}
          />
                          {errors.image1 && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.image1}
                      <span className="block text-red-500 font-normal">
                        Supported: JPEG/PNG under 2MB
                      </span>
                    </p>
                  </div>
                )}    
        </div>

        {/* Image 2 */}
        <div className="flex flex-col mt-8 items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <label className="text-gray-500 font-semibold mt-2">Image2 (525x675)</label>
          <img
            src={images.image2.preview || "default-image2-placeholder.jpg"}
            alt="Image 2"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
            onChange={(e) => handleImageChange(e, 'image2')}
          />
 {errors.image2 && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.image2}
                      <span className="block text-red-500 font-normal">
                        Supported: JPEG/PNG under 2MB
                      </span>
                    </p>
                  </div>
                )}          
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center">
        {/* Title Main */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Title Main
          </label>
          <input
            type="text"
            name="titleMain"
            value={formData.titleMain}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {errors.titleMain && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.titleMain}
                      
                    </p>
                  </div>
                )} 
          
        </div>

        {/* Heading */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Heading
          </label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.heading && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.heading}
                      
                    </p>
                  </div>
                )} 
        </div>

        {/* Description */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md text-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
           {errors.description && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.description}
                      
                    </p>
                  </div>
                )}
        </div>

        {/* Vision Title */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Vision Title
          </label>
          <input
            type="text"
            name="visionTitle"
            value={formData.visionTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.visionTitle && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.visionTitle}
                      
                    </p>
                  </div>
                )}
        </div>

        {/* Vision Description */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Vision Description
          </label>
          <textarea
            name="visionDescription"
            value={formData.visionDescription}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md text-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          {errors.visionDescription && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.visionDescription}
                      
                    </p>
                  </div>
                )}
        </div>

        {/* Mission Title */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Mission Title
          </label>
          <input
            type="text"
            name="missionTitle"
            value={formData.missionTitle}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.missionTitle && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.missionTitle}
                      
                    </p>
                  </div>
                )}
        </div>

        {/* Mission Description */}
        <div className="relative w-[88%] mt-6">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Mission Description
          </label>
          <textarea
            name="missionDescription"
            value={formData.missionDescription}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 rounded-md text-gray-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
          {errors.missionDescription && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.missionDescription}
                      
                    </p>
                  </div>
                )}
        </div>

        {/* Quote */}
        <div className="relative w-[88%] mt-6 mb-8">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Quote
          </label>
          <input
            type="text"
            name="quote"
            value={formData.quote}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
           {errors.quote && (
                  <div className="mt-1 flex items-start text-red-600">
                    <svg 
                      className="h-4 w-4 flex-shrink-0 mt-0.5" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="ml-2 text-sm font-medium leading-tight">
                      {errors.quote}
                      
                    </p>
                  </div>
                )}
        </div>

        <div className="relative w-[88%] flex justify-center items-center mt-6 mb-8">
          <button 
            type="submit"
            className="bg-blue-500 w-[300px] h-[40px] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default About;