import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

function AdminApproval() {
  const { user } = useContext(UserContext); // ✅ 현재 로그인된 유저 정보 가져오기
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    if (user === null) return;

    if (!user.is_admin) {
      alert("관리자만 접근 가능합니다.");
      navigate("/");
      return;
    }
    fetchPendingUsers();
  }, [user]);

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pending-users");
      setPendingUsers(res.data);
    } catch (err) {
      console.error("승인 대기 사용자 조회 실패:", err);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/api/approve-user/${userId}`);
      alert("사용자 승인 완료!");
      fetchPendingUsers(); // 목록 새로고침
    } catch (err) {
      console.error("사용자 승인 실패:", err);
      alert("승인 실패!");
    }
  };

  const handleReject = async (userId) => {
  try {
    await axios.delete(`http://localhost:3000/api/reject-user/${userId}`);
    alert("사용자 삭제 완료!");
    fetchPendingUsers();
  } catch (err) {
    console.error("사용자 삭제 실패:", err);
    alert("삭제 실패!");
  }
};

  
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>관리자 승인 대기 목록</h2>
      {pendingUsers.length === 0 ? (
        <p>승인 대기 중인 사용자가 없습니다.</p>
      ) : (
        pendingUsers.map((user) => (
          <div key={user.id} style={cardStyle}>
            <img
              src={`http://localhost:3000${user.proof_url}`}
              alt="합격증"
              style={{ width: "150px", borderRadius: "8px", marginRight: "20px" }}
            />
            <div style={{ flex: 1 }}>
              <p><strong>닉네임:</strong> {user.username}</p>
              <p><strong>이메일:</strong> {user.email}</p>
              <p><strong>가입일:</strong> {new Date(user.created_at).toLocaleString()}</p>
              <button style={buttonStyle} onClick={() => handleApprove(user.id)}>
                승인
              </button>
              <button style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px' }} onClick={() => handleReject(user.id)}>
                거절
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const cardStyle = {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "20px",
  background: "#fff"
};

const buttonStyle = {
  padding: "8px 16px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

export default AdminApproval;
