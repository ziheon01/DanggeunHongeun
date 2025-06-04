import { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../contexts/UserContext';

const LocationSelector = () => {
  const { user } = useContext(UserContext); // user.id 필요
  const [location, setLocation] = useState('');

  const handleSubmit = async () => {
    if (!location) return alert('지역을 선택하세요.');

    try {
      await axios.patch('http://localhost:3000/api/updateLocation', {
        userId: user.id,
        location,
      });
      alert('관심 지역이 설정되었습니다.');
    } catch (error) {
      alert('오류 발생: ' + error.message);
    }
  };

  return (
    <div>
      <h3>관심 지역 설정</h3>
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="">선택하세요</option>
        <option value="서울시 성북구">서울시 성북구</option>
        <option value="서울시 강남구">서울시 강남구</option>
        <option value="부산시 해운대구">부산시 해운대구</option>
      </select>
      <button onClick={handleSubmit}>저장</button>
    </div>
  );
};

export default LocationSelector;
