import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000'; // adjust to your backend domain

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const fileRefs = useRef({});

  // Fetch all images
  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${API}/gallery`,{withCredentials: true});
      setGallery(res.data);
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Upload new image
  const handleCreate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.post(`${API}/gallery`, formData,{withCredentials: true});
      fetchGallery();
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  // Update existing image
  const handleUpdate = async (id) => {
    const file = fileRefs.current[id]?.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await axios.put(`${API}/gallery/${id}`, formData,{withCredentials: true});
      fetchGallery();
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  // Delete image
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/gallery/${id} `,{withCredentials: true});
      fetchGallery();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="w-full p-4 bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-4">Gallery</h2>

      <div className="flex flex-row overflow-x-auto space-x-4">
        {/* Add new image box */}
       <div className="flex flex-col items-center justify-center w-[300px] h-[300px] border-dashed border-2 border-gray-400 rounded-lg p-4">
        <label htmlFor="upload" className="cursor-pointer text-4xl">+</label>
        <input
            id="upload"
            type="file"
            accept="image/*"
            onChange={handleCreate}
            className="hidden"
        />
        </div>


        {/* Gallery items */}
        {gallery.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 flex flex-col items-center border border-gray-200 shadow-md rounded-lg w-[300px] h-[300px] p-3"
          >
            <img
              src={`${API}/uploads/${item.filename}`}
              alt="Gallery"
              className="w-[250px] h-[200px] object-cover rounded mb-2"
            />
            <input
              type="file"
              ref={(el) => (fileRefs.current[item.id] = el)}
              className="file-input file-input-sm w-full text-gray-700 mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleUpdate(item.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
