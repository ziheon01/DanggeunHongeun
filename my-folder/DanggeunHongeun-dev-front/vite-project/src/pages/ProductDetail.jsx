import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { UserContext } from "../contexts/UserContext";

// 생략된 import 등은 기존과 동일

function ProductDetail() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error("상품 상세 조회 실패:", err));

    axios.get(`http://localhost:3000/api/products`)
      .then(res => setAllProducts(res.data))
      .catch(err => console.error("상품 목록 불러오기 실패:", err));
  }, [id]);

  const handleLike = () => {
    alert("찜 기능은 아직 구현되지 않았습니다!");
  };

  if (!product) return <p>로딩 중...</p>;

  const sellerProducts = allProducts.filter(
    p =>
      p.user_id === product.user_id &&
      p.user_id !== user?.id &&
      p.id !== parseInt(id)
  );

  const exploreProducts = allProducts.filter(
    p =>
      p.id !== parseInt(id) &&
      (p.user_id !== product.user_id || p.user_id === user?.id)
  );

  return (
    <div style={{ width: "100%", padding: "40px", boxSizing: "border-box" }}>

      <h3>상품 설명</h3>
      <div style={{ display: "flex", gap: "30px", marginBottom: "40px" }}>
        {/* 왼쪽: 이미지 */}
        <div style={{ flex: "1" }}>
          <img
            src={
              product.image_url
                ? product.image_url.startsWith("http")
                  ? product.image_url
                  : `http://localhost:3000${product.image_url}`
                : `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.title)}`
            }
            alt={product.title}
            style={{ width: "100%", borderRadius: "12px" }}
          />
        </div>

        {/* 오른쪽: 설명 */}
        <div style={{ flex: "1" }}>
          <h2 style={{ fontSize: "24px" }}>{product.title}</h2>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            {parseInt(product.price).toLocaleString()}원
          </p>
          <p style={{ fontSize: "14px", color: "#666" }}>
            {product.location_id ? `지역 ID: ${product.location_id}` : "위치 정보 없음"}
          </p>
          <p style={{ marginTop: "20px" }}>{product.description}</p>
          <button
            onClick={handleLike}
            style={{
              marginTop: "20px",
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
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>
        판매자: &nbsp;
        <Link
          to={`/seller/${product.sellerName}`}
          style={{ color: "blue", textDecoration: "underline" }}
        >
          {product.sellerName}
        </Link>
      </h3>

      <hr style={{ margin: "30px 0" }} />

      <h3>📦 판매자의 다른 상품</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {sellerProducts.length > 0 ? (
          sellerProducts.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>판매자의 다른 상품이 없습니다.</p>
        )}
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>👀 다른 상품도 둘러보세요</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {exploreProducts.length > 0 ? (
          exploreProducts.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <p>추천할 다른 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
