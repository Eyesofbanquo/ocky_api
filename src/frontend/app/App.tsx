import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';

const App: React.FC = (props) => {
  const [response, setResponse] = useState<string>('');
  useEffect(() => {
    axios.get('/q?id=123').then((response) => {
      console.log(response);
    });
  });
  return (
    <div>
      <h1>Welcome to the Ocky React app</h1>
    </div>
  );
};

export default App;
