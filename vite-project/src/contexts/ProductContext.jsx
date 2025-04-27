import { createContext, useState } from "react";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([
    { id: 1, title: "아이폰 13", price: 700000, description: "깨끗하게 사용했어요!", liked: false },
    { id: 2, title: "맥북 프로", price: 1800000, description: "M1 칩이에요", liked: false },
    { id: 3, title: "에어팟 프로", price: 150000, description: "상태 좋아요", liked: false }
  ]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
}
