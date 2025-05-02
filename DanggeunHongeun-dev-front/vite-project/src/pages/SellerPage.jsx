import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";

function ProductDetail() {
  const { id } = useParams();
  const { products, setProducts } = useContext(ProductContext);

  const product = products.find(p => p.id === parseInt(id));
  const otherProducts = products.filter(p => p.id !== parseInt(id));

  if (!product) {
    return <p>상품을 찾을 수 없습니다.</p>;
  }

  const handleLike = () => {
    const updated = products.map(p =>
      p.id === product.id ? { ...p, liked: !p.liked } : p
    );
    setProducts(updated);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* 이미지 */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={product.imageUrl || "https://via.placeholder.com/400x300?text=상품이미지"}
          alt={product.title}
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </div>

      {/* 제목 + 찜 버튼 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px" }}>{product.title}</h1>
        <button
          onClick={handleLike}
          style={{
            fontSize: "24px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: product.liked ? "red" : "gray"
          }}
        >
          {product.liked ? "❤️" : "🤍"}
        </button>
      </div>

      {/* 가격, 지역, 날짜 */}
      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {product.price.toLocaleString()}원
      </p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        {product.location || "위치 정보 없음"} • {product.date || "등록일 없음"}
      </p>

      <hr style={{ margin: "30px 0" }} />

      {/* 설명 */}
      <h3>상품 설명</h3>
      <p>{product.description}</p>

      <hr style={{ margin: "30px 0" }} />

      {/* 판매자 정보 */}
      <h3>판매자: {product.sellerName || "홍길동"}</h3>
      <p>찜 {product.likes || 0}개 • 등록상품 3개</p>

      <hr style={{ margin: "30px 0" }} />

      {/* 다른 상품 */}
      <h3>👀 다른 상품도 둘러보세요</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {otherProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductDetail;
