import { useState, useEffect, useRef } from "react";
import Default from "../../assets/stock.jpg";
import axios from "axios";
import { toast } from "react-toastify";

const Teachers = () => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const fileInputRef = useRef(null);
  
  const [teachers, setTeachers] = useState([]);
  const [currentTeacher, setCurrentTeacher] = useState({
    id: null,
    name: '',
    qualifications: '',
    subject: '',
    file: null,
    previewUrl: null,
    active: false
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    qualifications: '',
    subject: '',
    image: ''
  });

  // Fetch all teachers on component mount
  useEffect(() => {
    fetchTeachers();
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (currentTeacher.previewUrl) {
        URL.revokeObjectURL(currentTeacher.previewUrl);
      }
    };
  }, [currentTeacher.previewUrl]);

  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/teacher`,{withCredentials: true});
      setTeachers(response.data.data);
      console.log(response);
      
    } catch (error) {
      toast.error("Failed to fetch teachers");
      console.error("Error fetching teachers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resizeImage = (file, width = 525, height = 675) => {
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

    // Validate image
    if (!file.type.match('image/jpeg|image/png')) {
      setErrors(prev => ({ ...prev, image: 'Only JPEG/PNG images allowed' }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image must be less than 2MB' }));
      return;
    }

    try {
      const { file: resizedFile, previewUrl } = await resizeImage(file);
      
      setCurrentTeacher(prev => ({
        ...prev,
        file: resizedFile,
        previewUrl: previewUrl,
      }));
      setErrors(prev => ({ ...prev, image: '' }));
    } catch (error) {
      console.error("Image resize failed", error);
      setErrors(prev => ({ ...prev, image: 'Failed to process image' }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentTeacher(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!currentTeacher.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!currentTeacher.qualifications.trim()) {
      newErrors.qualifications = 'Qualifications are required';
      isValid = false;
    }

    if (!currentTeacher.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }

    if (!isEditing && !currentTeacher.file) {
      newErrors.image = 'Image is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setCurrentTeacher({
      id: null,
      name: '',
      qualifications: '',
      subject: '',
      file: null,
      previewUrl: null,
      active: false
    });
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', currentTeacher.name);
      formData.append('qualifications', currentTeacher.qualifications);
      formData.append('subject', currentTeacher.subject);
      formData.append('active', currentTeacher.active.toString());
      
      if (currentTeacher.file) {
        formData.append('image', currentTeacher.file);
      }

      let response;
      if (isEditing && currentTeacher.id) {
        response = await axios.put(
          `${API_BASE_URL}/teacher/${currentTeacher.id}`,
          formData,
          {
           withCredentials: true,
          }
        );
        toast.success("Teacher updated successfully");
      } else {
        response = await axios.post(
          `${API_BASE_URL}/teacher`,
          formData,
          {
           withCredentials: true,
          }
        );
        toast.success("Teacher created successfully");
      }

      fetchTeachers();
      resetForm();
    } catch (error) {
      console.error("Error saving teacher:", error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} teacher`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (teacher) => {
    setCurrentTeacher({
      id: teacher.id,
      name: teacher.name,
      qualifications: teacher.qualifications,
      subject: teacher.subject,
      file: null,
      previewUrl: teacher.filename ? `${API_BASE_URL}/uploads/${teacher.filename}` : null,
      active: teacher.active
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        setIsLoading(true);
        await axios.delete(`${API_BASE_URL}/teacher/${id}`,{withCredentials: true});
        toast.success("Teacher deleted successfully");
        fetchTeachers();
      } catch (error) {
        console.error("Error deleting teacher:", error);
        toast.error("Failed to delete teacher");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleActive = async (id) => {
    try {
      setIsLoading(true);
      await axios.patch(`${API_BASE_URL}/teacher/toggle/${id}`,{},{withCredentials: true}); 
      toast.success("Active status updated");
      fetchTeachers();
    } catch (error) {
      console.error("Error toggling active status:", error);
      toast.error("Failed to update active status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white overflow-none">
      <div className="flex flex-col lg:flex-row w-[95%] m-2 rounded-lg border border-gray-200 bg-white p-8 gap-2">
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <img
            src={currentTeacher.previewUrl || Default}
            alt="Teacher Preview"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          
          <input
            type="file"
            accept="image/jpeg,image/png"
            ref={fileInputRef}
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
            onChange={handleImageChange}
            disabled={isLoading}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>
        
        <div className="w-full flex flex-col gap-2">
          <label className="text-gray-500 font-semibold">Name Of Teacher *</label>
          <input
            type="text"
            name="name"
            value={currentTeacher.name}
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-200 px-2 py-1 rounded"
            disabled={isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <label className="text-gray-500 font-semibold">Subject *</label>
          <input
            type="text"
            name="subject"
            value={currentTeacher.subject}
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-200 px-2 py-1 rounded"
            disabled={isLoading}
          />
          {errors.subject && <p className="text-red-500 text-sm">{errors.subject}</p>}

          <label className="text-gray-500 font-semibold">Qualifications *</label>
          <input
            type="text"
            name="qualifications"
            value={currentTeacher.qualifications}
            onChange={handleInputChange}
            className="w-full md:w-1/2 border border-gray-200 px-2 py-1 rounded"
            disabled={isLoading}
          />
          <p className="text-xs text-gray-400">(Separated by comma)</p>
          {errors.qualifications && <p className="text-red-500 text-sm">{errors.qualifications}</p>}

          <div className="flex items-center mt-2">
            <input
              type="checkbox"
              id="active"
              checked={currentTeacher.active}
              onChange={(e) => setCurrentTeacher(prev => ({
                ...prev,
                active: e.target.checked
              }))}
              className="mr-2"
              disabled={isLoading}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Make this teacher active
            </label>
          </div>

          <div className="flex gap-2 mt-3 md:mt-6">
            {isEditing && (
              <button
                className="w-full md:w-1/4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded"
                onClick={resetForm}
                disabled={isLoading}
              >
                Cancel
              </button>
            )}
            <button
              className={`w-full md:w-1/2 bg-[#AE89FF] text-white font-semibold py-2 rounded ${
                isLoading ? 'opacity-70' : 'hover:bg-[#9a7ae6]'
              }`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : isEditing ? 'Update Teacher' : 'Save Teacher'}
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-[1050px] max-w-[1060px] bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border-b w-[150px]">Image</th>
              <th className="px-4 py-2 border-b w-[250px]">Name</th>
              <th className="px-4 py-2 border-b w-[200px]">Subject</th>
              <th className="px-4 py-2 border-b w-[100px]">Status</th>
              <th className="px-4 py-2 border-b text-center w-[250px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && teachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center">
                  Loading teachers...
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-4 text-center">
                  No teachers found
                </td>
              </tr>
            ) : (
              teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 text-sm text-gray-700">
                  <td className="px-4 py-2 border-b">
                    <img 
                      src={teacher.filename ? `${API_BASE_URL}/uploads/${teacher.filename}` : Default} 
                      alt="Teacher" 
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{teacher.name}</td>
                  <td className="px-4 py-2 border-b">{teacher.subject}</td>
                  <td className="px-4 py-2 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      teacher.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {teacher.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border-b text-center space-x-2">
                    {!teacher.active && (
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                        onClick={() => handleToggleActive(teacher.id)}
                        disabled={isLoading}
                      >
                        Set Active
                      </button>
                    )}
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleEdit(teacher)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDelete(teacher.id)}
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

export default Teachers;