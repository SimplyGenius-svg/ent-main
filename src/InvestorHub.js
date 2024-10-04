import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import './styles/InvestorHub.css';

const InvestorHub = () => {
  const [investors, setInvestors] = useState([]);
  const [investmentInput, setInvestmentInput] = useState(10000);
  const [returnRate, setReturnRate] = useState(8);

  useEffect(() => {
    const fetchInvestors = async () => {
      const investorsCollection = collection(db, 'investors');
      const investorsSnapshot = await getDocs(investorsCollection);
      const investorsList = investorsSnapshot.docs.map((doc) => doc.data());
      setInvestors(investorsList);
    };

    fetchInvestors();
  }, []);

  const handleInvestmentChange = (e) => {
    setInvestmentInput(e.target.value);
  };

  const handleReturnRateChange = (e) => {
    setReturnRate(e.target.value);
  };

  const calculateReturn = () => {
    return ((investmentInput * (1 + returnRate / 100))).toFixed(2);
  };

  return (
    <div className="investor-hub">
      <h1 className="hub-title">Investor Hub</h1>

      <div className="resource-section">
        <h2>Investor Insights</h2>
        <ul className="resources-list">
          <li><a href="https://www.cbinsights.com/research/" target="_blank" rel="noopener noreferrer">Market Trends Report 2024</a></li>
          <li><a href="https://www.angel.co/invest" target="_blank" rel="noopener noreferrer">Guide to Startup Investments</a></li>
          <li><a href="https://pitch.com/templates" target="_blank" rel="noopener noreferrer">Investor Pitch Deck Templates</a></li>
        </ul>
      </div>

      <div className="investment-calculator">
        <h2>Future ROI Calculator</h2>
        <div className="calculator-input">
          <label>Investment Amount ($):</label>
          <input type="number" value={investmentInput} onChange={handleInvestmentChange} />
        </div>
        <div className="calculator-input">
          <label>Expected Return Rate (%):</label>
          <input type="number" value={returnRate} onChange={handleReturnRateChange} />
        </div>
        <h3>Projected Return: <span className="return-result">${calculateReturn()}</span></h3>
      </div>

      <div className="investor-list">
        <h2>Meet the Investors</h2>
        <div className="investor-cards">
          {investors.length > 0 ? (
            investors.map((investor, index) => (
              <div key={index} className="investor-card">
                <h3>{investor.name}</h3>
                <p>Industry: {investor.industry}</p>
                <p>Investment Range: {investor.investmentRange}</p>
                <p>Notable Investments: {investor.notableInvestments.join(', ')}</p>
              </div>
            ))
          ) : (
            <p>No investors found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvestorHub;
