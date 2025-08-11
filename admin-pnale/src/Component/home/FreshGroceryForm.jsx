import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function FreshGroceryForm() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    playstoreImage: null,
    bannerImage: null,
  });

  const [preview, setPreview] = useState({ playstoreImage: null, bannerImage: null });
  const [groceryList, setGroceryList] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData(prev => ({ ...prev, [name]: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(prev => ({ ...prev, [name]: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const fetchGroceryList = async () => {
    try {
      const res = await axios.get(`${API}/api/fresh-grocery/`);
      setGroceryList(res.data.data || []);
    } catch (err) {
      console.error('Fetch failed:', err);
    }
  };

  useEffect(() => {
    fetchGroceryList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('description', formData.description);
    if (formData.playstoreImage) payload.append('playstoreImage', formData.playstoreImage);
    if (formData.bannerImage) payload.append('bannerImage', formData.bannerImage);

    try {
      if (editId) {
        await axios.put(`${API}/api/fresh-grocery/${editId}`, payload);
        setMessage('Updated successfully!');
      } else {
        await axios.post(`${API}/api/fresh-grocery/`, payload);
        setMessage('Created successfully!');
      }
      resetForm();
      fetchGroceryList();
    } catch (err) {
      setMessage('Submission failed!');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      playstoreImage: null,
      bannerImage: null,
    });
    setPreview({
      playstoreImage: item.playstoreImage ? `${API}/uploads/${item.playstoreImage}` : null,
      bannerImage: item.bannerImage ? `${API}/uploads/${item.bannerImage}` : null,
    });
    document.getElementById('grocery-form').reset();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`${API}/api/fresh-grocery/${id}`);
      setMessage('Deleted successfully!');
      fetchGroceryList();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      playstoreImage: null,
      bannerImage: null,
    });
    setPreview({ playstoreImage: null, bannerImage: null });
    document.getElementById('grocery-form').reset();
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {editId ? 'Edit Fresh Grocery' : 'Add Fresh Grocery'}
      </h2>

      <form id="grocery-form" onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Playstore Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Playstore Image {editId && '(optional)'}
          </label>
          <input
            type="file"
            name="playstoreImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {preview.playstoreImage && (
            <img src={preview.playstoreImage} alt="Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        {/* Banner Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Banner Image {editId && '(optional)'}
          </label>
          <input
            type="file"
            name="bannerImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {preview.bannerImage && (
            <img src={preview.bannerImage} alt="Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
          >
            {editId ? 'Update' : 'Submit'}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>

        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>

      {/* Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Fresh Grocery List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Subtitle</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Playstore</th>
                <th className="px-4 py-2 border">Banner</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
  {groceryList.length > 0 ? (
    groceryList.map(item => (
      <tr key={item._id}>
        <td className="border px-4 py-2">{item.title}</td>
        <td className="border px-4 py-2">{item.subtitle}</td>
        <td className="border px-4 py-2">{item.description}</td>
        <td className="border px-4 py-2">
          {item.playstoreImage && (
            <img
              src={`${API}/uploads/${item.playstoreImage}`}
              alt="Playstore"
              className="w-16 h-12 object-cover rounded"
            />
          )}
        </td>
        <td className="border px-4 py-2">
          {item.bannerImage && (
            <img
              src={`${API}/uploads/${item.bannerImage}`}
              alt="Banner"
              className="w-16 h-12 object-cover rounded"
            />
          )}
        </td>
        <td className="border px-4 py-2">
          {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'N/A'}
        </td> {/* ✅ NEW */}
        <td className="border px-4 py-2 space-x-2">
          <button
            onClick={() => handleEdit(item)}
            className="text-blue-600 hover:underline"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDelete(item._id)}
            className="text-red-600 hover:underline"
          >
            <i className="fas fa-trash text-black"></i>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-4 text-gray-500">No data found.</td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
