function ProductList({ products }) {
  return (
    <div style={productListStyle}>
      <h2 style={{ fontSize: "20px", marginLeft: "20px", marginBottom: "10px" }}>🔥 요즘 인기 상품</h2>
      <div style={productContainerStyle}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} style={productCardStyle}>
              <img src={product.imageUrl} alt={product.title} style={productImageStyle} />
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>{product.price.toLocaleString()}원</p>
              <button style={buttonStyle}>찜하기</button> {/* 찜하기 버튼 추가 */}
            </div>
          ))
        ) : (
          <p>등록된 상품이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const productListStyle = {
  padding: '20px',
};

const productContainerStyle = {
  display: 'flex',
  gap: '20px',
  flexWrap: 'wrap',
};

const productCardStyle = {
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '20px',
  width: '300px',
  textAlign: 'center',
};

const productImageStyle = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
};

export default ProductList;