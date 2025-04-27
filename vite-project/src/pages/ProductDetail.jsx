import { useParams } from "react-router-dom";
import { useContext } from "react";
import { ProductContext } from "../contexts/ProductContext";

function ProductDetail() {
  const { id } = useParams();
  const { products } = useContext(ProductContext);

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <div>상품을 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>{product.title}</h1>
      <p><strong>가격:</strong> {product.price.toLocaleString()}원</p>
      <p><strong>설명:</strong> {product.description}</p>
    </div>
  );
}

export default ProductDetail;
