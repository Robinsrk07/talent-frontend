import { useEffect, useState } from "react";
import axios from "axios";
import Default from "../../assets/stock.jpg";
const API_BASE = import.meta.env.VITE_API_BASE_URL

const SubjectTeams = () => {
  const [teams, setTeams] = useState([]);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({ title: "", image: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all teams on load
  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await axios.get(`${API_BASE}/team`, { withCredentials: true });
      setTeams(res.data.data);
    } catch (error) {
      console.error("Failed to fetch teams", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image/jpeg|image/png")) {
      setErrors((prev) => ({ ...prev, image: "Only JPEG/PNG allowed" }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 2MB" }));
      return;
    }

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", image: "" };
    if (!title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }
    if (!editingId && !imageFile) {
      newErrors.image = "Image is required";
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const resetForm = () => {
    setTitle("");
    setImageFile(null);
    setPreviewUrl(null);
    setEditingId(null);
    const fileInput = document.querySelector("input[type='file']");
    if (fileInput) fileInput.value = "";
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("title", title);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingId) {
        await axios.put(`${API_BASE}/team/${editingId}`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API_BASE}/team`, formData, {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchTeams();
      resetForm();
    } catch (error) {
      console.error("Submit failed", error);
    }
  };

  const handleEdit = (team) => {
    setEditingId(team.id);
    setTitle(team.title);
    setPreviewUrl(`${API_BASE}/uploads/${team.filename}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;

    try {
      await axios.delete(`${API_BASE}/team/${id}`, { withCredentials: true });
      fetchTeams();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white overflow-none">
      <div className="w-[95%] m-2 rounded-lg border border-gray-200 bg-white p-8 gap-2 flex flex-col lg:flex-row">
        {/* Form section */}
        <div className="flex flex-col items-center justify-center border border-gray-200 w-[300px] h-[300px] rounded-lg">
          <img
            src={previewUrl || Default}
            alt="Preview"
            className="w-[250px] h-[230px] object-cover p-1 rounded"
          />
          <input
            type="file"
            accept="image/jpeg,image/png"
            className="file-input file-input-bordered m-4 w-[80%]"
            onChange={handleImageChange}
          />
          {errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
        </div>

        <div className="w-full flex flex-col">
          <label className="text-gray-500 font-semibold mb-1">Title for Subject Tutor</label>
          <input
            className={`border rounded-sm w-full md:w-1/2 p-2 ${errors.title ? "border-red-500" : "border-gray-400"}`}
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setErrors((prev) => ({ ...prev, title: "" }));
            }}
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}

          <button
            onClick={handleSubmit}
            className="mt-4 w-full md:w-1/2 bg-[#AE89FF] text-white font-semibold py-2 rounded-sm"
          >
            {editingId ? "Update" : "Upload"}
          </button>
        </div>
      </div>

      {/* Display section */}
      <div className="w-[95%] m-2 overflow-x-auto">
  <div className="flex gap-4 w-max">
    {teams.map((team) => (
      <div
        key={team.id}
        className="min-w-[250px] border rounded p-4 flex flex-col items-center shadow-sm bg-gray-50"
      >
        <img
          src={`${API_BASE}/uploads/${team.filename}`}
          alt={team.title}
          className="w-[200px] h-[200px] object-cover mb-2 rounded"
        />
        <h2 className="text-lg font-semibold mb-1">{team.title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(team)}
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(team.id)}
            className="bg-red-500 text-white px-4 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

    </div>
  );
};

export default SubjectTeams;
