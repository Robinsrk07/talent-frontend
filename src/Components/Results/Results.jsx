import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

const ResultGallery = () => {
  const [results, setResults] = useState([]);
  const [editItemId, setEditItemId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createFile, setCreateFile] = useState(null);
  const [createTitle, setCreateTitle] = useState('');
  const titleRef = useRef();
  const fileInputRef = useRef();

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API}/result`,{ withCredentials: true });
      setResults(res.data);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handleCreateFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCreateFile(file);
    setIsModalOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (!createFile) return;
    const formData = new FormData();
    formData.append('image', createFile);
    if (createTitle.trim()) {
      formData.append('title', createTitle.trim());
    }

    try {
      await axios.post(`${API}/result`, formData, { withCredentials: true });
      setCreateFile(null);
      setCreateTitle('');
      setIsModalOpen(false);
      fetchResults();
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  const handleUpdate = async (id, file, title) => {
    const formData = new FormData();
    if (file) formData.append('image', file);
    if (title !== undefined) formData.append('title', title);

    try {
      await axios.put(`${API}/result/${id}`, formData, { withCredentials: true });
      fetchResults();
      setEditItemId(null);
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/result/${id}`, { withCredentials: true });
      fetchResults();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="w-full bg-white flex flex-col m-4 rounded-lg">
      {/* Result Cards */}
      <div className="flex gap-4 overflow-x-auto p-4">
        {results.map((item) => (
          <div key={item.id} className="flex-shrink-0 border border-gray-300 rounded-lg w-[300px] p-4 shadow-md">
            <img
              src={`${API}/uploads/${item.filename}`}
              alt={item.title || 'Result Image'}
              className="w-full h-[200px] object-cover rounded"
            />
            {editItemId === item.id ? (
              <div className="flex flex-col gap-2 mt-2">
                <input
                  defaultValue={item.title || ''}
                  ref={titleRef}
                  placeholder="Title (optional)"
                  className="input input-bordered w-full"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="file-input file-input-bordered w-full"
                />
                <button
                  onClick={() =>
                    handleUpdate(item.id, fileInputRef.current.files[0], titleRef.current.value)
                  }
                  className="btn btn-success btn-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditItemId(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center gap-2 mt-2">
                <p className="text-sm text-center text-gray-700 font-medium">{item.title || <em>No Title</em>}</p>
                <button
                  onClick={() => setEditItemId(item.id)}
                  className="bg-blue-500 w-1/2 rounded-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-500 w-1/2  rounded-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Create New Box */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center w-[300px] h-[300px] border-dashed border-2 border-gray-400 rounded-lg">
          <label className="cursor-pointer text-4xl flex flex-col items-center">
            +
            <input
              type="file"
              accept="image/*"
              onChange={handleCreateFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Modal for Title Input */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Result</h2>
            <input
              type="text"
              placeholder="Enter title (optional)"
              value={createTitle}
              onChange={(e) => setCreateTitle(e.target.value)}
              className="input input-bordered w-full mb-4"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsModalOpen(false)} className="bg-green-500">
                Cancel
              </button>
              <button onClick={handleConfirmCreate} className="bg-green-500">
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultGallery;
