import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard";
import axios from "axios";

function Home() {
  const { products } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/products/search?q=${query}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error("검색 실패:", err);
      alert("검색 실패!");
    }
  };

  const handleLikeToggle = async (productId) => {
  try {
    const res = await axios.post("http://localhost:3000/api/favorites/toggle", {
      user_id: user.id,
      product_id: productId,
    });
    // ✅ 상태 갱신 필요
    alert(res.data.message); // 또는 setProducts 업데이트 등
  } catch (err) {
    console.error("찜 실패:", err);
    alert("찜 처리 중 오류 발생!");
  }
};

  const displayProducts = searchResults !== null ? searchResults : products;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {user && (
        <p style={{ fontSize: "16px", marginBottom: "20px" }}>
          👋 <strong>{user.username}</strong>님, 환영합니다!
        </p>
      )}

      {/* 🔍 검색창 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="상품명, 지역명, @상점명 입력"
          style={{
            width: "400px",
            padding: "10px 16px",
            border: "2px solid #f28b82", // 연한 빨간색
            borderRadius: "6px",
            fontSize: "16px"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "10px",
            padding: "10px 20px",
            backgroundColor: "#f28b82",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          🔍
        </button>
      </div>

      {/* 🔄 최근 상품 */}
      <h2 style={{ fontSize: "22px", marginBottom: "16px" }}>
        🛍 최근 등록된 중고 상품
      </h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {displayProducts && displayProducts.length > 0 ? (
          displayProducts.map(product => (
            <ProductCard key={product.id} product={product} onLikeToggle={handleLikeToggle} isLiked={product.likedBy?.includes(user?.id)} />
          ))
        ) : (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
