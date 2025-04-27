import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";

function Favorites() {
  const { products } = useContext(ProductContext);

  const likedProducts = products.filter(product => product.liked);

  return (
    <div>
      <h1>관심 상품 페이지</h1>

      {likedProducts.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
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
