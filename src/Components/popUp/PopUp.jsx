import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PopupManager = () => {
  const [popups, setPopups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  const fetchPopups = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/popup`);
      setPopups(res.data.reverse());
    } catch (error) {
      console.error('Error fetching popups:', error);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    console.log('Starting upload for:', selectedFile.name);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${VITE_API_BASE_URL}/popup`, formData, { 
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Upload successful:', response.data);
      setSelectedFile(null);
      setIsModalOpen(false);
      fetchPopups();
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this popup?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${VITE_API_BASE_URL}/popup/${id}`, {withCredentials: true});
      fetchPopups();
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="w-full bg-white flex flex-col m-4 rounded-lg">
      {/* Popup Cards */}
      <div className="flex gap-4 overflow-x-auto p-4">
        {popups.map((popup) => (
          <div key={popup.id} className="flex-shrink-0 border border-gray-300 rounded-lg w-[300px] p-4 shadow-md">
            <img
              src={`${VITE_API_BASE_URL}/uploads/${popup.filename}`}
              alt={`Popup ${popup.id}`}
              className="w-full h-[200px] object-contain rounded"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
            <div className="flex justify-center mt-2">
              <button
                onClick={() => handleDelete(popup.id)}
                className="btn btn-error bg-red-500  btn-sm w-1/2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Create New Box */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-[300px] h-[300px] border-dashed border-2 border-gray-400 rounded-lg">
          <label className="cursor-pointer text-4xl flex flex-col items-center">
            +
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
        </div>
      </div>

      {/* Upload Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add New Popup</h2>
            {selectedFile && (
              <div className="mb-4">
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-40 object-contain border rounded"
                />
                <p className="text-sm text-gray-500 mt-2">{selectedFile.name}</p>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }} 
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpload} 
                className="btn btn-primary"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupManager;