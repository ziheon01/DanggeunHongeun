import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

function ProductList() {
  const { products, favorites, setFavorites } = useContext(ProductContext);
  const { user } = useContext(UserContext);

  const handleLikeToggle = async (productId) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const isLiked = favorites.some(fav => fav.id === productId);

    try {
      if (isLiked) {
        await axios.delete(`http://localhost:3000/api/favorites`, {
          params: { user_id: user.id, product_id: productId }
        });
        alert("찜 취소 완료!");
      } else {
        await axios.post("http://localhost:3000/api/favorites", {
          user_id: user.id,
          product_id: productId
        });
        alert("찜 완료!");
      }
    } catch (err) {
      console.error("찜 요청 실패:", err);
      alert("찜 요청 실패!");
      return;
    }

    try {
      const refresh = await axios.get(`http://localhost:3000/api/favorites?user_id=${user.id}`);
      setFavorites(refresh.data);
    } catch (err) {
      console.error("찜 목록 갱신 실패:", err);
    }
  };

  return (
    <div style={productListStyle}>
      <h2 style={{ fontSize: "20px", marginLeft: "20px", marginBottom: "10px" }}>🔥 요즘 인기 상품</h2>
      <div style={productContainerStyle}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={productCardStyle}>
              <img src={product.image_url} alt={product.title} style={productImageStyle} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>{parseInt(product.price).toLocaleString()}원</p>
              <button style={buttonStyle} onClick={() => handleLikeToggle(product.id)}>
                {favorites.some(fav => fav.id === product.id) ? "찜 취소" : "찜하기"}
              </button>
            </div>
          ))
        ) : (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

// 스타일 객체
const productListStyle = {
  padding: "20px",
};

const productContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "20px",
  justifyContent: "center",  // 화면에 맞게 정렬
  padding: "0 20px",
  boxSizing: "border-box",
};

const productCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "20px",
  textAlign: "center",
  width: "calc(33% - 20px)", // 기본적으로 3개씩 보이게
  boxSizing: "border-box",
  minWidth: "250px", // 최소 너비
};

const productImageStyle = {
  width: "100%",
  height: "auto",
  borderRadius: "8px",
};

const buttonStyle = {
  padding: "10px 20px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer",
};

// 반응형 스타일 (미디어 쿼리 추가)
const mediaStyles = `
  @media (max-width: 768px) {
    .product-card {
      width: 48%;  // 화면 크기가 작으면 한 줄에 2개씩
    }
  }

  @media (max-width: 480px) {
    .product-card {
      width: 100%;  // 화면이 더 작으면 한 줄에 1개씩
    }
  }
`;

export default ProductList;
