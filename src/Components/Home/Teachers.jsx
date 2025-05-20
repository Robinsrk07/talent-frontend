import { useState ,useEffect } from "react";
import Default from "../../assets/stock.jpg";

const Teachers = () => {
   const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [data, setData] = useState({
    name: '',
    qualifications: '' // Changed to lowercase to match input name
  });
  const [errors, setErrors] = useState({
    name: '',
    qualifications: '',
    image: '',
    subject:''
  });

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

  // Handle image selection
  const handleImageChange = async(e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate image type and size
    if (!file.type.match('image/jpeg|image/png')) {
      setErrors(prev => ({ ...prev, image: 'Only JPEG/PNG images allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
      return;
    }

    try {
    const { file: resizedFile, previewUrl } = await resizeImage(file, 525, 675);
    
    setImageFile(resizedFile);        // ✅ Set the resized image for upload
    setPreviewUrl(previewUrl);        // ✅ Show resized image in preview
    setErrors(prev => ({ ...prev, image: '' }));
  } catch (err) {
    console.error('Image resize failed', err);
    setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
  }
  };

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!data.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!data.qualifications.trim()) {
      newErrors.qualifications = 'Qualifications are required';
      isValid = false;
    }

    if (!imageFile) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;
     console.log("hello");
     
    const formData = new FormData();
    formData.append('name', data.name);
    
    // Convert qualifications to array
    const qualificationsArray = data.qualifications
      .split(',')
      .map(q => q.trim())
      .filter(q => q.length > 0);
    formData.append('qualifications', JSON.stringify(qualificationsArray));
    
    formData.append('photo', imageFile);

   for (let pair of formData.entries()) {
  console.log(`${pair[0]}: ${pair[1]}`);
}

    

    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/teachers', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const result = await response.json();
      console.log('Success:', result);
      alert('Teacher saved successfully!');
      
      // Reset form after successful submission
      setData({ name: '', qualifications: '' });
      setPreviewUrl(null);
      setImageFile(null);
      document.querySelector('input[type="file"]').value = ''; // Reset file input

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save teacher');
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
        <div className="w-full flex flex-col gap-2">
            <label className="text-gray-500 font-semibold ">Name Of Teacher</label>
           <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-200 px-2 py-1 rounded"
            />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <label className="text-gray-500 font-semibold ">Qualifications</label>
           <input
            type="text"
            value={data.qualifications}
            name="qualifications"
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-200 px-2 py-1 rounded"
            />
            <p className="text-xs text-gray-300"> (Separeted by Comma)</p>
              {errors.qualifications && <p className="text-red-500 text-sm">{errors.qualifications}</p>}

            <button
                 className="w-full  mt-3 md:mt-20 md:w-1/2 bg-[#AE89FF] rounded-sm text-white font-semibold" onClick={handleSubmit}>
                

                Save Teacher</button>
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
                      { <span className="text-gray-400 italic">No title</span>}
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
                  <tr className="hover:bg-gray-50 text-sm text-gray-700">
                    <td className="px-4 py-2 border-b">
                      <img src={previewUrl || Default} alt="Banner" className="w-20 h-14 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[600px]">
                      { <span className="text-gray-400 italic">No title</span>}
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
                  <tr className="hover:bg-gray-50 text-sm text-gray-700">
                    <td className="px-4 py-2 border-b">
                      <img src={previewUrl || Default} alt="Banner" className="w-20 h-14 object-cover rounded" />
                    </td>
                    <td className="px-4 py-2 border-b break-words whitespace-normal max-w-[600px]">
                      { <span className="text-gray-400 italic">No title</span>}
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

export default Teachers;