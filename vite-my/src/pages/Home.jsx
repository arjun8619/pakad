import React, { useEffect, useState } from "react";
import axios from "axios";

import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "./../assests/css/responsive.css";
import playstore from "./../assests/images/playstore.svg";
import noodels from "./../assests/images/noodels.png";
import groceries from "./../assests/images/groceries.png";
import storess from "./../assests/images/storess.png";
import abouts from "./../assests/images/abouts.png";
import mobile from "./../assests/images/mobile.jpg";
import faqs from "./../assests/images/faqs.png";
import logo from "./../assests/images/logo.png";
import baner from "./../assests/images/banner.png";

const API = "http://localhost:5000";
export default function Home() {
  const [shippingList, setShippingList] = useState([]);
  const [banner, setBanner] = useState(null);
    const [categories, setCategories] = useState([]);
const [freshGrocery, setFreshGrocery] = useState(null);
const [store, setStore] = useState(null);
const [teamData, setTeamData] = useState(null);
  const [intro, setIntro] = useState(null);
    const [faqs, setFaqs] = useState([]);
     const [testimonials, setTestimonials] = useState([]);
       const [footer, setFooter] = useState(null);


  // Initialize OwlCarousel options
  // for the category section
  const options = {
    loop: true,
    margin: 10,
    nav: false,
    dots: false,
    autoplay: true,
    responsive: {
      0: { items: 2 },
      600: { items: 3 },
      1000: { items: 6 },
    },
  };

  const items = Array(6).fill({
    src: noodels,
    label: "Noodels",
  });

  // Fetch the latest banner from the API
  // and display it in the banner section

  const fetchLatestBanner = async () => {
    try {
      const res = await axios.get(`${API}/api/banner`);
      if (res.data.banners && res.data.banners.length > 0) {
        setBanner(res.data.banners[res.data.banners.length - 1]); // get the latest
      }
    } catch (err) {
      console.error("Error fetching banner:", err);
    }
  };
  // Fetch shipping items from the API
  // and display them in the shipping section

  const fetchShippingItems = async () => {
    try {
      const res = await axios.get(`${API}/api/shipping`);
      console.log(res.data.data);
      setShippingList(res.data.data || []);
    } catch (err) {
      console.error("Error fetching shipping data:", err);
    }
  };
//  Fetch category items from the API
   const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/api/categories`);
        const data = res?.data?.data;
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setCategories([]);
      }
    };
    //  Fetch fetchLatestGrocery items from the API
    // fresh-grocery
    //   const fetchLatestGrocery = async () => {
    //   try {
    //     const res = await axios.get(`${API}/api/fresh-grocery`);
    //     const list = res.data?.data;
    //     if (Array.isArray(list) && list.length > 0) {
    //       setFreshGrocery(list[list.length - 1]); // latest one
    //     }
    //   } catch (err) {
    //     console.error('Error fetching fresh grocery data:', err);
    //   }
    // };
  const fetchLatestGrocery = async () => {
      try {
        const res = await axios.get(`${API}/api/fresh-grocery`);
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          setFreshGrocery(list[list.length - 1]); // latest one
        }
      } catch (err) {
        console.error('Error fetching fresh grocery data:', err);
      }
    };
// Fetch fetchStoreSection items from the API

    const fetchStoreSection = async () => {
      try {
        const res = await axios.get(`${API}/api/store-section`);
        const list = res.data?.data;
        if (list && list.length > 0) {
          setStore(list[list.length - 1]); // Latest entry
        }
      } catch (err) {
        console.error("Error fetching store section:", err);
      }
    };
    // Fetch fetchAboutTeam items from the API
   const fetchAboutTeam = async () => {
      try {
        const res = await axios.get(`${API}/api/about-team`);
        const list = res.data?.data;
        if (Array.isArray(list) && list.length > 0) {
          setTeamData(list[list.length - 1]); // Get the latest one
        }
      } catch (err) {
        console.error("Error fetching about team section:", err);
      }
    };
    //Fetch fetchIntro items from the API
    const fetchIntro = async () => {
      try {
        const res = await axios.get(`${API}/api/app-intro`);
        if (res.data.data.length > 0) {
          // Assuming the latest is the last one
          setIntro(res.data.data[res.data.data.length - 1]);
        }
      } catch (err) {
        console.error("Error fetching app intro:", err);
      }
    };

        //Fetch fetchFaqs items from the API

        const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${API}/api/faq`);
        setFaqs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
