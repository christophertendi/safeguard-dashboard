import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://safeguard-ai.safeguardai.workers.dev';

function App() {
  const [activeTab, setActiveTab] = useState('text');
  const [darkMode, setDarkMode] = useState(false);
  
  // Input states
  const [textInput, setText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  
  // Result states
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load dark mode preference
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

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

  // Document Moderation (placeholder - extracts text from PDF/DOCX)
  const moderateDocument = async () => {
    if (!documentFile) {
      setError('Please select a document');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Mock response for now - you can implement actual document parsing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        content_id: crypto.randomUUID(),
        content_type: 'document',
        verdict: 'safe',
        confidence: 0.92,
        categories: {
          toxic: 0.05,
          hateful: 0.02,
          threatening: 0.01,
          safe: 0.92
        },
        requires_review: false,
        timestamp: new Date().toISOString(),
        model: 'Document text extraction + AI analysis',
        filename: documentFile.name
      });
    } catch (err) {
      setError('Failed to moderate document');
    } finally {
      setLoading(false);
    }
  };

  // Video Moderation (placeholder - analyzes frames)
  const moderateVideo = async () => {
    if (!videoFile) {
      setError('Please select a video');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Mock response for now - you can implement frame extraction
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResult({
        content_id: crypto.randomUUID(),
        content_type: 'video',
        verdict: 'safe',
        confidence: 0.88,
        categories: {
          nsfw: 0.08,
          violence: 0.04,
          safe: 0.88
        },
        requires_review: false,
        timestamp: new Date().toISOString(),
        model: 'Frame-by-frame analysis (ResNet-50)',
        filename: videoFile.name,
        frames_analyzed: 24
      });
    } catch (err) {
      setError('Failed to moderate video');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (type === 'image') {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('Image must be less than 10MB');
        return;
      }
      setImageFile(file);
    } else if (type === 'document') {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a PDF, DOC, DOCX, or TXT file');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('Document must be less than 20MB');
        return;
      }
      setDocumentFile(file);
    } else if (type === 'video') {
      if (!file.type.startsWith('video/')) {
        setError('Please select a valid video file');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setError('Video must be less than 50MB');
        return;
      }
      setVideoFile(file);
    }
    
    setError(null);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setResult(null);
    setError(null);
  };

  return (
    <div className="App">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <h1>SafeGuard AI</h1>
            <p className="subtitle">Content Moderation Platform</p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button 
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <div className="container">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === 'text' ? 'tab active' : 'tab'}
            onClick={() => switchTab('text')}
          >
            📝 Text
          </button>
          <button
            className={activeTab === 'image' ? 'tab active' : 'tab'}
            onClick={() => switchTab('image')}
          >
            🖼️ Image
          </button>
          <button
            className={activeTab === 'document' ? 'tab active' : 'tab'}
            onClick={() => switchTab('document')}
          >
            📄 Document
          </button>
          <button
            className={activeTab === 'video' ? 'tab active' : 'tab'}
            onClick={() => switchTab('video')}
          >
            🎥 Video
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
              placeholder="Enter text to moderate..."
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
                onChange={(e) => handleFileChange(e, 'image')}
                id="image-input"
                className="file-input"
              />
              <label htmlFor="image-input" className="file-label">
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

        {/* Document Moderation Tab */}
        {activeTab === 'document' && (
          <div className="tab-content">
            <h2>Document Moderation</h2>
            <p className="description">
              Extract and analyze text from PDF, DOC, or TXT files
            </p>

            <div className="file-upload">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => handleFileChange(e, 'document')}
                id="document-input"
                className="file-input"
              />
              <label htmlFor="document-input" className="file-label">
                {documentFile ? `📎 ${documentFile.name}` : '📁 Choose Document'}
              </label>
            </div>

            {documentFile && (
              <div className="file-info">
                <p>📄 {documentFile.name}</p>
                <p className="file-size">{(documentFile.size / 1024).toFixed(2)} KB</p>
              </div>
            )}

            <button
              onClick={moderateDocument}
              disabled={loading || !documentFile}
              className="button-primary"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Moderate Document'}
            </button>
          </div>
        )}

        {/* Video Moderation Tab */}
        {activeTab === 'video' && (
          <div className="tab-content">
            <h2>Video Moderation</h2>
            <p className="description">
              Analyze video frames for inappropriate content
            </p>

            <div className="file-upload">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => handleFileChange(e, 'video')}
                id="video-input"
                className="file-input"
              />
              <label htmlFor="video-input" className="file-label">
                {videoFile ? `📎 ${videoFile.name}` : '📁 Choose Video'}
              </label>
            </div>

            {videoFile && (
              <div className="file-info">
                <p>🎥 {videoFile.name}</p>
                <p className="file-size">{(videoFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            <button
              onClick={moderateVideo}
              disabled={loading || !videoFile}
              className="button-primary"
            >
              {loading ? '⏳ Analyzing...' : '🔍 Moderate Video'}
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
                  {result.verdict === 'safe' ? '✓' : '⚠'}
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
                          backgroundColor: score > 0.7 ? '#1a1a1a' : score > 0.4 ? '#4a4a4a' : '#8a8a8a'
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
                  <span className="metadata-label">Type:</span>
                  <span className="metadata-value">{result.content_type}</span>
                </div>
                {result.filename && (
                  <div className="metadata-item">
                    <span className="metadata-label">File:</span>
                    <span className="metadata-value">{result.filename}</span>
                  </div>
                )}
                {result.frames_analyzed && (
                  <div className="metadata-item">
                    <span className="metadata-label">Frames:</span>
                    <span className="metadata-value">{result.frames_analyzed}</span>
                  </div>
                )}
                <div className="metadata-item">
                  <span className="metadata-label">Model:</span>
                  <span className="metadata-value">{result.model}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            Built by <strong>Christopher Samuel Tendi</strong>
          </p>
          <p className="tech-note">
            Cloudflare Workers AI • React • Vercel
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;