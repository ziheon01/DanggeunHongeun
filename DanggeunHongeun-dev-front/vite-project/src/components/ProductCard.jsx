import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";

function ProductCard({ product }) {
  const { products, setProducts } = useContext(ProductContext);
  const { user } = useContext(UserContext);

  const isLiked = user && product.likedBy?.includes(user.nickname);

  const handleLike = async () => {
    if (!user) {
      alert("로그인 후 이용해주세요!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/favorites", {
        user_id: user.id,
        product_id: product.id
      });
      alert("찜 완료!");

      // ✅ 업데이트 로직 여기로 이동!
      const updatedProducts = products.map((p) =>
        p.id === product.id
          ? {
              ...p,
              likedBy: (p.likedBy || []).includes(user.nickname)
                ? p.likedBy.filter((name) => name !== user.nickname)
                : [...p.likedBy, user.nickname]
            }
          : p
      );
      setProducts(updatedProducts);

    } catch (err) {
      console.error("찜 실패:", err);
      alert("찜 실패!");
    }
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
          src={product.imageUrl}
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
        {isLiked ? "❤️" : "🤍"}
      </button>
    </div>
  );
}

export default ProductCard;
