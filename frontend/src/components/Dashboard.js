import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: token },
        });
        setCards(response.data.cards);
      } catch (error) {
        alert('User not logged in');
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="cards">
        {cards.map((card) => (
          <div key={card.id} className="card" onClick={() => navigate(`/map/${card.id}`)}>
            Card {card.id}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;