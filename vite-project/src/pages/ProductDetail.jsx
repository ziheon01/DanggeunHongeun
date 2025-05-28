import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);

  useEffect(() => {
    // ✅ 상품 상세 정보 불러오기
    axios.get(`http://localhost:3000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("상품 상세 조회 실패:", err));

    // ✅ 다른 상품 목록 불러오기
    axios.get(`http://localhost:3000/api/products`)
      .then(res => {
        const others = res.data.filter(p => p.id !== parseInt(id));
        setOtherProducts(others);
      })
      .catch(err => console.error("다른 상품 불러오기 실패:", err));
  }, [id]);

  const handleLike = () => {
    alert("찜 기능은 아직 구현되지 않았습니다!");
  };

  if (!product) return <p>로딩 중...</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src={product.image_url || "https://via.placeholder.com/400x300?text=상품이미지"}
          alt={product.title}
          style={{ width: "100%", borderRadius: "12px" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px" }}>{product.title}</h1>
        <button
          onClick={handleLike}
          style={{
            fontSize: "24px",
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "gray"
          }}
        >
          🤍
        </button>
      </div>

      <p style={{ fontSize: "18px", fontWeight: "bold" }}>
        {parseInt(product.price).toLocaleString()}원
      </p>
      <p style={{ fontSize: "14px", color: "#666" }}>
        {product.location_id ? `지역 ID: ${product.location_id}` : "위치 정보 없음"}
      </p>

      <hr style={{ margin: "30px 0" }} />

      <h3>상품 설명</h3>
      <p>{product.description}</p>

      <hr style={{ margin: "30px 0" }} />

      <h3>
        판매자 ID:{" 홍근 당근 "}
        <Link
          to={`/seller/${product.sellerName}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {product.sellerName}
        </Link>
      </h3>

      <hr style={{ margin: "30px 0" }} />

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
