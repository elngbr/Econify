// src/pages/Footer.jsx
import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <p style={styles.text}>
        © {currentYear} | Elena Eftimie&Codruţ Coculescu | Econify 🚀
        <br />
        Project for WebTech Lab, 2025
      </p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: "#4a148c",
    color: "white",
    textAlign: "center",
    padding: "10px 0",
    position: "relative",
    width: "100%",
  },
  text: {
    margin: 0,
    fontSize: "14px",
  },
};

export default Footer;
