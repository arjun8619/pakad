import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000'; // Adjust to your API base

export default function StoreSectionForm() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: null,
    features: [{ iconClass: '', heading: '', subtext: '' }],
  });
  const [preview, setPreview] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const res = await axios.get(`${API}/api/store-section`);
      setStoreData(res.data.data || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, { iconClass: '', heading: '', subtext: '' }] });
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('subtitle', formData.subtitle);
    payload.append('description', formData.description);
    payload.append('features', JSON.stringify(formData.features));
    if (formData.image) payload.append('image', formData.image);

    try {
      if (editId) {
        await axios.put(`${API}/api/store-section/${editId}`, payload);
        setEditId(null);
      } else {
        await axios.post(`${API}/api/store-section`, payload);
      }
      fetchStoreData();
      setFormData({
        title: '',
        subtitle: '',
        description: '',
        image: null,
        features: [{ iconClass: '', heading: '', subtext: '' }],
      });
      setPreview(null);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setFormData({
      title: item.title,
      subtitle: item.subtitle,
      description: item.description,
      features: item.features || [],
      image: null,
    });
    setPreview(`${API}/uploads/${item.image}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/store-section/${id}`);
      fetchStoreData();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">{editId ? 'Edit' : 'Add'} Store Section</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
    <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
        <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" required className="w-full border px-3 py-2 rounded" />
    
    </div>
    <div>
                         
                      <label className="block text-sm font-medium text-gray-700">Subtitle</label>
        <input name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="Subtitle" required className="w-full border px-3 py-2 rounded" />

    </div>
       <div>
                             <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" required className="w-full border  px-3 py-2 rounded" rows="3" />

       </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} className="w-full border px-3 py-2 rounded mt-1" />
          {preview && <img src={preview} alt="Preview" className="w-32 h-20 mt-2 object-cover rounded border" />}
        </div>

        <div>
          <label className="block font-medium text-gray-700">Features</label>
          {formData.features.map((feature, index) => (
            <div key={index} className="flex space-x-2 mt-2">
              <input
                type="text"
                value={feature.iconClass}
                onChange={(e) => handleFeatureChange(index, 'iconClass', e.target.value)}
                placeholder="Icon Class (e.g., fa-truck-fast)"
                className="w-1/3 border px-2 py-1 rounded"
              />
              <input
                type="text"
                value={feature.heading}
                onChange={(e) => handleFeatureChange(index, 'heading', e.target.value)}
                placeholder="Heading"
                className="w-1/3 border px-2 py-1 rounded"
              />
              <input
                type="text"
                value={feature.subtext}
                onChange={(e) => handleFeatureChange(index, 'subtext', e.target.value)}
                placeholder="Subtext"
                className="w-1/3 border px-2 py-1 rounded"
              />
              <button type="button" onClick={() => removeFeature(index)} className="text-red-500">✕</button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="mt-2 text-blue-600 hover:underline">+ Add Feature</button>
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editId ? 'Update' : 'Submit'}
        </button>
      </form>

      {/* Table Display */}
      <div className="mt-10 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-3">Store Section List</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Subtitle</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Features</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {storeData.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.title}</td>
                <td className="border px-4 py-2">{item.subtitle}</td>
                <td className="border px-4 py-2">{item.description}</td>
                <td className="border px-4 py-2">
                  {item.image && (
                    <img src={`${API}/uploads/${item.image}`} alt="store" className="w-16 h-12 object-cover rounded" />
                  )}
                </td>
                <td className="border px-4 py-2">
                  {item.features?.map((f, i) => (
                    <div key={i} className="mb-1">
                      <i className={`fa ${f.iconClass} mr-1`} /> {f.heading} - {f.subtext}
                    </div>
                  ))}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {storeData.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
