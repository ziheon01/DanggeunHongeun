import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

function Navbar() {
  const { user, logout } = useContext(UserContext);

  return (
    <nav style={{
      padding: "10px 0",
      borderBottom: "2px solid #ccc",
      marginBottom: "20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "18px"
    }}>
      {/* 왼쪽 메뉴 */}
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ textDecoration: "none", color: "black" }}>Home</Link>
        <Link to="/products" style={{ textDecoration: "none", color: "black" }}>상품 리스트</Link>
        <Link to="/upload" style={{ textDecoration: "none", color: "black" }}>상품 등록</Link>
        <Link to="/favorites" style={{ textDecoration: "none", color: "black" }}>관심 상품</Link>
        {user && <Link to="/myposts">내 게시글</Link>}
        {user && <Link to="/profile/edit">프로필 수정</Link>}
        {user?.is_admin && <Link to="/admin" style={{ color: "red" }}>관리자 승인</Link>}
      </div>

      {/* 오른쪽 유저 메뉴 */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        {user ? (
          <>
            <span style={{ fontSize: "16px", color: "green" }}>{user.username}님</span>
            <button onClick={logout} style={{
              background: "none", border: "1px solid #999", borderRadius: "4px",
              padding: "5px 10px", cursor: "pointer"
            }}>로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: "none", color: "blue" }}>로그인</Link>
            <Link to="/register" style={{ textDecoration: "none", color: "blue" }}>회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
