import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext"; // ProductContext 임포트
import ProductCard from "../components/ProductCard"; // 상품 카드 컴포넌트
import axios from 'axios';

function Home() {
  const { products } = useContext(ProductContext);  // ProductContext에서 products를 가져옴
  const [query, setQuery] = useState(""); // ✅ 검색어 state
  const [searchResults, setSearchResults] = useState(null); // ✅ 검색 결과 state

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

  // 검색 중이면 검색 결과를 보여주고, 아니면 원래 products 보여줌
  const displayProducts = searchResults !== null ? searchResults : products;
  
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* 검색창 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <input
          type="text"
          value={query}   // ✅ 상태 바인딩
          onChange={(e) => setQuery(e.target.value)}  // ✅ onChange 연결
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

      {/* 추천 상품 타이틀 */}
      <h2 style={{ fontSize: "20px", marginLeft: "20px", marginBottom: "10px" }}>🔥 요즘 인기 상품</h2>

      {/* 상품 리스트 */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", padding: "0 20px" }}>
        {displayProducts && displayProducts.length > 0 ? (
          displayProducts.map(product => 
            <ProductCard key={product.id} product={product} />)
        ) : (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default Home;
