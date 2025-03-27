const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">MyCookBook</div>
        <div className="footer-links">
          <Link to="/about" className="footer-link">À propos</Link>
          <Link to="/contact" className="footer-link">Contact</Link>
          <Link to="/terms" className="footer-link">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}; 