//fetchTestimonials items from the API
   const fetchTestimonials = async () => {
      try {
        const res = await axios.get(`${API}/api/testimonial`);
        setTestimonials(res.data || []);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      }
    };
    // fetchFoote items from the API
        const fetchFooter = async () => {
      try {
        const res = await axios.get(`${API}/api/footer`);
        if (res.data && res.data.length > 0) {
          setFooter(res.data[res.data.length - 1]); // get latest
        }
      } catch (err) {
        console.error("Failed to load footer:", err);
      }
    };




  useEffect(() => {
    fetchShippingItems();
    fetchLatestBanner();
   fetchCategories();
       fetchLatestGrocery();
        fetchStoreSection();
           fetchAboutTeam();
            fetchIntro();
            fetchFaqs();
             fetchTestimonials();
              fetchFooter();

  }, []);

  if (!banner) {
    return null; // or a loading spinner
  }
  
  if (!freshGrocery) return null; // or loading spinner
 if (!store) return null; // or loading state
 if (!teamData) return null; // or loading spinner
  if (!intro) return null;
   if (!faqs.length) return null;
   if (!footer) return null; // or a loading spinner

  return (
    <>
      <section
        className="banner-sec"
        style={{
          backgroundImage: `url(${API}/uploads/${banner.backgroundImg})`,
        }}
      >
        <div className="container pos">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              <div className="banner-hm-box text-white">
                <h1>{banner.title}</h1>
                <p>{banner.description}</p>
                <div className="play-store-btn">
                  <a href="#">
                    <img src={playstore} alt="Get it on Google Play" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              {banner.rightSideImg && (
                <div className="text-center">
                  <img
                    src={`${API}/uploads/${banner.rightSideImg}`}
                    alt="Right Side"
                    className="img-fluid"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="shipping-sec py-5 bg-light">
        <div className="container">
          <div className="row">
            {shippingList?.map((item) => {
              console.log(item)
              return (
                <div
                  key={item._id}
                  className="col-lg-3 col-md-6 col-sm-12 mt-2"
                >
                  <div className="shipping-box d-flex align-items-start gap-3 p-3 border rounded bg-white">
                    {item.iconClass && (
                      <i
                        className={`${item.iconClass} fas-icon fs-3 text-primary`}
                      ></i>
                    )}
                    <div className="shipping-content">
                      <h4 className="mb-1 text-dark">{item.title}</h4>
                      <p className="mb-0 text-dark">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {shippingList?.length === 0 && (
              <div className="col-12 text-center text-muted py-4">
                No shipping items available.
              </div>
            )}
          </div>
        </div>
      </section>
     <section className="category-sec py-5">
      <div className="container">
        <h5 className="text-center">
          Best <span>Selling</span> Categories
        </h5>
        <p className="text-center text-muted">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br />
          Beatae dicta aut sint fugit aspernatur ipsa nihil voluptate vero
          dignissimos obcaecati.
        </p>
        <div className="row mt-4">
          {categories.length > 0 ? (
            <OwlCarousel className="owl-theme" {...options}>
              {categories.map((item, index) => (
                <div className="item text-center px-2" key={index}>
                  <img
                    src={`${API}/uploads/${item.image}`}
                    className="w-100 rounded shadow-sm"
                    alt={item.label}
                  />
                  <h6 className="mt-2">{item.label}</h6>
                </div>
              ))}
            </OwlCarousel>
          ) : (
            <div className="col-12 text-center text-muted">No categories found.</div>
          )}
        </div>
      </div>
    </section>

      <section className="fresh-grocery py-5">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-6 col-sm-12 order-2 order-md-1">
            <div className="fresh-box">
              <h6>{freshGrocery.subtitle}</h6>
              <h2>
                {freshGrocery.title?.split(' ')[0]}{" "}
                <span>{freshGrocery.title?.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p>{freshGrocery.description}</p>
              {freshGrocery.playstoreImage && (
                <div className="play-store-btn">
                  <a href="#">
                    <img
                      src={`${API}/uploads/${freshGrocery.playstoreImage}`}
                      alt="Get it on Google Play"
                      className="img-fluid"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 order-1 order-md-2">
            <div className="d-flex justify-content-end">
              {freshGrocery.bannerImage && (
                <img
                  src={`${API}/uploads/${freshGrocery.bannerImage}`}
                  alt="Grocery Banner"
                  className="img-fluid rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>

     <section className="store-sec py-5">
      <div className="container">
        <div className="row">
          {/* Image Section */}
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="store-sec-pic">
              {store.image && (
                <img
                  src={`${API}/uploads/${store.image}`}
                  alt="Store"
                  className="w-100 rounded"
                />
              )}
            </div>
          </div>

          {/* Text & Features */}
          <div className="col-lg-6 col-md-6 col-sm-12 store-sec-box">
            <h2>
              {store.title} <span>{store.subtitle}</span>
            </h2>
            <p>{store.description}</p>

            <div className="row">
              {store.features?.map((feature, index) => (
                <div key={index} className="col-lg-6 col-md-6 col-sm-12 mt-3">
                  <div className="shipping-box d-flex align-items-start">
                    <i className={`fa-solid ${feature.iconClass} fas-icon me-3`} />
                    <div className="shipping-content">
                      <h4 className="mb-0">{feature.heading}</h4>
                      <p className="mb-0">{feature.subtext}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
   <section className="about-team py-5">
      <div className="container">
        <div className="row">
          {/* Text Content */}
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center order-2 order-md-1">
            <div className="about-team-box">
              <h2>
                {teamData.title?.split(' ')[0]} <span>{teamData.title?.split(' ').slice(1).join(' ')}</span>
              </h2>
              <p>{teamData.description}</p>
              {teamData.playstoreImage && (
                <div className="play-store-btn">
                  <a href="#">
                    <img
                      src={`${API}/uploads/${teamData.playstoreImage}`}
                      alt="Google Play"
                      className="img-fluid"
                    />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Image Content */}
          <div className="col-lg-6 col-md-6 col-sm-12 order-1 order-md-2">
            <div>
              {teamData.image && (
                <img
                  src={`${API}/uploads/${teamData.image}`}
                  alt="About Team"
                  className="w-100 rounded"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
   <section className="app-intro-sec">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="play-store-banner">
              <img src={`${API}/uploads/${intro.mobileImage}`} alt="Mobile App" className="w-100" />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 d-flex align-items-center">
            <div className="app-content-box">
              <h2>{intro.heading}</h2>
              <p>{intro.description}</p>
              <div className="play-store-btn">
                <a href="">
                  <img src={`${API}/uploads/${intro.playstoreImage}`} alt="Get it on Google Play" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      <section className="faq-sec py-5">
      <div className="container">
        <div className="row">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <div className="faq-sec-pic">
              {/* Display the first image if available */}
              {faqs[0]?.image && (
                <img src={`${API}/uploads/${faqs[0].image}`} alt="FAQ" className="w-100" />
              )}
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12 mt-3">
            <div className="accordion" id="faqAccordion">
              {faqs.map((faq, index) => {
                const headingId = `heading${index}`;
                const collapseId = `faq${index}`;
                return (
                  <div className="accordion-item" key={faq._id}>
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded={index === 0 ? 'true' : 'false'}
                        aria-controls={collapseId}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div
                      id={collapseId}
                      className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                      aria-labelledby={headingId}
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">{faq.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
      {/* <section class="nearest-store">
    <div class="container">
        <div class="row">
            <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="nearest-store-box d-flex">
                    <div class="nearest-store-pic">
                        <img src="assests/images/store.png" alt="">
                    </div>
                <div>
                        <div>
                        <h6>General Store</h6>
                        <h4>Sprouts Farmers Market </h4>
                    </div>
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <p>Bashli Nagar, Chitrakoot, Jaipur, Rajasthan 302021</p>
                        <i class="fa-solid fa-map"></i>
                    </div>
                    <div>
                        <i class="fa-solid fa-person-running"></i>
                        <span>10 KM</span>
                    </div>
                    <div>
                        <a href="" class="btn btn-primary">Shop Now <i class="fa-solid fa-arrow-right"></i></a>
                        <a href="" class="btn btn-primary">Shop Now <i class="fa-solid fa-arrow-right"></i></a>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
        </section> */}
          <section className="testimonal-sec">
      <section className="testimonial-slider py-5">
        <div className="container">
          <h2 className="text-center mb-5">Testimonials</h2>
          <div className="row">
            <div className="col-lg-12">
              <OwlCarousel className="owl-theme" {...options}>
                {testimonials.map((item) => (
                  <div className="testimonial-card" key={item._id}>
                    <img
                      src={`${API}/uploads/${item.image}`}
                      alt={item.name}
                    />
                    <p>“{item.message}”</p>
                    <h6>{item.name}</h6>
                    <small>{item.location}</small>
                  </div>
                ))}
              </OwlCarousel>
            </div>
          </div>
        </div>
      </section>
    </section>
        <section className="footer-sec">
      <div className="container">
        <div className="row">
          {/* Logo and Description */}
          <div className="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div className="footer-btm-img">
              {footer.logo && (
                <img src={`${API}/uploads/${footer.logo}`} alt="Logo" />
              )}
              <p>{footer.description}</p>
            </div>
            <div className="working-time">
              <i className="fa-solid fa-clock" />
              <h4>
                Work Hours: <span>{footer.workHours}</span>
              </h4>
            </div>
            <div className="social-media-follow">
              {(footer.socialLinks || []).map((link, idx) => (
                <a key={idx} href={link} target="_blank" rel="noopener noreferrer">
                  <i className="fa-brands fa-facebook" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div className="footer-contact">
              <h2>Contact Us</h2>
              <ul>
                <li>
                  <i className="fa-solid fa-phone" /> {footer.phone}
                </li>
                <li>
                  <i className="fa-solid fa-location-dot" /> {footer.address}
                </li>
                <li>
                  <i className="fa-solid fa-envelope" /> {footer.email}
                </li>
              </ul>
            </div>
          </div>

          {/* Page Links */}
          <div className="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div className="bottom-link">
              <h2>Links</h2>
              <ul>
                {(footer.pageLinks || []).map((link, idx) => (
                  <li key={idx}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Customer Care Links */}
          <div className="col-lg-3 col-md-6 col-sm-12 mt-2">
            <div className="bottom-link">
              <h2>Customer Care</h2>
              <ul>
                {(footer.customerCareLinks || []).map((link, idx) => (
                  <li key={idx}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
