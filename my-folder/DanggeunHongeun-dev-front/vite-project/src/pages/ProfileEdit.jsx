import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import axios from "axios";

function ProfileEdit() {
  const { user, login } = useContext(UserContext);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [location, setLocation] = useState(user?.location || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:3000/api/update-profile/${user.id}`, {
        username,
        email,
        location
      });

      alert("프로필 수정 완료!");
      // 업데이트된 정보를 다시 login 함수로 저장
      login(user.id, username, user.is_admin, email, location);
    } catch (err) {
      console.error("수정 실패:", err);
      alert("수정 중 오류 발생");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>프로필 수정</h2>
      <form onSubmit={handleSubmit}>
        <label>닉네임</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />
        <label>이메일</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
        <label>지역</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" style={buttonStyle}>수정하기</button>
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
  backgroundColor: "blue",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontSize: "16px",
  cursor: "pointer"
};

export default ProfileEdit;
