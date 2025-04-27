import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ 
      padding: "10px 0", 
      borderBottom: "2px solid #ccc", 
      marginBottom: "20px", 
      display: "flex", 
      gap: "20px",
      fontWeight: "bold",
      fontSize: "18px"
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "black" }}>
        Home
      </Link>
      <Link to="/products" style={{ textDecoration: "none", color: "black" }}>
        상품 리스트
      </Link>
      <Link to="/upload" style={{ textDecoration: "none", color: "black" }}>
        상품 등록
      </Link>
      <Link to="/favorites" style={{ textDecoration: "none", color: "black" }}>
        관심 상품
      </Link>
    </nav>
  );
}

export default Navbar;
