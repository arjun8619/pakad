import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function AboutTeamForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
    playstoreImage: null,
  });

  const [preview, setPreview] = useState({ image: null, playstoreImage: null });
  const [teamList, setTeamList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  // Handle text input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input with preview
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    setFormData((prev) => ({ ...prev, [name]: file }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreview((prev) => ({ ...prev, [name]: reader.result }));
    };
    if (file) reader.readAsDataURL(file);
  };

  const fetchTeamList = async () => {
    try {
      const res = await axios.get(`${API}/api/about-team`);
      setTeamList(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeamList();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    if (formData.image) payload.append('image', formData.image);
    if (formData.playstoreImage) payload.append('playstoreImage', formData.playstoreImage);

    try {
      if (editId) {
        await axios.put(`${API}/api/about-team/${editId}`, payload);
        setMessage('Updated successfully!');
      } else {
        await axios.post(`${API}/api/about-team`, payload);
        setMessage('Submitted successfully!');
      }

      setFormData({ title: '', description: '', image: null, playstoreImage: null });
      setPreview({ image: null, playstoreImage: null });
      setEditId(null);
      fetchTeamList();
      document.getElementById('team-form').reset();
    } catch (err) {
      setMessage('Failed to submit!');
      console.error(err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      image: null,
      playstoreImage: null,
    });
    setPreview({
      image: `${API}/uploads/${item.image}`,
      playstoreImage: `${API}/uploads/${item.playstoreImage}`,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await axios.delete(`${API}/api/about-team/${id}`);
        fetchTeamList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">
        {editId ? 'Edit' : 'Add'} About Team Section
      </h2>

      <form id="team-form" onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            rows={3}
            required
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
        </div>

        <div>
          <label className="block font-medium">Team Image {editId && '(optional)'}</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {preview.image && (
            <img src={preview.image} alt="Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        <div>
          <label className="block font-medium">Playstore Logo {editId && '(optional)'}</label>
          <input
            type="file"
            name="playstoreImage"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded mt-1"
          />
          {preview.playstoreImage && (
            <img src={preview.playstoreImage} alt="Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Update' : 'Submit'}
        </button>

        {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
      </form>

      {/* Table */}
      <div className="mt-10 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Team Entries</h3>
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Playstore</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamList.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.title}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2">
                  {item.image && (
                    <img
                      src={`${API}/uploads/${item.image}`}
                      alt="img"
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="border px-4 py-2">
                  {item.playstoreImage && (
                    <img
                      src={`${API}/uploads/${item.playstoreImage}`}
                      alt="img"
                      className="w-16 h-12 object-cover rounded"
                    />
                  )}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {teamList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
