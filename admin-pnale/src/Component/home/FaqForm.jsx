import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function FaqForm() {
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [inputKey, setInputKey] = useState(Date.now());

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get(`${API}/api/faq`);
      setFaqs(res.data.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ question: '', answer: '', image: null });
    setPreview(null);
    setEditingId(null);
    setInputKey(Date.now());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('question', formData.question);
    payload.append('answer', formData.answer);
    if (formData.image) payload.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`${API}/api/faq/${editingId}`, payload);
        setMessage('✅ FAQ updated successfully!');
      } else {
        await axios.post(`${API}/api/faq`, payload);
        setMessage('✅ FAQ created successfully!');
      }
      resetForm();
      fetchFaqs();
    } catch (err) {
      console.error(err);
      setMessage('❌ Submission failed!');
    }

    setTimeout(() => setMessage(''), 3000);
  };

  const handleEdit = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      image: null,
    });
    setPreview(`${API}/uploads/${faq.image}`);
    setEditingId(faq._id);
    setInputKey(Date.now());
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await axios.delete(`${API}/api/faq/${id}`);
      fetchFaqs();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit FAQ' : 'Add FAQ'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block mb-1 font-medium">Question</label>
          <input
            type="text"
            name="question"
            value={formData.question}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Answer</label>
          <textarea
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            rows={3}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Image (optional)</label>
          <input
            key={inputKey}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border px-3 py-2 rounded"
          />
          {preview && <img src={preview} alt="Preview" className="mt-2 w-32 h-20 object-cover border rounded" />}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {editingId ? 'Update' : 'Submit'}
        </button>
        {message && <p className="mt-3 font-medium text-green-600">{message}</p>}
      </form>

      {/* Table */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">FAQ List</h3>
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Question</th>
              <th className="border px-4 py-2">Answer</th>
              <th className="border px-4 py-2">Image</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length ? (
              faqs.map((faq) => (
                <tr key={faq._id}>
                  <td className="border px-4 py-2">{faq.question}</td>
                  <td className="border px-4 py-2">{faq.answer}</td>
                  <td className="border px-4 py-2">
                    {faq.image && (
                      <img src={`${API}/uploads/${faq.image}`} alt="FAQ" className="w-16 h-12 object-cover rounded" />
                    )}
                  </td>
                  <td className="border px-4 py-2 space-x-2">
                    <button onClick={() => handleEdit(faq)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(faq._id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No FAQs available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
