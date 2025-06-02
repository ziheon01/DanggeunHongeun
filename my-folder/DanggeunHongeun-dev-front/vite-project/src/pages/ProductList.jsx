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
      <h2 style={{ fontSize: "20px", marginLeft: "20px", marginBottom: "10px" }}>🔥 등록된 상품 리스트</h2>
      <div style={productContainerStyle}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={productCardStyle}>
              <img
                src={
                  product.image_url
                    ? product.image_url
                    : `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.title)}`
                }
                alt={product.title}
                style={productImageStyle}
              />
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

const productListStyle = { padding: '20px' };
const productContainerStyle = { display: 'flex', gap: '20px', flexWrap: 'wrap' };
const productCardStyle = { border: '1px solid #ddd', borderRadius: '10px', padding: '20px', width: '300px', textAlign: 'center' };
const productImageStyle = { width: '100%', height: 'auto', borderRadius: '8px' };
const buttonStyle = { padding: "10px", backgroundColor: "green", color: "white", border: "none", borderRadius: "4px", fontSize: "16px", cursor: "pointer" };

export default ProductList;
