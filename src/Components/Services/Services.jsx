import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Default from "../../assets/stock.jpg";

const Services = () => {
  // State for services section
  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    id: '',
    heading: '',
    description: '',
    image: null,
    previewImage: ''
  });

  const [isEditingService, setIsEditingService] = useState(false);

  // State for features section
  const [features, setFeatures] = useState([]);
  const [featureForm, setFeatureForm] = useState({
    id: '',
    title: ''
  });
  const [isEditingFeature, setIsEditingFeature] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchServices();
    fetchFeatures();
  }, []);

  // API calls
  const fetchServices = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/services`, { withCredentials: true });
      setServices(response.data);
    } catch (error) {
      showError('Failed to fetch services', error);
    }
  };

  const fetchFeatures = async () => {
    try {
      const response = await axios.get(`${VITE_API_BASE_URL}/features`, { withCredentials: true });
      setFeatures(response.data);
    } catch (error) {
      showError('Failed to fetch features', error);
    }
  };

  // Helper function for error handling
  const showError = (message, error) => {
    console.error(message, error);
    toast.error(`${message}: ${error.response?.data?.message || error.message}`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Services handlers
  const handleServiceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setServiceForm({
        ...serviceForm,
        image: file,
        previewImage: URL.createObjectURL(file)
      });
    }
  };

  const handleServiceInputChange = (e) => {
    const { name, value } = e.target;
    setServiceForm({
      ...serviceForm,
      [name]: value
    });
  };

  const validateServiceForm = () => {
    if (!serviceForm.heading.trim()) {
      toast.error('Heading is required');
      return false;
    }
    if (!serviceForm.description.trim()) {
      toast.error('Description is required');
      return false;
    }
    if (!isEditingService && !serviceForm.image) {
      toast.error('Image is required');
      return false;
    }
    return true;
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    if (!validateServiceForm()) return;

    const formData = new FormData();
    formData.append('heading', serviceForm.heading);
    formData.append('description', serviceForm.description);
    if (serviceForm.image) {
      formData.append('image', serviceForm.image);
    }

    try {
      if (isEditingService) {
        await axios.put(`${VITE_API_BASE_URL}/services/${serviceForm.id}`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Service updated successfully');
      } else {
        await axios.post(`${VITE_API_BASE_URL}/services`, formData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Service created successfully');
      }
      resetServiceForm();
      fetchServices();
    } catch (error) {
      showError(`Failed to ${isEditingService ? 'update' : 'create'} service`, error);
    }
  };

  const editService = (service) => {
    setServiceForm({
      id: service.id,
      heading: service.heading,
      description: service.description,
      image: null,
      previewImage: service.image ? `${VITE_API_BASE_URL}/uploads/${service.image}` : ''
    });
    setIsEditingService(true);
  };

  const deleteService = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${VITE_API_BASE_URL}/services/${id}`, { withCredentials: true });  
        toast.success('Service deleted successfully');
        fetchServices();
      } catch (error) {
        showError('Failed to delete service', error);
      }
    }
  };

  const resetServiceForm = () => {
    setServiceForm({
      id: '',
      heading: '',
      description: '',
      image: null,
      previewImage: ''
    });
    setIsEditingService(false);
  };

  // Features handlers
  const handleFeatureInputChange = (e) => {
    const { name, value } = e.target;
    setFeatureForm({
      ...featureForm,
      [name]: value
    });
  };

  const validateFeatureForm = () => {
    if (!featureForm.title.trim()) {
      toast.error('Title is required');
      return false;
    }
    return true;
  };

  const handleFeatureSubmit = async (e) => {
    e.preventDefault();
    if (!validateFeatureForm()) return;

    try {
      if (isEditingFeature) {
        await axios.put(`${VITE_API_BASE_URL}/features/${featureForm.id}`, {
          title: featureForm.title
        }, {
          withCredentials: true,
        });
        toast.success('Feature updated successfully');
      } else {
        await axios.post(`${VITE_API_BASE_URL}/features`, {
          title: featureForm.title
        }, {
          withCredentials: true,
        });
        toast.success('Feature created successfully');
      }
      resetFeatureForm();
      fetchFeatures();
    } catch (error) {
      showError(`Failed to ${isEditingFeature ? 'update' : 'create'} feature`, error);
    }
  };

  const editFeature = (feature) => {
    setFeatureForm({
      id: feature.id,
      title: feature.title
    });
    setIsEditingFeature(true);
  };

  const deleteFeature = async (id) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      try {
        await axios.delete(`${VITE_API_BASE_URL}/features/${id}`, { withCredentials: true });  
        toast.success('Feature deleted successfully');
        fetchFeatures();
      } catch (error) {
        showError('Failed to delete feature', error);
      }
    }
  };

  const resetFeatureForm = () => {
    setFeatureForm({
      id: '',
      title: ''
    });
    setIsEditingFeature(false);
  };

  return (
    <div className="w-full bg-white flex flex-col p-3 rounded-lg">
      <ToastContainer />
      
      {/* Services Section */}
      <div className="flex flex-col border border-gray-300 md:flex-row shadow-lg rounded-lg m-2 gap-8">
        <div className="flex flex-col m-4 border border-gray-200 w-full md:w-[300px] h-[300px] rounded-lg">
          <label className="text-gray-500 font-semibold mt-2">Services Image (1090x400)</label>
          <img
            src={serviceForm.previewImage || Default}
            alt="Service Preview"
            className="w-full h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            onChange={handleServiceImageChange}
            className="file-input file-input-bordered m-4 text-gray-700 rounded-sm w-[80%] bg-white border border-gray-300"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="relative m-4 mt-8 w-[88%]">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
              Heading
            </label>
            <input
              type="text"
              name="heading"
              value={serviceForm.heading}
              onChange={handleServiceInputChange}
              className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="relative w-[88%] m-4 mt-8">
            <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={serviceForm.description}
              onChange={handleServiceInputChange}
              className="w-full border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row text-white font-semibold justify-center items-center gap-3 p-4">
            <button
              onClick={handleServiceSubmit}
              className="w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF] py-2"
            >
              {isEditingService ? 'Update Service' : 'Add Service'}
            </button>
            {isEditingService && (
              <button
                onClick={resetServiceForm}
                className="w-[80%] rounded-lg md:w-[200px] bg-gray-500 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Existing Services List */}
      {services.length > 0 && (
        <div className="border border-gray-300 shadow-lg rounded-lg m-2 p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={`${VITE_API_BASE_URL}/uploads/${service.image}`}
                  alt={service.heading}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = Default;
                  }}
                />
                <h4 className="font-bold text-lg">{service.heading}</h4>
                <p className="text-gray-600 text-sm mt-2">{service.description}</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => editService(service)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteService(service.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Features Section */}
      <div className="flex flex-col border border-gray-300 shadow-lg rounded-lg m-2 p-4 gap-8">
        <h3 className="text-gray-400 text-xl font-semibold">Our Features</h3>

        <div className="relative m-4 mt-8 w-full md:w-[88%]">
          <label className="absolute -top-2 left-3 bg-white px-1 text-sm font-semibold text-gray-500 z-10">
            Feature Title
          </label>
          <input
            type="text"
            name="title"
            value={featureForm.title}
            onChange={handleFeatureInputChange}
            className="w-full border border-gray-300 rounded-md h-[50px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col md:flex-row text-white font-semibold justify-center items-center gap-3 p-4">
          <button
            onClick={handleFeatureSubmit}
            className="w-[80%] rounded-lg md:w-[200px] bg-[#AE89FF] py-2 hover:bg-[#9c7ae6] transition"
          >
            {isEditingFeature ? 'Update Feature' : 'Add Feature'}
          </button>
          {isEditingFeature && (
            <button
              onClick={resetFeatureForm}
              className="w-[80%] rounded-lg md:w-[200px] bg-gray-500 py-2 hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Existing Features List */}
      {features.length > 0 && (
        <div className="border border-gray-300 shadow-lg rounded-lg m-2 p-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Existing Features</h3>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li
                key={feature.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="text-xl text-gray-700 flex-shrink-0">•</span>
                    <p className="text-gray-800 font-medium break-words min-w-0 flex-1">
                      {feature.title}
                    </p>
                  </div>

                  <div className="flex gap-2 sm:self-center self-end">
                    <button
                      onClick={() => editFeature(feature)}
                      className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition whitespace-nowrap"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFeature(feature.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Services;