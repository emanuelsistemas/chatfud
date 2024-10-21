import React from 'react';
import CriarEmpresa from './components/CriarEmpresa';

function App() {
  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{textAlign: 'center', color: '#333'}}>ChatFud</h1>
      <CriarEmpresa />
    </div>
  );
}

export default App;
