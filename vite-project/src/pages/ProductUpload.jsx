import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ProductContext } from "../contexts/ProductContext";

function ProductUpload() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const { products, setProducts } = useContext(ProductContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !price || !description) {
      alert("모든 항목을 입력해주세요!");
      return;
    }

    const newProduct = {
      id: products.length + 1,
      title,
      price: Number(price),
      description,
    };

    setProducts([...products, newProduct]);
    alert("상품이 등록되었습니다!");
    navigate("/products");
  };

  return (
    <div>
      <h1>상품 등록 페이지</h1>
      <form 
        onSubmit={handleSubmit} 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '300px', 
          gap: '10px' 
        }}
      >
        <input 
          type="text" 
          placeholder="상품명" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input 
          type="number" 
          placeholder="가격" 
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <textarea 
          placeholder="상품 설명" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button 
          type="submit"
          style={{
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          등록하기
        </button>
      </form>
    </div>
  );
}

export default ProductUpload;
