import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProductProvider } from "./contexts/ProductContext";
import { UserProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail";
import ProductUpload from "./pages/ProductUpload";
import Favorites from "./pages/Favorites";
import SellerPage from "./pages/SellerPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from './pages/Profile';
import MyPosts from "./pages/MyPosts";
import AdminApproval from "./pages/AdminApproval";
import ProfileEdit from "./pages/ProfileEdit";

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <BrowserRouter>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: "100%",  padding: "20px" }}>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/upload" element={<ProductUpload />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/seller/:name" element={<SellerPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/myposts" element={<MyPosts />} />
                <Route path="/admin" element={<AdminApproval />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
              </Routes>
            </div>
            <Sidebar />
          </div>
        </BrowserRouter>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
