import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard";

function Favorites() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]); // ✅ 초기값 [] 설정

  console.log("현재 user:", user);
  console.log("현재 favorites:", favorites);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:3000/api/favorites/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("서버 응답:", data);
          setFavorites(data);
        })
        .catch(err => {
          console.error("에러 발생:", err);
        });
    }
  }, [user]);

  if (!user) {
    return <p style={{ textAlign: "center" }}>로그인 후 이용해주세요.</p>;
  }

  return (
    <div>
      <h1>❤️ 찜한 상품</h1>
      {favorites && favorites.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {favorites.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p style={{ textAlign: "center" }}>찜한 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default Favorites;
