import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Default from "../../assets/stock.jpg";

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OurFocus = () => {
  const [meta, setMeta] = useState({ title: '', topBanner: null });
  const [metaPreview, setMetaPreview] = useState(null);
  const [metaFile, setMetaFile] = useState(null);

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ heading: '', subHeading: '', description: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);

  const [editingItem, setEditingItem] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchMeta();
    fetchItems();
  }, []);

  const fetchMeta = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-meta`, { withCredentials: true });
      setMeta(res.data);
      setMetaPreview(`${VITE_API_BASE_URL}/uploads/${res.data.topBanner}`);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/focus-items`, { withCredentials: true });
      setItems(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleMetaSubmit = async () => {
    if (!meta.title) return setMessage({ type: 'error', text: 'Title is required' });

    const formData = new FormData();
    formData.append('title', meta.title);
    if (metaFile) formData.append('topBanner', metaFile);

    try {
      await axios.post(`${VITE_API_BASE_URL}/focus-meta`, formData, { withCredentials: true });
      setMessage({ type: 'success', text: 'Meta saved successfully' });
      fetchMeta();
    } catch {
      setMessage({ type: 'error', text: 'Failed to save meta' });
    }
  };

  const handleMetaDelete = async () => {
    try {
      await axios.delete(`${VITE_API_BASE_URL}/focus-meta`, { withCredentials: true });
      setMeta({ title: '', topBanner: null });
      setMetaPreview(null);
      setMessage({ type: 'success', text: 'Meta deleted successfully' });
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete meta' });
    }
  };

  const handleItemSubmit = async () => {
    const { heading, subHeading, description, image } = newItem;
    if (!heading || !subHeading || !description || !image) {
      return setMessage({ type: 'error', text: 'All fields are required' });
    }

    const formData = new FormData();
    Object.keys(newItem).forEach(key => formData.append(key, newItem[key]));

    try {
      await axios.post(`${VITE_API_BASE_URL}/focus-items`, formData, { withCredentials: true });
      setNewItem({ heading: '', subHeading: '', description: '', image: null });
      setImagePreview(null);
      setMessage({ type: 'success', text: 'Item added successfully' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: 'Failed to add item' });
    }
  };

  const handleItemDelete = async (id) => {
    try {
      await axios.delete(`${VITE_API_BASE_URL}/focus-items/${id}`, { withCredentials: true });
      setMessage({ type: 'success', text: 'Item deleted successfully' });
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete item' });
    }
  };

  const handleEditClick = (item) => {
    setEditingItem({ ...item, image: null });
    setEditPreview(`${VITE_API_BASE_URL}/uploads/${item.image}`);
  };

  const handleEditSubmit = async () => {
    const { id, heading, subHeading, description, image } = editingItem;
    const formData = new FormData();
    formData.append('heading', heading);
    formData.append('subHeading', subHeading);
    formData.append('description', description);
    if (image) formData.append('image', image);

    try {
      await axios.put(`${VITE_API_BASE_URL}/focus-items/${id}`, formData, { withCredentials: true });
      setMessage({ type: 'success', text: 'Item updated successfully' });
      setEditingItem(null);
      fetchItems();
    } catch {
      setMessage({ type: 'error', text: 'Failed to update item' });
    }
  };

  return (
    <div className="p-4">
      {message.text && (
        <div className={`mb-4 p-3 rounded text-white ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message.text}
        </div>
      )}

      {/* Meta Section */}
      <div className="flex flex-col lg:flex-row border rounded-lg shadow-lg p-4 mb-8 gap-6">
        <div className="flex flex-col border w-full lg:w-[300px] rounded-lg items-center p-2">
          <label className="text-gray-500 font-semibold mb-2">Top Banner (1090x400)</label>
          <img src={metaPreview || Default} alt="Top Banner" className="w-full h-48 object-cover rounded" />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setMetaFile(e.target.files[0]);
              setMetaPreview(URL.createObjectURL(e.target.files[0]));
            }}
            className="file-input file-input-bordered border border-gray-200 rounded-lg bg-blue-200 mt-4 w-full"
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-semibold text-gray-500 mb-1">Title Main</label>
          <input
            type="text"
            className="border  p-2 rounded-md mb-4"
            value={meta.title}
            onChange={(e) => setMeta({ ...meta, title: e.target.value })}
          />
          <div className="flex flex-wrap gap-4">
            <button onClick={handleMetaSubmit} className="bg-[#AE89FF] text-white px-4 py-2 rounded">Save</button>
            <button onClick={handleMetaDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
          </div>
        </div>
      </div>

      {/* Add New Item */}
      <div className="border rounded-lg p-4 mb-8 shadow-lg">
        <h3 className="text-lg font-bold mb-4">Add Focus Item</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Heading" value={newItem.heading} onChange={(e) => setNewItem({ ...newItem, heading: e.target.value })} className="border p-2 rounded" />
          <input placeholder="Sub Heading" value={newItem.subHeading} onChange={(e) => setNewItem({ ...newItem, subHeading: e.target.value })} className="border p-2 rounded" />
          <textarea placeholder="Description" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="border p-2 rounded md:col-span-2" />
          <input type="file" className='border border-gray-200 rounded-lg bg-blue-200 w-1/2' accept="image/*" onChange={(e) => {
            setNewItem({ ...newItem, image: e.target.files[0] });
            setImagePreview(URL.createObjectURL(e.target.files[0]));
          }} />
          {imagePreview && <img src={imagePreview} className="w-40 h-40 object-cover rounded border" alt="Preview" />}
        </div>
        <button onClick={handleItemSubmit} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">Add Item</button>
      </div>

      {/* FocusItems List */}
      <div className="overflow-x-auto p-2">
        <div className="flex gap-4 w-fit">
          {items.map((item) => (
            <div key={item.id} className="min-w-[250px] max-w-sm flex-shrink-0 border p-4 rounded-lg shadow-md bg-white">
              <img src={`${VITE_API_BASE_URL}/uploads/${item.image}`} alt="Item" className="w-full h-40 object-cover rounded" />
              <h4 className="font-bold mt-2">{item.heading}</h4>
              <h5 className="text-sm text-gray-600">{item.subHeading}</h5>
              <p className="text-gray-700 text-sm mt-2">{item.description}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => handleEditClick(item)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => handleItemDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Edit Focus Item</h2>
            <input
              placeholder="Heading"
              value={editingItem.heading}
              onChange={(e) => setEditingItem({ ...editingItem, heading: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              placeholder="Sub Heading"
              value={editingItem.subHeading}
              onChange={(e) => setEditingItem({ ...editingItem, subHeading: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <textarea
              placeholder="Description"
              value={editingItem.description}
              onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              className="border p-2 rounded w-full mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setEditingItem({ ...editingItem, image: e.target.files[0] });
                setEditPreview(URL.createObjectURL(e.target.files[0]));
              }}
              className="mb-2"
            />
            {editPreview && <img src={editPreview} alt="Edit Preview" className="w-full h-40 object-cover rounded mb-2" />}
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditingItem(null)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
              <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OurFocus;
