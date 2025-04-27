import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home"; // 홈 페이지 파일도 만들었어야 함
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProductUpload from "./pages/ProductUpload";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <ProductProvider>
      <BrowserRouter>
        <div style={{ fontFamily: "Arial, sans-serif", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/upload" element={<ProductUpload />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ProductProvider>
  );
}

export default App;
