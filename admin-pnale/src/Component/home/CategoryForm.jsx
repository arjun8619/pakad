import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

const CategoryForm = () => {
  const [label, setLabel] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/api/categories`);
      const data = res?.data?.data;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!label) {
      setError("Label is required.");
      return;
    }

    const formData = new FormData();
    formData.append("label", label);
    if (image) formData.append("image", image);

    try {
      if (isEditing && editId) {
        await axios.put(`${API}/api/categories/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post(`${API}/api/categories`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Error submitting category:", err);
      setError("Submission failed.");
    }
  };

  const handleEdit = (category) => {
    setLabel(category.label);
    setImagePreview(`${API}/uploads/${category.image}`);
    setIsEditing(true);
    setEditId(category._id);
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await axios.delete(`${API}/api/categories/${id}`);
        fetchCategories(); // Refresh list
      } catch (err) {
        console.error("Error deleting category:", err);
        alert("Failed to delete the category.");
      }
    }
  };

  const resetForm = () => {
    setLabel("");
    setImage(null);
    setImagePreview(null);
    setIsEditing(false);
    setEditId(null);
    setError("");
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 bg-white border border-gray-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6">
        {isEditing ? "Edit Category" : "Add Category"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Label Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Image Upload */}
        <div className="relative mb-6">
          <label className="block mb-1 text-gray-700 font-medium">
            Image {isEditing && "(optional)"}
          </label>
          <div
            className="w-full h-24 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition"
            onClick={() => document.getElementById('fileUpload').click()}
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="ml-2 text-sm text-gray-600">Click to upload</span>
          </div>
          <input
            id="fileUpload"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          {imagePreview && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-1">Preview:</p>
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
              />
            </div>
          )}
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            {isEditing ? "Update Category" : "Add Category"}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <hr className="my-8" />

      {/* Category Table */}
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Category List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 divide-y divide-gray-200 shadow-sm rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left text-sm font-medium px-4 py-2 border-r">Image</th>
              <th className="text-left text-sm font-medium px-4 py-2 border-r">Label</th>
              <th className="text-left text-sm font-medium px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td className="px-4 py-2 border-r">
                  <img
                    src={`${API}/uploads/${cat.image}`}
                    alt={cat.label}
                    className="w-20 h-12 object-cover rounded"
                  />
                </td>
                <td className="px-4 py-2 border-r">{cat.label}</td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(cat)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center px-4 py-3 text-sm text-gray-500">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryForm;
