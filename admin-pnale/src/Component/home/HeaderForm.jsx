import React, { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000";

export default function HeaderForm() {
  const [formData, setFormData] = useState({
    logo: null,
    playstore: null,
    links: [{ label: "", url: "" }],
  });

  const [preview, setPreview] = useState({ logo: "", playstore: "" });
  const [header, setHeader] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    axios
      .get(`${API}/api/header`)
      .then((res) => {
        if (res.data.header) {
          const { logo, playstore, links, _id } = res.data.header;
          setHeader(res.data.header);
          setIsEditing(true);
          setFormData({
            logo: null,
            playstore: null,
            links: links.length ? links : [{ label: "", url: "" }],
          });
          setPreview({
            logo: `${API}/${logo}`,
            playstore: `${API}/${playstore}`,
          });
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleInputChange = (index, field, value) => {
    const newLinks = [...formData.links];
    newLinks[index][field] = value;
    setFormData({ ...formData, links: newLinks });
  };

  const addLinkField = () => {
    setFormData({
      ...formData,
      links: [...formData.links, { label: "", url: "" }],
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) {
      setFormData({ ...formData, [name]: files[0] });
      const fileURL = URL.createObjectURL(files[0]);
      setPreview((prev) => ({ ...prev, [name]: fileURL }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const data = new FormData();
    if (formData.logo) data.append("logo", formData.logo);
    if (formData.playstore) data.append("playstore", formData.playstore);
    data.append("links", JSON.stringify(formData.links));

    try {
      let res;
      if (isEditing && header?._id) {
        res = await axios.put(`${API}/api/header/${header._id}`, data);
      } else {
        res = await axios.post(`${API}/api/header`, data);
      }

      const saved = res.data.header;
      setHeader(saved);
      setFormData({
        logo: null,
        playstore: null,
        links: saved.links.length ? saved.links : [{ label: "", url: "" }],
      });
      setPreview({
        logo: `${API}/${saved.logo}`,
        playstore: `${API}/${saved.playstore}`,
      });
      setIsEditing(true);
      alert("Header saved successfully!");
    } catch (error) {
      console.error("Save error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-lg space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Update" : "Create"} Header
        </h1>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo Image
          </label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700"
          />
          {preview.logo && (
            <img src={preview.logo} className="mt-2 h-20 rounded border" />
          )}
        </div>

        {/* Playstore Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Playstore Image
          </label>
          <input
            type="file"
            name="playstore"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-700"
          />
          {preview.playstore && (
            <img src={preview.playstore} className="mt-2 h-20 rounded border" />
          )}
        </div>

        {/* Navigation Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Navigation Links
          </label>
          {formData.links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row gap-2 sm:items-center mb-2"
            >
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) =>
                  handleInputChange(index, "label", e.target.value)
                }
                className="border border-gray-300 p-2 rounded flex-1"
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) =>
                  handleInputChange(index, "url", e.target.value)
                }
                className="border border-gray-300 p-2 rounded flex-1"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addLinkField}
            className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
          >
            + Add Link
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg text-lg"
        >
          {isEditing ? "Update Header" : "Create Header"}
        </button>
      </form>

      {/* Preview Table */}
      {header && (
        <div className="mt-10 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Saved Header Data</h2>

          <div className="flex gap-10 mb-6">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Logo:</p>
              <img
                src={`${API}/${header.logo}`}
                alt="Saved Logo"
                className="h-16 border rounded"
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Playstore:
              </p>
              <img
                src={`${API}/${header.playstore}`}
                alt="Saved Playstore"
                className="h-16 border rounded"
              />
            </div>
          </div>

          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-gray-700">
                  Label
                </th>
                <th className="border px-4 py-2 text-left text-gray-700">
                  URL
                </th>
              </tr>
            </thead>
            <tbody>
              {header.links.map((link, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">{link.label}</td>
                  <td className="border px-4 py-2 text-blue-600">
                    {link.url}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
