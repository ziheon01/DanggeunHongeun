import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import web3Service from '../utils/web3'; // 방금 만든 Web3 유틸리티

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [university, setUniversity] = useState(""); // 🆕 대학교 필드 추가
  const [proof, setProof] = useState(null);
  const [walletAddress, setWalletAddress] = useState(""); // 🆕 지갑 주소
  const [isWalletConnected, setIsWalletConnected] = useState(false); // 🆕 지갑 연결 상태
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 지갑 연결 상태 확인
  useEffect(() => {
    checkWalletConnection();
    
    // 계정 변경 감지
    web3Service.onAccountChange((account) => {
      if (account) {
        setWalletAddress(account);
        setIsWalletConnected(true);
      } else {
        setWalletAddress("");
        setIsWalletConnected(false);
      }
    });
  }, []);

  // 지갑 연결 상태 확인
  const checkWalletConnection = async () => {
    const account = web3Service.getAccount();
    if (account) {
      setWalletAddress(account);
      setIsWalletConnected(true);
    }
  };

  // MetaMask 지갑 연결
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      const result = await web3Service.connectWallet();
      
      if (result.success) {
        setWalletAddress(result.account);
        setIsWalletConnected(true);
        alert(result.message);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('지갑 연결에 실패했습니다: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 지갑 주소 단축 표시
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🆕 지갑 연결 필수 확인
    if (!isWalletConnected) {
      alert("MetaMask 지갑을 먼저 연결해주세요.");
      return;
    }

    if (!email || !password || !username || !university || !proof) {
      alert("모든 항목을 입력해주세요. (합격증 포함)");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("username", username);
    formData.append("university", university); // 🆕 대학교 정보 추가
    formData.append("walletAddress", walletAddress); // 🆕 지갑 주소 추가
    formData.append("proof", proof);

    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/api/register', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert(response.data.message + '\n관리자 승인 후 블록체인에 인증 정보가 기록됩니다.');
      navigate("/login");
    } catch (err) {
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("회원가입 중 오류 발생");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>🎓 대학교 인증 회원가입</h2>
      
      {/* 🆕 지갑 연결 섹션 */}
      <div style={walletSectionStyle}>
        <h3>🦊 MetaMask 지갑 연결</h3>
        {!isWalletConnected ? (
          <div>
            <p style={{ color: '#666', fontSize: '14px' }}>
              블록체인 인증을 위해 MetaMask 지갑 연결이 필요합니다.
            </p>
            <button 
              type="button" 
              onClick={connectWallet} 
              disabled={isLoading}
              style={connectButtonStyle}
            >
              {isLoading ? '연결 중...' : '🦊 MetaMask 연결'}
            </button>
          </div>
        ) : (
          <div style={connectedWalletStyle}>
            <p style={{ color: 'green', fontWeight: 'bold' }}>✅ 지갑 연결됨</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              주소: {formatAddress(walletAddress)}
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <label>이메일</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          style={inputStyle} 
          required
        />
        
        <label>비밀번호</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={inputStyle} 
          required
        />
        
        <label>닉네임</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={inputStyle} 
          required
        />

        {/* 🆕 대학교 선택 */}
        <label>대학교</label>
        <select 
          value={university} 
          onChange={(e) => setUniversity(e.target.value)}
          style={inputStyle}
          required
        >
          <option value="">대학교를 선택하세요</option>
          <option value="서울대학교">서울대학교</option>
          <option value="연세대학교">연세대학교</option>
          <option value="고려대학교">고려대학교</option>
          <option value="성균관대학교">성균관대학교</option>
          <option value="한양대학교">한양대학교</option>
          <option value="중앙대학교">중앙대학교</option>
          <option value="경희대학교">경희대학교</option>
          <option value="기타">기타</option>
        </select>

        <label>합격증 파일</label>
        <input 
          type="file" 
          accept="image/*,.pdf" 
          onChange={(e) => setProof(e.target.files[0])} 
          style={inputStyle} 
          required
        />

        <button 
          type="submit" 
          disabled={!isWalletConnected || isLoading}
          style={{
            ...buttonStyle,
            backgroundColor: !isWalletConnected ? '#ccc' : 'green',
            cursor: !isWalletConnected ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? '처리 중...' : '🎓 회원가입'}
        </button>
      </form>

      {/* 🆕 안내 메시지 */}
      <div style={infoStyle}>
        <h4>📋 가입 절차</h4>
        <ol style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <li>MetaMask 지갑 연결</li>
          <li>회원 정보 및 합격증 업로드</li>
          <li>관리자 승인 대기</li>
          <li>승인 시 블록체인에 인증 정보 자동 기록</li>
          <li>서비스 이용 시작</li>
        </ol>
      </div>
    </div>
  );
}

// 🎨 스타일 정의
const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  fontSize: "16px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  boxSizing: "border-box"
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  backgroundColor: "green",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"
};

const walletSectionStyle = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "10px",
  marginBottom: "20px",
  textAlign: "center",
  border: "2px solid #e9ecef"
};

const connectButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "#f6851b",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontSize: "16px",
  cursor: "pointer",
  fontWeight: "bold"
};

const connectedWalletStyle = {
  backgroundColor: "#d4edda",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #c3e6cb"
};

const infoStyle = {
  backgroundColor: "#e7f3ff",
  padding: "20px",
  borderRadius: "10px",
  marginTop: "20px",
  textAlign: "center",
  border: "1px solid #b6d7ff"
};

export default Register;