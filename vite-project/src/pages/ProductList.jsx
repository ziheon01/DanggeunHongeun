import { useContext, useState } from "react";
import { ProductContext } from "../contexts/ProductContext";
import ProductCard from "../components/ProductCard";

function ProductList() {
  const { products } = useContext(ProductContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>상품 리스트 페이지</h1>

      <input 
        type="text" 
        placeholder="상품 검색..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px"
        }}
      />

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ProductList;
