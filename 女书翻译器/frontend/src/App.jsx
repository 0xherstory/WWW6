import React from 'react';
import './App.css';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import FreeTranslation from './components/FreeTranslation';
import PaidTranslation from './components/PaidTranslation';

function App() {
  return (
    <Web3Provider>
      <div className="app">
        <Navbar />
        <main className="main">
          <section className="section">
            <FreeTranslation />
          </section>
          <section className="section">
            <PaidTranslation />
          </section>
        </main>
        <footer className="footer">
          <p>NÜSHU Protocol &copy; {new Date().getFullYear()}</p>
          <p className="subtitle">Preserving Women’s Script on the Blockchain</p>
        </footer>
      </div>
    </Web3Provider>
  );
}

export default App;
