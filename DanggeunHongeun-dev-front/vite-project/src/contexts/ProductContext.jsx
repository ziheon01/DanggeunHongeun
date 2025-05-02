import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

// ProductContext 생성
export const ProductContext = createContext();

// ProductProvider 컴포넌트
export function ProductProvider({ children }) {
  
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // ✅ 추가

  const { user } = useContext(UserContext);
  
  useEffect(() => {
    axios.get("http://localhost:3000/api/products")
    .then(res => setProducts(res.data))
    .catch(err => console.error("❌ 상품 목록 불러오기 실패:", err));
  }, []);

  useEffect(() => {
    if (user && user.id) {  // ✅ user 존재 + id도 존재할 때만
      axios.get(`http://localhost:3000/api/favorites/${user.id}`)
        .then(res => {
          console.log("✅ favorites API 응답:", res.data);
          setFavorites(res.data);
        })
        .catch(err => console.error("❌ 찜 목록 불러오기 실패:", err));
    } else {
      setFavorites([]);
    }
  }, [user]);

  return (
    <ProductContext.Provider value={{ products, setProducts, favorites, setFavorites }}>
      {children}
    </ProductContext.Provider>
  );
}
