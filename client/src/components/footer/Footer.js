import React, { useContext } from "react";
import Button from "../headers/Button";
import "./Footer.css";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";

const Footer = () => {
  const state = useContext(GlobalState);
  const [isLogged] = state.userAPI.isLogged;
  return (
    <div className="footer-container">
      <section className="footer-subscription">
        {!isLogged ? (
          <>
            <p className="footer-subscription-heading">
              Join to the world of tasty fast food now!
            </p>
            <p className="footer-subscription-text">
              You can subscribe at anytime.
            </p>
          </>
        ) : (
          <>
            <p className="footer-subscription-heading">
              Welcome you to the world of tasty fast food!
            </p>
            <p className="footer-subscription-text">
              Enjoying every single delicious dishes.
            </p>
          </>
        )}
        {!isLogged && (
          <div>
            <form style={{ position: "relative" }}>
              <input
                className="footer-input"
                type="email"
                name="email"
                placeholder="Please enter your email"
              ></input>
              <Button buttonStyle="btn--outline">Subscribe</Button>
            </form>
          </div>
        )}
      </section>
      <div className="footer-links">
        <div className="footer-link-wrapper">
          <div className="footer-link-items">
            <h2>About Us</h2>
            <Link to="">How it works</Link>
            <Link to="/">Testimonials</Link>
            <Link to="/">Careers</Link>
          </div>
          <div class="footer-link-items">
            <h2>Contact Us</h2>
            <Link to="/">Contact</Link>
            <Link to="/">Support</Link>
          </div>
          <div class="footer-link-items">
            <h2>Videos</h2>
            <Link to="/">Submit Video</Link>
            <Link to="/">Agency</Link>
            <Link to="/">Influencer</Link>
          </div>
          <div class="footer-link-items">
            <h2>Social Media</h2>
            <Link to="/">Instagram</Link>
            <Link to="/">Facebook</Link>
            <Link to="/">Youtube</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="footer-logo">
            <Link to="/" className="social-logo">
              MAMMAM <i className="fab fa-typo3"></i>
            </Link>
          </div>
          <small className="website-rights">MAMMAM &copy; 2021 </small>
          <div className="social-icons">
            <Link
              className="social-icon-link facebook"
              to="/"
              target="_blank"
              arial-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link
              className="social-icon-link instagram"
              to="/"
              target="_blank"
              arial-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </Link>
            <Link
              class="social-icon-link youtube"
              to="/"
              target="_blank"
              aria-label="Youtube"
            >
              <i class="fab fa-youtube" />
            </Link>
            <Link
              class="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i class="fab fa-twitter" />
            </Link>
            <Link
              class="social-icon-link linkedin"
              to="/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Footer;
