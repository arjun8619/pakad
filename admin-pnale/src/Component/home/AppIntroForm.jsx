import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function AppIntroForm() {
  const [formData, setFormData] = useState({
    heading: '',
    description: '',
    mobileImage: null,
    playstoreImage: null,
  });

  const [preview, setPreview] = useState({ mobileImage: null, playstoreImage: null });
  const [entries, setEntries] = useState([]);
  const [message, setMessage] = useState('');
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchEntries = async () => {
    const res = await axios.get(`${API}/api/app-intro`);
    setEntries(res.data.data || []);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('heading', formData.heading);
    payload.append('description', formData.description);
    if (formData.mobileImage) payload.append('mobileImage', formData.mobileImage);
    if (formData.playstoreImage) payload.append('playstoreImage', formData.playstoreImage);

    try {
      if (editId) {
        await axios.put(`${API}/api/app-intro/${editId}`, payload);
        setMessage('Updated successfully!');
      } else {
        await axios.post(`${API}/api/app-intro`, payload);
        setMessage('Created successfully!');
      }

      setFormData({ heading: '', description: '', mobileImage: null, playstoreImage: null });
      setPreview({ mobileImage: null, playstoreImage: null });
      setEditId(null);
      fetchEntries();
    } catch (err) {
      setMessage('Failed to submit.');
      console.error(err);
    }
  };

  const handleEdit = (entry) => {
    setEditId(entry._id);
    setFormData({
      heading: entry.heading,
      description: entry.description,
      mobileImage: null,
      playstoreImage: null,
    });
    setPreview({
      mobileImage: `${API}/uploads/${entry.mobileImage}`,
      playstoreImage: `${API}/uploads/${entry.playstoreImage}`,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/app-intro/${id}`);
      setMessage('Deleted successfully!');
      fetchEntries();
    } catch (err) {
      setMessage('Delete failed.');
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit' : 'Add'} App Intro</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Heading</label>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Mobile Image</label>
          <input type="file" name="mobileImage" accept="image/*" onChange={handleFileChange} className="w-full border px-3 py-2 rounded" />
          {preview.mobileImage && (
            <img src={preview.mobileImage} alt="Mobile Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Playstore Image</label>
          <input type="file" name="playstoreImage" accept="image/*" onChange={handleFileChange} className="w-full border px-3 py-2 rounded" />
          {preview.playstoreImage && (
            <img src={preview.playstoreImage} alt="Playstore Preview" className="w-32 h-20 mt-2 object-cover border rounded" />
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded"
        >
          {editId ? 'Update' : 'Submit'}
        </button>
        {message && <p className="text-sm text-green-600 mt-2">{message}</p>}
      </form>

      {/* Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">App Intro List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Heading</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Mobile</th>
                <th className="px-4 py-2 border">Playstore</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.length > 0 ? (
                entries.map((item) => (
                  <tr key={item._id}>
                    <td className="border px-4 py-2">{item.heading}</td>
                    <td className="border px-4 py-2">{item.description}</td>
                    <td className="border px-4 py-2">
                      {item.mobileImage && (
                        <img
                          src={`${API}/uploads/${item.mobileImage}`}
                          alt="Mobile"
                          className="w-16 h-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {item.playstoreImage && (
                        <img
                          src={`${API}/uploads/${item.playstoreImage}`}
                          alt="Playstore"
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">No entries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
