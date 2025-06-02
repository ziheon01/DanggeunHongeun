// ✅ ProductCard.jsx
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

function ProductCard({ product, onLikeToggle, isLiked }) {
  const { user } = useContext(UserContext);

  const handleLike = () => {
    if (!user) {
      alert("로그인 후 이용해주세요!");
      return;
    }
    onLikeToggle?.(product.id);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "15px",
        width: "240px",
        position: "relative",
        background: "#fff"
      }}
    >
      <Link to={`/products/${product.id}`} style={{ textDecoration: "none", color: "black" }}>
        <img
          src={
            product.image_url
              ? product.image_url
              : `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.title)}`
          }
          alt={product.title}
          style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "8px" }}
        />
        <h3>{product.title}</h3>
        <p>{parseInt(product.price).toLocaleString()}원</p>
        <p style={{ fontSize: "12px", color: "#666" }}>{product.description}</p>
      </Link>
      <button
        onClick={handleLike}
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          fontSize: "20px",
          background: "none",
          border: "none",
          color: isLiked ? "red" : "gray",
          cursor: "pointer"
        }}
      >
        {isLiked ? "❤️" : "🦁"}
      </button>
    </div>
  );
}

export default ProductCard;