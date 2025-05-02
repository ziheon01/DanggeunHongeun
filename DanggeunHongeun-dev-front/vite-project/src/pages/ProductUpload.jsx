import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ axios 추가
import { UserContext } from "../contexts/UserContext";

function ProductUpload() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  // 로그인 상태 없으면 로그인 페이지로 이동
  useEffect(() => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/products", {
        title,
        description,
        price: parseInt(price),
        image_url: "https://via.placeholder.com/400x300?text=상품", // 이미지 기본값
        category_id: 1,  // 예시 카테고리 id
        user_id: user.id, // 로그인된 사용자 id
        location_id: 1,   // 예시 location id
        status_id: 1      // 기본 상태: 판매중
      });

      alert("상품 등록 성공!");
      navigate("/products");
    } catch (err) {
      console.error("상품 등록 실패:", err);
      alert("상품 등록 실패!");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit}>
        <label>제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={inputStyle}
        />

        <label>가격</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={inputStyle}
        />

        <label>설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, height: "100px" }}
        />

        <button type="submit" style={buttonStyle}>등록하기</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  fontSize: "16px",
  borderRadius: "4px",
  border: "1px solid #ccc"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer"
};

export default ProductUpload;
