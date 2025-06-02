import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // ✅ nickname → username
  const [proof, setProof] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username || !proof) {
      alert("모든 항목을 입력해주세요. (합격증 포함)");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username); // ✅ 동일하게 유지
    formData.append("proof", proof);

    try {
      const response = await axios.post('http://localhost:3000/api/register', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("회원가입 중 오류 발생");
      }
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <label>이메일</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
        <label>비밀번호</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
        <label>닉네임</label> {/* ✅ 출력은 그대로 닉네임으로 유지 */}
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} style={inputStyle} />
        <label>합격증 파일</label>
        <input type="file" accept="image/*,.pdf" onChange={(e) => setProof(e.target.files[0])} style={inputStyle} />
        <button type="submit" style={buttonStyle}>회원가입</button>
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
  padding: "10px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer"
};

export default Register;
