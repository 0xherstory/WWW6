import React, { useState } from 'react';
// 导入女书图片映射表
import nushuImageMapping from '../utils/nushuImageMapping';

const FreeTranslation = () => {
  const [chineseText, setChineseText] = useState('');
  const [translationResult, setTranslationResult] = useState([]);

  // Convert Chinese characters to Nüshu images
  const handleTranslate = () => {
    if (!chineseText.trim()) {
      setTranslationResult([]);
      return;
    }

    const result = [];
    for (let char of chineseText) {
      if (nushuImageMapping[char]) {
        result.push({
          char,
          image: nushuImageMapping[char].image_url,
          pronunciation: nushuImageMapping[char].pronunciation,
          meaning: nushuImageMapping[char].meaning
        });
      } else {
        // Handle characters without mapping
        result.push({
          char,
          image: null,
          pronunciation: '',
          meaning: ''
        });
      }
    }
    
    setTranslationResult(result);
  };

  // Copy result
  const handleCopy = () => {
    if (translationResult.length === 0) return;
    
    // Copy original text
    navigator.clipboard.writeText(chineseText)
      .then(() => {
        alert('Original text copied to clipboard');
      })
      .catch(err => {
        console.error('Copy failed:', err);
      });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>On-Chain Mapping</h2>
      
      <div style={styles.inputSection}>
        <label htmlFor="chineseText" style={styles.label}>
          Input Chinese Characters:
        </label>
        <textarea
          id="chineseText"
          value={chineseText}
          onChange={(e) => setChineseText(e.target.value)}
          placeholder="Enter Chinese characters to map..."
          style={styles.textarea}
          rows={4}
        />
      </div>
      
      <div style={styles.buttonSection}>
        <button
          onClick={handleTranslate}
          style={styles.translateButton}
        >
          Generate Nüshu Script
        </button>
      </div>
      
      {translationResult.length > 0 && (
        <div style={styles.resultSection}>
          <label style={styles.label}>Mapping Results:</label>
          <div style={styles.resultText}>
            {translationResult.map((item, index) => (
              <div key={index} style={styles.nushuCharacter}>
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.char} 
                    style={styles.nushuImage} 
                    title={item.char + ' - ' + (item.meaning || 'No meaning')}
                  />
                ) : (
                  <span style={styles.unknownChar}>
                    {item.char}
                  </span>
                )}
                <div style={styles.charInfo}>
                  <span style={styles.originalChar}>{item.char}</span>
                  {item.pronunciation && (
                    <span style={styles.pronunciation}>{item.pronunciation}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleCopy}
            style={styles.copyButton}
          >
            Copy Result
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.1)',
    border: '1px solid #ffccd5',
    marginBottom: '2rem',
    fontFamily: 'inherit'
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    fontSize: '1.8rem',
    fontWeight: '600',
    letterSpacing: 'normal'
  },
  inputSection: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.75rem',
    fontWeight: '600',
    fontSize: '1.1rem',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  textarea: {
    width: '100%',
    padding: '1.25rem',
    border: '1px solid #ffccd5',
    borderRadius: '10px',
    fontSize: '1rem',
    resize: 'vertical',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff',
    color: '#333',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  },
  buttonSection: {
    marginBottom: '1.5rem'
  },
  translateButton: {
    padding: '1rem 2rem',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #ff8fab 100%)',
    color: '#ffffff',
    border: '1px solid #ff6b8b',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.2)'
  },
  resultSection: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #ffccd5',
    boxShadow: '0 2px 8px rgba(255, 107, 139, 0.1)'
  },
  resultText: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '1.5rem',
    minHeight: '60px',
    padding: '1.5rem',
    backgroundColor: '#fff0f5',
    borderRadius: '10px',
    border: '1px solid #ffccd5'
  },
  nushuCharacter: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '15px',
    backgroundColor: '#fff0f5',
    borderRadius: '10px',
    border: '1px solid #ffccd5',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  },
  nushuImage: {
    width: '90px',
    height: '90px',
    objectFit: 'contain',
    borderRadius: '10px',
    border: '1px solid #ffccd5',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  },
  unknownChar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90px',
    height: '90px',
    backgroundColor: '#fff0f5',
    borderRadius: '10px',
    fontSize: '2.2rem',
    color: '#333',
    border: '1px solid #ffccd5',
    boxShadow: '0 2px 4px rgba(255, 107, 139, 0.05)'
  },
  charInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    fontFamily: 'inherit'
  },
  originalChar: {
    fontSize: '1rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #ff6b8b 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  pronunciation: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '500'
  },
  copyButton: {
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
  }
};

export default FreeTranslation;
