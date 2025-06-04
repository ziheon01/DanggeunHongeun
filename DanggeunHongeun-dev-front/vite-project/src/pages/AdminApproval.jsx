import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import web3Service from "../utils/web3";

function AdminApproval() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [adminAddress, setAdminAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState({});
  const [userStatus, setUserStatus] = useState({}); // 🆕 사용자별 블록체인 상태

  useEffect(() => {
    if (user === null) return;

    if (!user.is_admin) {
      alert("관리자만 접근 가능합니다.");
      navigate("/");
      return;
    }
    
    fetchPendingUsers();
    checkAdminWallet();
  }, [user]);

  const checkAdminWallet = async () => {
    try {
      const result = await web3Service.connectWallet();
      if (result.success) {
        setAdminAddress(result.account);
        setIsWalletConnected(true);
        
        const isAdmin = await web3Service.isAdmin(result.account);
        if (!isAdmin) {
          alert("⚠️ 현재 지갑은 블록체인 관리자가 아닙니다.\n컨트랙트 소유자에게 관리자 권한을 요청하세요.");
        }
      }
    } catch (error) {
      console.error("지갑 연결 실패:", error);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/pending-users");
      setPendingUsers(res.data);
      
      // 🆕 각 사용자의 블록체인 상태 확인
      if (isWalletConnected) {
        checkUsersBlockchainStatus(res.data);
      }
    } catch (err) {
      console.error("승인 대기 사용자 조회 실패:", err);
    }
  };

  // 🆕 사용자들의 블록체인 등록 상태 확인
  const checkUsersBlockchainStatus = async (users) => {
    const statusMap = {};
    
    for (const user of users) {
      if (user.wallet_address && web3Service.contract) {
        try {
          const studentInfo = await web3Service.contract.methods
            .students(user.wallet_address)
            .call();
          
          statusMap[user.id] = {
            isRegistered: studentInfo.email && studentInfo.email.length > 0,
            isVerified: studentInfo.isVerified
          };
        } catch (error) {
          console.error(`사용자 ${user.id} 상태 확인 실패:`, error);
          statusMap[user.id] = { isRegistered: false, isVerified: false };
        }
      }
    }
    
    setUserStatus(statusMap);
  };

  // AdminApproval.js의 handleRegisterOnBlockchain 함수 수정

// 🆕 블록체인에 사용자 등록
const handleRegisterOnBlockchain = async (userId, userInfo) => {
  setIsProcessing(prev => ({ ...prev, [`register_${userId}`]: true }));

  try {
    console.log("블록체인에 사용자 등록 중...");
    
    const result = await web3Service.registerStudent(
      userInfo.wallet_address,
      userInfo.email,
      userInfo.username,
      userInfo.university
    );

    alert(`✅ 블록체인 등록 완료!\n\n` +
          `🔗 트랜잭션 해시: ${result.txHash.slice(0, 10)}...\n\n` +
          `이제 승인 버튼을 클릭할 수 있습니다.`);

    // 🔧 상태 새로고침 강화
    console.log("상태 새로고침 중...");
    
    // 1. 개별 사용자 상태 즉시 업데이트
    setUserStatus(prev => ({
      ...prev,
      [userId]: {
        isRegistered: true,
        isVerified: false
      }
    }));

    // 2. 블록체인에서 실제 상태 재확인 (1초 후)
    setTimeout(async () => {
      try {
        if (web3Service.contract) {
          const studentInfo = await web3Service.contract.methods
            .students(userInfo.wallet_address)
            .call();
          
          console.log("등록 후 블록체인 상태:", {
            email: studentInfo.email,
            isVerified: studentInfo.isVerified
          });

          setUserStatus(prev => ({
            ...prev,
            [userId]: {
              isRegistered: studentInfo.email && studentInfo.email.length > 0,
              isVerified: studentInfo.isVerified
            }
          }));
        }
      } catch (refreshError) {
        console.error("상태 새로고침 실패:", refreshError);
      }
    }, 1000);

    // 3. 전체 목록도 새로고침
    setTimeout(() => {
      fetchPendingUsers();
    }, 2000);
    
  } catch (err) {
    console.error("블록체인 등록 실패:", err);
    alert("블록체인 등록 실패: " + err.message);
  } finally {
    setIsProcessing(prev => ({ ...prev, [`register_${userId}`]: false }));
  }
};

  // 🆕 블록체인 승인 (등록된 사용자만)
  const handleApproveOnBlockchain = async (userId, userInfo) => {
    setIsProcessing(prev => ({ ...prev, [`approve_${userId}`]: true }));

    try {
      // 1️⃣ DB 승인
      console.log("DB 승인 처리 중...");
      await axios.patch(`http://localhost:3000/api/approve-user/${userId}`);
      
      // 2️⃣ 블록체인 승인
      console.log("블록체인 승인 처리 중...");
      const verificationResult = await web3Service.verifyStudent(userInfo.wallet_address);
      
      // 3️⃣ DB 블록체인 정보 업데이트
      await axios.patch(`http://localhost:3000/api/update-blockchain-info/${userId}`, {
        blockchain_verified: true,
        verification_tx_hash: verificationResult.txHash
      });

      alert(`✅ 승인 완료!\n\n` +
            `🔗 승인 트랜잭션: ${verificationResult.txHash.slice(0, 10)}...\n\n` +
            `Celo Explorer에서 확인:\n` +
            `https://explorer.celo.org/alfajores/tx/${verificationResult.txHash}`);
      
      fetchPendingUsers();
      
    } catch (err) {
      console.error("승인 처리 실패:", err);
      alert("승인 처리 실패: " + err.message);
    } finally {
      setIsProcessing(prev => ({ ...prev, [`approve_${userId}`]: false }));
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

  // 🆕 사용자 상태에 따른 버튼 렌더링
  const renderActionButtons = (pendingUser) => {
    const status = userStatus[pendingUser.id] || { isRegistered: false, isVerified: false };
    const registerProcessing = isProcessing[`register_${pendingUser.id}`];
    const approveProcessing = isProcessing[`approve_${pendingUser.id}`];

    return (
      <div style={{ marginTop: '15px' }}>
        {/* 블록체인 상태 표시 */}
        <div style={{ marginBottom: '10px', fontSize: '12px' }}>
          <span style={{ 
            color: status.isRegistered ? 'green' : 'orange',
            fontWeight: 'bold'
          }}>
            📍 블록체인 등록: {status.isRegistered ? '✅ 완료' : '❌ 필요'}
          </span>
          {status.isRegistered && (
            <span style={{ 
              color: status.isVerified ? 'green' : 'blue',
              fontWeight: 'bold',
              marginLeft: '10px'
            }}>
              🔐 승인: {status.isVerified ? '✅ 완료' : '⏳ 대기'}
            </span>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div>
          {!status.isRegistered ? (
            // 등록되지 않은 경우: 등록 버튼만
            <>
              <button 
                style={{
                  ...buttonStyle,
                  backgroundColor: registerProcessing ? '#ccc' : '#007bff',
                  cursor: registerProcessing ? 'not-allowed' : 'pointer'
                }} 
                onClick={() => handleRegisterOnBlockchain(pendingUser.id, pendingUser)}
                disabled={registerProcessing || !isWalletConnected}
              >
                {registerProcessing ? '등록 중...' : '📝 블록체인 등록'}
              </button>
              <button 
                style={{ ...buttonStyle, backgroundColor: '#6c757d', marginLeft: '10px' }} 
                disabled
              >
                🔗 승인 (등록 필요)
              </button>
            </>
          ) : !status.isVerified ? (
            // 등록됐지만 승인 안된 경우: 승인 버튼 활성화
            <>
              <button 
                style={{ ...buttonStyle, backgroundColor: '#28a745', opacity: 0.5 }} 
                disabled
              >
                ✅ 등록 완료
              </button>
              <button 
                style={{
                  ...buttonStyle,
                  backgroundColor: approveProcessing ? '#ccc' : 'green',
                  marginLeft: '10px',
                  cursor: approveProcessing ? 'not-allowed' : 'pointer'
                }} 
                onClick={() => handleApproveOnBlockchain(pendingUser.id, pendingUser)}
                disabled={approveProcessing || !isWalletConnected}
              >
                {approveProcessing ? '승인 중...' : '🔗 블록체인 승인'}
              </button>
            </>
          ) : (
            // 모든 과정 완료
            <button 
              style={{ ...buttonStyle, backgroundColor: '#28a745', opacity: 0.7 }} 
              disabled
            >
              ✅ 모든 과정 완료
            </button>
          )}

          {/* 거절 버튼 */}
          <button 
            style={{ ...buttonStyle, backgroundColor: 'red', marginLeft: '10px' }} 
            onClick={() => handleReject(pendingUser.id)}
            disabled={registerProcessing || approveProcessing}
          >
            거절
          </button>
        </div>
      </div>
    );
  };

  const refreshBlockchainStatus = async () => {
  if (!isWalletConnected || pendingUsers.length === 0) {
    alert("지갑을 먼저 연결하고 사용자가 있는지 확인하세요.");
    return;
  }

  console.log("모든 사용자 상태 수동 새로고침 중...");
  await checkUsersBlockchainStatus(pendingUsers);
  alert("✅ 블록체인 상태를 새로고침했습니다!");
};



  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>🏛️ 관리자 승인 대기 목록</h2>
      
     // 기존 관리자 지갑 상태 섹션을 이것으로 교체
<div style={walletStatusStyle}>
  <h3>🦊 관리자 지갑 상태</h3>
  {isWalletConnected ? (
    <div style={connectedStyle}>
      <p>✅ 지갑 연결됨: {adminAddress.slice(0, 6)}...{adminAddress.slice(-4)}</p>
      <p style={{ fontSize: '12px', color: '#666' }}>
        블록체인 등록 및 승인 기능을 사용할 수 있습니다.
      </p>
      {/* 🆕 수동 새로고침 버튼 추가 */}
      <button 
        onClick={refreshBlockchainStatus}
        style={{
          padding: "8px 16px",
          backgroundColor: '#17a2b8',
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "14px",
          cursor: "pointer",
          fontWeight: "bold",
          marginTop: '10px'
        }}
      >
        🔄 상태 새로고침
      </button>
    </div>
  ) : (
    <div style={disconnectedStyle}>
      <p>❌ 지갑 연결 필요</p>
      <button onClick={checkAdminWallet} style={connectButtonStyle}>
        🦊 MetaMask 연결
      </button>
    </div>
  )}
  </div>

      {pendingUsers.length === 0 ? (
        <p>승인 대기 중인 사용자가 없습니다.</p>
      ) : (
        pendingUsers.map((pendingUser) => (
          <div key={pendingUser.id} style={cardStyle}>
            <img
              src={`http://localhost:3000${pendingUser.proof_url}`}
              alt="합격증"
              style={{ width: "150px", borderRadius: "8px", marginRight: "20px" }}
            />
            <div style={{ flex: 1 }}>
              <p><strong>닉네임:</strong> {pendingUser.username}</p>
              <p><strong>이메일:</strong> {pendingUser.email}</p>
              <p><strong>대학교:</strong> {pendingUser.university}</p>
              <p><strong>지갑 주소:</strong> {pendingUser.wallet_address?.slice(0, 10)}...{pendingUser.wallet_address?.slice(-6)}</p>
              <p><strong>가입일:</strong> {new Date(pendingUser.created_at).toLocaleString()}</p>
              
              {/* 🆕 상태별 버튼 렌더링 */}
              {renderActionButtons(pendingUser)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 스타일 정의들은 기존과 동일...
const walletStatusStyle = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  border: "2px solid #e9ecef"
};

const connectedStyle = {
  backgroundColor: "#d4edda",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #c3e6cb"
};

const disconnectedStyle = {
  backgroundColor: "#f8d7da",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #f5c6cb",
  textAlign: "center"
};

const connectButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f6851b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold"
};

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
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "bold"
};

export default AdminApproval;