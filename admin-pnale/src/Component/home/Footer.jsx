// components/FooterForm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function FooterForm() {
  const [formData, setFormData] = useState({
    logo: null,
    description: '',
    workHours: '',
    phone: '',
    address: '',
    email: '',
    socialLinks: '',
    pageLinks: '',
    customerCareLinks: ''
  });

  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [footers, setFooters] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFooters();
  }, []);

  const fetchFooters = async () => {
    try {
      const res = await axios.get(`${API}/api/footer`);
      setFooters(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setFooters([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, logo: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = new FormData();

    if (formData.logo) data.append('logo', formData.logo);
    data.append('description', formData.description);
    data.append('workHours', formData.workHours);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('email', formData.email);
    data.append('socialLinks', JSON.stringify(formData.socialLinks.split(',').map(s => s.trim())));
    data.append('pageLinks', JSON.stringify(formData.pageLinks.split(',').map(s => s.trim())));
    data.append('customerCareLinks', JSON.stringify(formData.customerCareLinks.split(',').map(s => s.trim())));

    try {
      if (editId) {
        await axios.put(`${API}/api/footer/${editId}`, data);
        setMessage('Footer updated successfully.');
      } else {
        await axios.post(`${API}/api/footer`, data);
        setMessage('Footer created successfully.');
      }

      setFormData({
        logo: null,
        description: '',
        workHours: '',
        phone: '',
        address: '',
        email: '',
        socialLinks: '',
        pageLinks: '',
        customerCareLinks: ''
      });
      setPreview(null);
      setEditId(null);
      fetchFooters();
    } catch (err) {
      console.error(err);
      setError('Error saving footer. Please check inputs and try again.');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      logo: null,
      description: item.description,
      workHours: item.workHours,
      phone: item.phone,
      address: item.address,
      email: item.email,
      socialLinks: (item.socialLinks || []).join(', '),
      pageLinks: (item.pageLinks || []).join(', '),
      customerCareLinks: (item.customerCareLinks || []).join(', ')
    });
    setPreview(`${API}/uploads/${item.logo}`);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/footer/${id}`);
      fetchFooters();
    } catch (err) {
      console.error(err);
      setError('Error deleting footer.');
    }
  };

  const renderLinkList = (list) =>
    Array.isArray(list) && list.length > 0 ? (
      <ul className="list-disc pl-4 text-blue-600">
        {list.map((link, idx) => (
          <li key={idx}>
            <a href={link} target="_blank" rel="noreferrer" className="hover:underline">{link}</a>
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-gray-500 italic">None</span>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit Footer' : 'Add Footer'}</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {message && <p className="text-green-600 mb-2">{message}</p>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4" encType="multipart/form-data">
        <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="workHours" value={formData.workHours} onChange={handleChange} placeholder="Work Hours" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="border px-3 py-2 rounded w-full" />
        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="socialLinks" value={formData.socialLinks} onChange={handleChange} placeholder="Social Links (comma separated)" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="pageLinks" value={formData.pageLinks} onChange={handleChange} placeholder="Page Links (comma separated)" className="border px-3 py-2 rounded w-full" />
        <input type="text" name="customerCareLinks" value={formData.customerCareLinks} onChange={handleChange} placeholder="Customer Care Links (comma separated)" className="border px-3 py-2 rounded w-full" />

        <div className="md:col-span-2">
          <input type="file" accept="image/*" onChange={handleFileChange} className="border px-3 py-2 rounded w-full" />
          {preview && <img src={preview} alt="Preview" className="w-24 h-24 mt-2 rounded object-cover" />}
        </div>

        <div className="md:col-span-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editId ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>

      <div className="mt-10 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Footer Entries</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-3 py-2 border">Logo</th>
              <th className="px-3 py-2 border">Description</th>
              <th className="px-3 py-2 border">Contact</th>
              <th className="px-3 py-2 border">Links</th>
              <th className="px-3 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {footers.length > 0 ? (
              footers.map((item) => (
                <tr key={item._id}>
                  <td className="px-3 py-2 border">
                    {item.logo && <img src={`${API}/uploads/${item.logo}`} alt="logo" className="w-14 h-14 object-cover rounded" />}
                  </td>
                  <td className="px-3 py-2 border">{item.description}</td>
                  <td className="px-3 py-2 border">
                    <div><strong>Phone:</strong> {item.phone}</div>
                    <div><strong>Email:</strong> {item.email}</div>
                    <div><strong>Address:</strong> {item.address}</div>
                    <div><strong>Hours:</strong> {item.workHours}</div>
                  </td>
                  <td className="px-3 py-2 border">
                    <div><strong>Social:</strong> {renderLinkList(item.socialLinks)}</div>
                    <div><strong>Pages:</strong> {renderLinkList(item.pageLinks)}</div>
                    <div><strong>Care:</strong> {renderLinkList(item.customerCareLinks)}</div>
                  </td>
                  <td className="px-3 py-2 border">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline mr-2">Edit</button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center text-gray-500 py-4">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
