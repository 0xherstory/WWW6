import React from 'react';
import { useWeb3 } from '../context/Web3Context';

const Navbar = () => {
  const { account, points, connectWallet, loading, claimInitialPoints, error } = useWeb3();

  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <h1>NÜSHU Protocol</h1>
      </div>
      
      <div style={styles.walletInfo}>
        {account ? (
          <div style={styles.accountInfo}>
            <span style={styles.points}>
              Current Credits: <strong>{points}</strong>
            </span>
            <span style={styles.account}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            {error && (
              <span style={styles.error}>
                {error}
              </span>
            )}
          </div>
        ) : (
          <button
            onClick={connectWallet}
            disabled={loading}
            style={{
              ...styles.connectButton,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ffccd5',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.05)',
    zIndex: 100
  },
  logo: {
    h1: {
      margin: 0,
      fontSize: '1.8rem',
      fontWeight: '700',
      fontFamily: 'inherit',
      letterSpacing: 'normal',
      background: 'linear-gradient(135deg, #ff6b8b 0%, #a855f7 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    }
  },
  walletInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    fontFamily: 'inherit'
  },
  accountInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem'
  },
  points: {
    fontSize: '1.1rem',
    fontWeight: '600',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  account: {
    fontSize: '1rem',
    color: '#333',
    fontWeight: '600',
    backgroundColor: '#fff0f5',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    border: '1px solid #ffccd5',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  },
  connectButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #ff8fab 100%)',
    color: '#ffffff',
    border: '1px solid #ff6b8b',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.2)'
  },
  claimButton: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #ff8fab 100%)',
    color: '#ffffff',
    border: '1px solid #ff6b8b',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.2)'
  },
  error: {
    fontSize: '0.95rem',
    color: '#ff6b8b',
    fontWeight: '600',
    backgroundColor: '#fff0f5',
    padding: '0.5rem 1rem',
    borderRadius: '12px',
    border: '1px solid #ffccd5',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  }
};

export default Navbar;
