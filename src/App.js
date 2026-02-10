import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://safeguard-ai.safeguardai.workers.dev';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Text Moderation
  const moderateText = async () => {
    if (!textInput.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/moderate/text`, {
        text: textInput
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to moderate text');
    } finally {
      setLoading(false);
    }
  };

  // Image Moderation
  const moderateImage = async () => {
    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await axios.post(`${API_URL}/moderate/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to moderate image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      setImageFile(file);
      setError(null);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🛡️ SafeGuard AI</h1>
        <p className="subtitle">Content Moderation Platform</p>
        <div className="tech-stack">
          <span className="badge">Cloudflare Workers AI</span>
          <span className="badge">React</span>
          <span className="badge">Vercel</span>
        </div>
      </header>

      <div className="container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === 'text' ? 'tab active' : 'tab'}
            onClick={() => {
              setActiveTab('text');
              setResult(null);
              setError(null);
            }}
          >
            📝 Text Moderation
          </button>
          <button
            className={activeTab === 'image' ? 'tab active' : 'tab'}
            onClick={() => {
              setActiveTab('image');
              setResult(null);
              setError(null);
            }}
          >
            🖼️ Image Moderation
          </button>
        </div>

        {/* Text Moderation Tab */}
        {activeTab === 'text' && (
          <div className="tab-content">
            <h2>Text Moderation</h2>
            <p className="description">
              Analyze text for toxic, hateful, or threatening content
            </p>

            <textarea
              value={textInput}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to moderate... (e.g., 'This is a great post!' or 'I hate you')"
              rows={6}
              className="textarea"
            />

            <div className="input-info">
              {textInput.length}/5000 characters
            </div>

            <button
              onClick={moderateText}
              disabled={loading || !textInput.trim()}
              className="button-primary"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Moderate Text'}
            </button>
          </div>
        )}

        {/* Image Moderation Tab */}
        {activeTab === 'image' && (
          <div className="tab-content">
            <h2>Image Moderation</h2>
            <p className="description">
              Detect NSFW or inappropriate images
            </p>

            <div className="file-upload">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                id="file-input"
                className="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                {imageFile ? `📎 ${imageFile.name}` : '📁 Choose Image'}
              </label>
            </div>

            {imageFile && (
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="preview-img"
                />
              </div>
            )}

            <button
              onClick={moderateImage}
              disabled={loading || !imageFile}
              className="button-primary"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Moderate Image'}
            </button>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Results Display */}
        {result && (
          <div className="results">
            <div className={`verdict-card ${result.verdict}`}>
              <div className="verdict-header">
                <span className="verdict-icon">
                  {result.verdict === 'safe' ? '✅' : '⚠️'}
                </span>
                <h3 className="verdict-title">
                  {result.verdict === 'safe' ? 'Content is Safe' : 'Content Flagged'}
                </h3>
              </div>

              <div className="verdict-stats">
                <div className="stat">
                  <span className="stat-label">Confidence</span>
                  <span className="stat-value">
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="stat">
                  <span className="stat-label">Requires Review</span>
                  <span className="stat-value">
                    {result.requires_review ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Categories Breakdown */}
              <div className="categories">
                <h4>Category Breakdown</h4>
                {Object.entries(result.categories).map(([category, score]) => (
                  <div key={category} className="category-item">
                    <div className="category-header">
                      <span className="category-name">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </span>
                      <span className="category-score">
                        {(score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${score * 100}%`,
                          backgroundColor: score > 0.7 ? '#ef4444' : score > 0.4 ? '#f59e0b' : '#10b981'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Metadata */}
              <div className="metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Content ID:</span>
                  <span className="metadata-value">{result.content_id}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Timestamp:</span>
                  <span className="metadata-value">
                    {new Date(result.timestamp).toLocaleString()}
                  </span>
                </div>
                {result.model && (
                  <div className="metadata-item">
                    <span className="metadata-label">Model:</span>
                    <span className="metadata-value">{result.model}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <h3>📊 How It Works</h3>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">⚡</div>
              <h4>Edge Computing</h4>
              <p>AI runs on Cloudflare's global network for fast responses</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🤖</div>
              <h4>Advanced AI</h4>
              <p>Powered by Llama 2 and ResNet-50 for accurate detection</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔒</div>
              <h4>Privacy First</h4>
              <p>Content is analyzed in real-time, not permanently stored</p>
            </div>
            <div className="info-card">
              <div className="info-icon">💰</div>
              <h4>Cost Effective</h4>
              <p>100% free tier on Cloudflare Workers AI</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>
            Built by <strong>Christopher Samuel Tendi</strong> |{' '}
            <a href="https://github.com/christophertendi/safeguard-ai" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>{' '}
            |{' '}
            <a href="https://linkedin.com/in/christopher-tendi" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </p>
          <p className="tech-note">
            Cloudflare Workers AI • React • Vercel • Supabase
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;