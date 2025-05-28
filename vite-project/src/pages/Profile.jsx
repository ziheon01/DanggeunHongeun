import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import LocationSelector from '../components/LocationSelector';
import axios from "axios";

function Profile() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    if (!window.confirm("정말 회원 탈퇴하시겠습니까? 되돌릴 수 없습니다.")) return;

    try {
      await axios.delete(`http://localhost:3000/api/users/${user.id}`);
      alert("회원 탈퇴가 완료되었습니다.");
      logout(); // localStorage 초기화
      navigate("/");
    } catch (err) {
      console.error("탈퇴 실패:", err);
      alert("회원 탈퇴 중 오류 발생");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>내 프로필</h2>
      <LocationSelector />

      <button
        onClick={handleDeleteAccount}
        style={{
          marginTop: "30px",
          backgroundColor: "red",
          color: "white",
          padding: "10px",
          border: "none",
          borderRadius: "5px",
          width: "100%",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        회원 탈퇴
      </button>
    </div>
  );
}

export default Profile;
