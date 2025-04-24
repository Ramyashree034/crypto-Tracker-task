import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoData } from './cryptoSlice';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const CryptoTable = () => {
  const dispatch = useDispatch();
  const { coins, status, error } = useSelector((state) => state.crypto);

  useEffect(() => {
    dispatch(fetchCryptoData());
  }, [dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Live Crypto Price Tracker</h1>
      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>#</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Symbol</th>
            <th>Price</th>
            <th>1h%</th>
            <th>24h%</th>
            <th>7d%</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
            <th>7d Chart</th>
          </tr>
        </thead>
        <tbody>
          {coins.map((coin, index) => (
            <tr key={coin.id}>
              <td>{index + 1}</td>
              <td>
                <img src={coin.image} alt={coin.name} width="30" />
              </td>
              <td>{coin.name}</td>
              <td>{coin.symbol.toUpperCase()}</td>
              <td>${coin.current_price.toLocaleString()}</td>
              <td style={{ color: coin.price_change_percentage_1h_in_currency < 0 ? 'red' : 'green' }}>
                {coin.price_change_percentage_1h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: coin.price_change_percentage_24h_in_currency < 0 ? 'red' : 'green' }}>
                {coin.price_change_percentage_24h_in_currency?.toFixed(2)}%
              </td>
              <td style={{ color: coin.price_change_percentage_7d_in_currency < 0 ? 'red' : 'green' }}>
                {coin.price_change_percentage_7d_in_currency?.toFixed(2)}%
              </td>
              <td>${coin.market_cap.toLocaleString()}</td>
              <td>${coin.total_volume.toLocaleString()}</td>
              <td>
                <Line
                  data={{
                    labels: coin.sparkline_in_7d.price.map((_, i) => i),
                    datasets: [
                      {
                        data: coin.sparkline_in_7d.price,
                        borderColor: 'blue',
                        borderWidth: 1,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                    },
                    scales: {
                      x: { display: false },
                      y: { display: false },
                    },
                  }}
                  height={40}
                  width={100}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CryptoTable;