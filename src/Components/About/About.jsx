import { useState } from "react";

const About = () => {
  // State for each image with preview URLs and files
  const [images, setImages] = useState({
    topBanner: { file: null, preview: null, width: 1090, height: 400 },
    image1: { file: null, preview: null, width: 525, height: 675 },
    image2: { file: null, preview: null, width: 525, height: 675 }
  });

  const [errors, setErrors] = useState({
    topBanner: '',
    image1: '',
    image2: ''
  });

  const resizeImage = (file, width, height) => {
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

  const handleImageChange = async (e, imageKey) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type and size
    if (!file.type.match('image/jpeg|image/png')) {
      setErrors(prev => ({ ...prev, [imageKey]: 'Only JPEG/PNG images allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, [imageKey]: 'Image must be less than 2MB' }));
      return;
    }

    try {
      const { width, height } = images[imageKey];
      const { file: resizedFile, previewUrl } = await resizeImage(file, width, height);
      
      setImages(prev => ({
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          file: resizedFile,
          preview: previewUrl
        }
      }));
      setErrors(prev => ({ ...prev, [imageKey]: '' }));
    } catch (err) {
      console.error('Image resize failed', err);
      setErrors(prev => ({ ...prev, [imageKey]: 'Failed to process image' }));
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    
    // Append all images with their specific names
    if (images.topBanner.file) formData.append('topBanner', images.topBanner.file);
    if (images.image1.file) formData.append('image1', images.image1.file);
    if (images.image2.file) formData.append('image2', images.image2.file);

    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      console.log('Success:', result);
      alert('Images uploaded successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload images');
    }
  };

  return (
    <div className="w-full bg-white flex flex-col border border-gray-300 m-3 rounded-lg">
      <div className="flex flex-col md:flex-row p-2 gap-8 items-center justify-center">
        {/* Top Banner */}
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
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
          {errors.topBanner && <p className="text-red-500 text-sm">{errors.topBanner}</p>}
        </div>

        {/* Image 1 */}
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
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
          {errors.image1 && <p className="text-red-500 text-sm">{errors.image1}</p>}
        </div>

        {/* Image 2 */}
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
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
          {errors.image2 && <p className="text-red-500 text-sm">{errors.image2}</p>}
        </div>
      </div>

      <div className="flex justify-center p-4">
        <button 
          onClick={handleUpload}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Upload All Images
        </button>
      </div>
    </div>
  );
};

export default About;