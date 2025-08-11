import React, { useState, useEffect } from "react";
import axios from "axios";
import './../assests/css/style.css';
import './../assests/css/responsive.css';

const API = "http://localhost:5000";

export default function Header() {
  const [header, setHeader] = useState(null);

  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await axios.get(`${API}/api/header`);
        if (res.data.header) {
          setHeader(res.data.header);
        }
      } catch (err) {
        console.error("Error fetching header:", err);
      }
    };

    fetchHeader();
  }, []);

  if (!header) return null;

  return (
    <header className="header-sec">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <a className="navbar-brand" href="#">
            {header.logo && (
              <img src={`${API}/${header.logo}`} alt="Logo" />
            )}
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
              {(header.links || []).map((link, index) => (
                <li className="nav-item" key={index}>
                  <a className="nav-link" href={link.url}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav-item tp-btn">
              {header.playstore && (
                <a href="#">
                  <img
                    src={`${API}/${header.playstore}`}
                    alt="Get it on Google Play"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
