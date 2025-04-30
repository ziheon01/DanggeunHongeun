import { createContext, useState, useEffect } from "react";

// ProductContext 생성
export const ProductContext = createContext();

// ProductProvider 컴포넌트
export function ProductProvider({ children }) {
  // 기본 상품 데이터
  const defaultProducts = [
    {
      id: 1,
      title: "아이폰 13",
      price: 700000,
      description: "실사용 1년, 박스 포함.",
      likedBy: [],
      imageUrl: "https://via.placeholder.com/400x300?text=아이폰13",
      location: "서울시 마포구",
      date: "2024.04.30",
      sellerName: "호빵맨"
    },
    {
      id: 2,
      title: "맥북 프로 M1",
      price: 1800000,
      description: "빠르고 조용한 M1 칩 맥북입니다.",
      likedBy: [],
      imageUrl: "https://via.placeholder.com/400x300?text=맥북프로",
      location: "서울시 강남구",
      date: "2024.04.29",
      sellerName: "슈퍼맨"
    },
    {
      id: 3,
      title: "에어팟 프로",
      price: 150000,
      description: "충전 케이스 포함, 노이즈 캔슬 잘돼요.",
      likedBy: [],
      imageUrl: "https://via.placeholder.com/400x300?text=에어팟프로",
      location: "서울시 홍대입구",
      date: "2024.04.28",
      sellerName: "호빵맨"
    }
  ];

  const [products, setProducts] = useState([]);

  // 앱 시작 시: localStorage에서 불러오거나 기본값 세팅
  useEffect(() => {
    const saved = localStorage.getItem("products"); // localStorage에서 'products'를 가져옴
    if (saved) {
      try {
        const parsed = JSON.parse(saved); // 저장된 데이터를 파싱
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);  // 데이터가 있다면 상태 업데이트
        } else {
          throw new Error("빈 배열");
        }
      } catch {
        setProducts(defaultProducts); // 오류가 나면 기본값 사용
        localStorage.setItem("products", JSON.stringify(defaultProducts)); // 기본값 localStorage에 저장
      }
    } else {
      setProducts(defaultProducts); // localStorage에 데이터가 없다면 기본값 사용
      localStorage.setItem("products", JSON.stringify(defaultProducts)); // 기본값 localStorage에 저장
    }
  }, []); // 처음 한 번만 실행되도록 빈 배열

  // 상품 업데이트 시 localStorage 동기화
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products)); // products가 업데이트되면 localStorage에 저장
    }
  }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
