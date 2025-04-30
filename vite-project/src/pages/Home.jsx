import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext"; // ProductContext 임포트
import ProductCard from "../components/ProductCard"; // 상품 카드 컴포넌트

function Home() {
  const { products } = useContext(ProductContext);  // ProductContext에서 products를 가져옴

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* 검색창 */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
        <input
          type="text"
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
        {products && products.length > 0 ? (
          products.map((product) => (
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
