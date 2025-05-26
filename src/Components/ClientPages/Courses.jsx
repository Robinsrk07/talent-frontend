import { useEffect, useState } from "react";
import axios from "axios";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Courses = () => {
  const [courses, setCourses] = useState([]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE_URL}/courses`);
      if (res.status === 200) {
        setCourses(res.data);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      {/* Grid container for 2 cards per row on large screens */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex flex-col md:flex-row bg-white border border-gray-300 shadow-lg rounded-lg overflow-hidden"
          >
            {/* Image (Top on mobile, Left on desktop) */}
            <div className="w-full md:w-1/2 h-48 md:h-auto">
              <img
                src={`${VITE_API_BASE_URL}/uploads/${course.image}`}
                alt={course.heading}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text (Below on mobile, Right on desktop) */}
            <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
              <h2 className="text-2xl font-semibold mb-2">{course.heading}</h2>
              <h3 className="text-lg text-gray-700 mb-4">{course.subheading}</h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;