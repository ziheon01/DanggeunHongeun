import { useContext, useState, useEffect } from "react";
import { UserContext } from "../contexts/UserContext";

function Sidebar() {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user || !user.id) return; 
      fetch(`http://localhost:3000/api/favorites/${user.id}`)
        .then(res => res.json())
        .then(data => {
          console.log("사이드바 API 응답:", data);
          setFavorites(data);
        })
        .catch(err => console.error("사이드바 에러:", err));
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: "10px" }}>
        <h3>❤️ 찜한 상품</h3>
        <p>로그인 후 이용해주세요.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "10px", background: "#fff", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>❤️ 찜한 상품</h3>
      {favorites.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {favorites.map(product => (
            <li key={product.id}>
              <p style={{ margin: 0 }}>{product.title}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>찜한 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default Sidebar;
