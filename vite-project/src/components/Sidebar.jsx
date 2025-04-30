import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";

function Sidebar() {
  const { products } = useContext(ProductContext);
  const { user } = useContext(UserContext);

  // 로그인한 유저의 찜 상품만 필터링
  const liked = user
    ? products.filter((p) => p.likedBy?.includes(user.nickname)) // user.nickname이 likedBy에 있는지 확인
    : [];

  return (
    <div style={{ width: "200px", padding: "10px", background: "#f5f5f5" }}>
      <h3>❤️ 찜한 상품</h3>
      {liked.length > 0 ? (
        liked.map((item) => (
          <div key={item.id} style={{ marginBottom: "10px" }}>
            <p style={{ fontWeight: "bold" }}>{item.title}</p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              {item.price.toLocaleString()}원
            </p>
          </div>
        ))
      ) : (
        <p>찜한 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default Sidebar;
