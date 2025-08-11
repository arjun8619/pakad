import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000'; // Your backend API

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    message: '',
    answer: '',
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/api/testimonial`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name.trim());
    data.append('location', formData.location.trim());
    data.append('message', formData.message.trim());
    data.append('answer', formData.answer.trim());
    if (formData.image) data.append('image', formData.image);

    try {
      if (editId) {
        await axios.put(`${API}/api/testimonial/${editId}`, data);
        setMessage('Testimonial updated');
      } else {
        await axios.post(`${API}/api/testimonial`, data);
        setMessage('Testimonial added');
      }

      setFormData({
        name: '',
        location: '',
        message: '',
        answer: '',
        image: null,
      });
      setPreview(null);
      setEditId(null);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
      setMessage('Failed to submit');
    }
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      location: item.location,
      message: item.message,
      answer: item.answer || '',
      image: null,
    });
    setPreview(`${API}/uploads/${item.image}`);
    setEditId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/api/testimonial/${id}`);
      fetchTestimonials();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow mt-6">
      <h2 className="text-2xl font-bold mb-4">{editId ? 'Edit' : 'Add'} Testimonial</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          required
          onChange={handleChange}
          placeholder="Name"
          className="border px-3 py-2 rounded w-full"
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          required
          onChange={handleChange}
          placeholder="Location"
          className="border px-3 py-2 rounded w-full"
        />
        <textarea
          name="message"
          value={formData.message}
          required
          onChange={handleChange}
          placeholder="Message"
          className="border px-3 py-2 rounded w-full md:col-span-2"
        />
        {/* <textarea
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          placeholder="Answer (optional)"
          className="border px-3 py-2 rounded w-full md:col-span-2"
        /> */}
        <div className='md:col-span-2'>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="border px-3 py-2   rounded w-full"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 mt-2 rounded object-cover"
            />
          )}
        </div>
        <div className="flex items-end ">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editId ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>

      {message && <p className="mt-3 text-green-600">{message}</p>}

      {/* Table */}
      <div className="mt-10 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Testimonials List</h3>
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Location</th>
              <th className="px-4 py-2 border">Message</th>
              {/* <th className="px-4 py-2 border">Answer</th> */}
              <th className="px-4 py-2 border">Image</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length > 0 ? (
              testimonials.map((item) => (
                <tr key={item._id}>
                  <td className="border px-4 py-2">{item.name}</td>
                  <td className="border px-4 py-2">{item.location}</td>
                  <td className="border px-4 py-2">{item.message}</td>
                  {/* <td className="border px-4 py-2">{item.answer || '—'}</td> */}
                  <td className="border px-4 py-2">
                    {item.image && (
                      <img
                        src={`${API}/uploads/${item.image}`}
                        alt="Uploaded"
                        className="w-14 h-14 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:underline mr-2"
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
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-500"
                >
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
