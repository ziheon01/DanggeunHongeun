import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // 앱 로딩 시 localStorage에서 유저 정보 불러오기
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그인 시 localStorage에 저장
  const login = (nickname) => {
    const userInfo = { nickname };
    setUser(userInfo);
    localStorage.setItem("user", JSON.stringify(userInfo));
  };

  // 로그아웃 시 localStorage에서 제거
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
