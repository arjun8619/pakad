import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShippingForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iconClass: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [shippingList, setShippingList] = useState([]);
  const [editId, setEditId] = useState(null);

  // Fetch shipping data on mount
  const fetchShippingItems = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/shipping');
      setShippingList(res.data.data || []);
    } catch (error) {
      console.error('Error fetching shipping items:', error);
    }
  };

  useEffect(() => {
    fetchShippingItems();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('iconClass', formData.iconClass);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editId) {
        // Update
        await axios.put(`http://localhost:5000/api/shipping/${editId}`, data);
        alert('Shipping item updated!');
      } else {
        // Create
        await axios.post('http://localhost:5000/api/shipping/create', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Shipping item added!');
      }

      // Reset
      setFormData({ title: '', description: '', iconClass: '', image: null });
      setPreview(null);
      setEditId(null);
      fetchShippingItems();
    } catch (err) {
      console.error('Error:', err);
      alert('Something went wrong!');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description,
      iconClass: item.iconClass,
      image: null,
    });
    setPreview(`http://localhost:5000/uploads/${item.image}`);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await axios.delete(`http://localhost:5000/api/shipping/${id}`);
        fetchShippingItems();
      } catch (err) {
        console.error('Delete error:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        {editId ? 'Edit Shipping Item' : 'Add Shipping Item'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Icon Class (Font Awesome)</label>
          <input
            type="text"
            name="iconClass"
            value={formData.iconClass}
            onChange={handleChange}
            placeholder="e.g. fa-solid fa-truck"
            className="w-full border border-gray-300 px-4 py-2 rounded-md"
          />
        </div>

{/* <div className="relative mb-4">
  <label className="block mb-1 text-gray-700 font-medium">Image</label> */}

  {/* Custom Upload Box */}
  {/* <div
    className="w-full h-24 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition"
    onClick={() => document.getElementById('fileUpload').click()}
  >
    <svg
      className="w-6 h-6 text-gray-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
      />
    </svg>
  </div> */}

  {/* Hidden File Input */}
  {/* <input
    id="fileUpload"
    type="file"
    name="image"
    accept="image/*"
    onChange={handleChange}
    className="hidden"
  /> */}

  {/* Image Preview */}
  {/* {preview && (
    <div className="mt-3">
      <p className="text-sm text-gray-600 mb-1">Preview:</p>
      <img
        src={preview}
        alt="Preview"
        className="w-32 h-20 object-cover rounded-md border border-gray-300 shadow-sm"
      />
    </div>
  )}
</div> */}



        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {editId ? 'Update Shipping' : 'Add Shipping'}
        </button>
      </form>

      {/* Shipping Table */}
      <hr className="my-10" />
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Shipping List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-2 border">Title</th>
              <th className="text-left px-4 py-2 border">Description</th>
              <th className="text-left px-4 py-2 border">Icon</th>
              {/* <th className="text-left px-4 py-2 border">Image</th> */}
              <th className="text-left px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shippingList.map((item) => (
              <tr key={item._id} className="border-t">
                <td className="px-4 py-2 border">{item.title}</td>
                <td className="px-4 py-2 border">{item.description}</td>
                <td className="px-4 py-2 border">
                  <i className={item.iconClass}></i> {item.iconClass}
                </td>
                {/* <td className="px-4 py-2 border">
                  {item.image && (
                    <img
                      src={`http://localhost:5000/uploads/${item.image}`}
                      alt="shipping"
                      className="w-20 h-12 object-cover rounded"
                    />
                  )}
                </td> */}
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="px-2 py-1 text-sm text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {shippingList.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No shipping items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingForm;
