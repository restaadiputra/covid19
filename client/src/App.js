import React from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    const fetchData = () => {
      return axios.get('/api');
    };

    fetchData()
      .then(res => {
        const result = res.data;

        setData(result);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className='App'>
      <header className='App-header'>
        <p>Current Confirm Case {data && data.totalConfirmedCase}</p>
        <p>Current Confirm Case {data && data.totalDeathCase}</p>
        <p>Current Confirm Case {data && data.totalRecoveredCase}</p>
      </header>
    </div>
  );
}

export default App;
