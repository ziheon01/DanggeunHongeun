import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import { UserContext } from "../contexts/UserContext";
import ProductCard from "../components/ProductCard";

function Favorites() {
  const { products } = useContext(ProductContext);
  const { user } = useContext(UserContext);

  if (!user) {
    return <p style={{ textAlign: "center" }}>로그인 후 이용해주세요.</p>;
  }

  // 로그인한 유저의 찜 상품만 필터링
  const likedProducts = products.filter(product =>
    product.likedBy?.includes(user.nickname)  // user.nickname이 likedBy에 있는지 확인
  );

  return (
    <div>
      <h1>관심 상품</h1>
      {likedProducts.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {likedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p>찜한 상품이 없습니다.</p>
      )}
    </div>
  );
}

export default Favorites;
