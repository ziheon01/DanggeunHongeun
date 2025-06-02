import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard";
import axios from 'axios';

function Home() {
  const { products } = useContext(ProductContext);
  const { user } = useContext(UserContext);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    console.log("✅ 검색 버튼 클릭됨! query:", query);
    try {
      const res = await axios.get(`http://localhost:3000/api/products/search?q=${query}`);
      console.log("✅ 검색 API 응답:", res.data);
      setSearchResults(res.data);
    } catch (err) {
      console.error("검색 실패:", err);
      alert("검색 실패!");
    }
  };

  const displayProducts = searchResults !== null ? searchResults : products;

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* ✅ 로그인 유저 환영 메시지 */}
      {user && (
        <p style={{ marginLeft: "20px", fontSize: "16px" }}>
          👋 {user.username}님, 환영합니다!
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
            padding: "12px 20px",
            border: "2px solid red",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: "8px",
            padding: "12px 20px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          🔍
        </button>
      </div>

      {/* 🔄 타이틀 문구 */}
      <h2 style={{ fontSize: "20px", marginLeft: "20px", marginBottom: "10px" }}>
        🛍 최근 등록된 중고 상품
      </h2>

      {/* 상품 리스트 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "0 20px" }}>
        {displayProducts && displayProducts.length > 0 ? (
          displayProducts
            .map(product => ({
              ...product,
              likedBy: Array.isArray(product.likedBy) ? product.likedBy : []
            }))
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))
        ) : (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
