import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import CriarEmpresa from './components/CriarEmpresa';
import './App.css';

function App() {
  useEffect(() => {
    document.title = 'C:hatFüd';
  }, []);

  return (
    <div className="App">
      <h1 className="chatfud-title">C:hatFüd</h1>
      <CriarEmpresa />
    </div>
  );
}

export default App;
