import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";

function ProductCard({ product }) {
  const { products, setProducts } = useContext(ProductContext);

  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      const updatedProducts = products.filter(p => p.id !== product.id);
      setProducts(updatedProducts);
    }
  };

  const handleLike = (e) => {
    e.stopPropagation(); // 링크 이동 막기
    const updatedProducts = products.map(p =>
      p.id === product.id ? { ...p, liked: !p.liked } : p
    );
    setProducts(updatedProducts);
  };

  return (
    <div style={{ 
      border: "1px solid #eee", 
      padding: "20px", 
      margin: "10px", 
      width: "220px",
      borderRadius: "12px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      position: "relative",
      transition: "transform 0.2s",
    }}>
      
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>{product.title}</h2>
        <p style={{ marginBottom: "5px" }}>{product.price.toLocaleString()}원</p>
        <p style={{ fontSize: "12px", color: "#555" }}>{product.description}</p>
      </Link>

      {/* 삭제 버튼 */}
      <button 
        onClick={handleDelete}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          borderRadius: "4px",
          padding: "5px 8px",
          cursor: "pointer",
          fontSize: "12px"
        }}
      >
        삭제
      </button>

      {/* 찜하기 버튼 */}
      <button 
        onClick={handleLike}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          color: product.liked ? "red" : "gray"
        }}
      >
        {product.liked ? "❤️" : "🤍"}
      </button>

    </div>
  );
}

export default ProductCard;
