import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";

function ProductUpload() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // ✅ 이미지 상태 추가
  const locationOptions = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "제주"];

  useEffect(() => {
    if (!user) {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !description || !location || !image) {
      alert("모든 항목을 입력해주세요. (이미지 포함)");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("price", parseInt(price));
    formData.append("description", description);
    formData.append("location", location);
    formData.append("image", image);
    formData.append("category_id", 1); // 예시
    formData.append("user_id", user.id);
    formData.append("status_id", 1);

    try {
      await axios.post("http://localhost:3000/api/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("상품 등록 성공!");
      navigate("/products");
    } catch (err) {
      console.error("상품 등록 실패:", err);
      alert("상품 등록 실패!");
    }
  };

  return (
    <div style={{ width: "100%", padding: "40px", boxSizing: "border-box" }}>
      <h2>상품 등록</h2>
      <form onSubmit={handleSubmit}>
        <label>제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
        <label>가격</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={inputStyle} />
        <label>설명</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} style={{ ...inputStyle, height: "100px" }} />
        <label>지역</label>
        <select value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle}>
          <option value="">-- 지역 선택 --</option>
          {locationOptions.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <label>상품 이미지</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={inputStyle} />
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
