// 📄 vite-project/src/pages/MyPosts.jsx

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard";

const MyPosts = () => {
  const { user } = useContext(UserContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return;

    console.log("요청 보낼 userId:", user.id);
    axios
      .get(`/api/products/mine?userId=${user.id}`)
      .then((res) => {
        console.log("📦 내 상품 목록:", res.data);
        setProducts(res.data);
      })
      .catch((err) => console.error("내 게시글 로딩 실패:", err));
  }, [user]);

  return (
    <div>
      <h2>내가 등록한 상품</h2>
      {products.length === 0 ? (
        <p>등록한 상품이 없습니다.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
