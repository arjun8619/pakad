import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = "http://localhost:5000";

export default function BannerForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [backgroundImg, setBackgroundImg] = useState(null);
  const [rightSideImg, setRightSideImg] = useState(null);
  const [message, setMessage] = useState('');
  const [banners, setBanners] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API}/api/banner`);
      setBanners(res.data.banners);
    } catch (err) {
      console.error("Failed to fetch banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setBackgroundImg(null);
    setRightSideImg(null);
    setEditId(null);
    setMessage('');
    document.getElementById('banner-form').reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (backgroundImg) formData.append('backgroundImg', backgroundImg);
    if (rightSideImg) formData.append('rightSideImg', rightSideImg);

    try {
      if (editId) {
        await axios.put(`${API}/api/banner/${editId}`, formData);
        setMessage('Banner updated successfully!');
      } else {
        await axios.post(`${API}/api/banner/create`, formData);
        setMessage('Banner uploaded successfully!');
      }
      resetForm();
      fetchBanners();
    } catch (error) {
      setMessage('Operation failed!');
      console.error(error);
    }
  };

  const handleEdit = (banner) => {
    setTitle(banner.title);
    setDescription(banner.description);
    setEditId(banner._id);
    setMessage('');
    setBackgroundImg(null); // Reset file inputs
    setRightSideImg(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await axios.delete(`${API}/api/banner/${id}`);
        setMessage("Banner deleted successfully.");
        fetchBanners();
      } catch (err) {
        setMessage("Failed to delete.");
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{editId ? "Edit Banner" : "Upload Banner"}</h2>

      <form id="banner-form" onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mt-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 mt-1"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700">Background Image {editId && "(optional)"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBackgroundImg(e.target.files[0])}
            className="mt-1 border rounded px-3 py-2 mb-1 w-full"
          />
        </div>
        {/* <div>
          <label className="block text-gray-700">Right Side Image {editId && "(optional)"}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setRightSideImg(e.target.files[0])}
            className="mt-1  border rounded px-3 py-2 mb-1 w-full "
          />
        </div> */}

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {editId ? "Update" : "Upload"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          )}
        </div>
        {message && <p className="text-green-600 mt-3">{message}</p>}
      </form>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Banner List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Background Image</th>
                {/* <th className="px-4 py-2 border">Right Side Image</th> */}
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <tr key={banner._id}>
                    <td className="px-4 py-2 border">{banner.title}</td>
                    <td className="px-4 py-2 border">{banner.description}</td>
                    <td className="px-4 py-2 border">
                      {banner.backgroundImg && (
                        <img
                          src={`${API}/uploads/${banner.backgroundImg}`}
                          alt="Background"
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                    </td>
                    {/* <td className="px-4 py-2 border">
                      {banner.rightSideImg && (
                        <img
                          src={`${API}/uploads/${banner.rightSideImg}`}
                          alt="Right Side"
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                    </td> */}
                    <td className="px-4 py-2 border space-x-2">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:underline"
                      ><i className="fas fa-edit"></i>
                        
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
                        className="text-red-600 hover:underline"
                      ><i className="fas fa-trash text-black"></i>
                     
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No banners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
