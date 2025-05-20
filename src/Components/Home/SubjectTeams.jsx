import { useState, useEffect } from "react";
import Default from "../../assets/stock.jpg";

const SubjectTeams = () => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [title, setTitle] = useState('');
  const [errors, setErrors] = useState({
    title: '',
    image: ''
  });

  const resizeImage = (file, width = 1000, height = 750) => {
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type and size
    if (!file.type.match('image/jpeg|image/png')) {
      setErrors(prev => ({ ...prev, image: 'Only JPEG/PNG images allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
      return;
    }

    try {
      const { file: resizedFile, previewUrl } = await resizeImage(file, 525, 675);
      setImageFile(resizedFile);
      setPreviewUrl(previewUrl);
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (err) {
      console.error('Image resize failed', err);
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
    }
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: '', image: '' };

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    } else if (title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
      isValid = false;
    }

    if (!imageFile) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', imageFile);

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/subject-teams', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      console.log('Success:', result);
      alert('Subject team uploaded successfully!');
      
      // Reset form
      setTitle('');
      setPreviewUrl(null);
      setImageFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to upload subject team');
    }
  };

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full flex flex-col bg-white overflow-none">
      <div className="flex flex-col lg:flex-row w-[95%] m-2 rounded-lg border border-gray-200 bg-white p-8 gap-2">
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <img
            src={previewUrl || Default}
            alt="Teacher Preview"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
            onChange={handleImageChange}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>
        
        <div className="w-full flex flex-col">
          <label className="text-gray-500 font-semibold">Title for Subject wise Tutors</label>
          <input 
            className={`border rounded-sm w-full md:w-1/2 ${errors.title ? 'border-red-500' : 'border-gray-400'}`}
            type="text"  
            value={title}
            onChange={handleTitleChange}
            name="title"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          
          <button 
            onClick={handleUpload}
            className="mt-4 w-full md:w-1/2 bg-[#AE89FF] text-white font-semibold py-2 rounded-sm"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectTeams;