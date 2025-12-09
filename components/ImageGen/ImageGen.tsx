// ============================================
// FILE: components/ImageGen/ImageGen.tsx
// ============================================
'use client';
import { useState } from 'react';
import './ImageGen.css';

interface ImageConfig {
  height: number;
  width: number;
  cfgScale: number;
  stylePreset: string | null;
  outputFormat: string;
  safetyMode: string;
}

interface ImageGeneratorProps {
  onBack?: () => void;
}

export default function ImageGenerator({ onBack }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState<string>('');
  const [samples, setSamples] = useState<number>(1);
  const [steps, setSteps] = useState<number>(30);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false); // ✅ NEW: Refresh loader state
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Advanced settings - Reset to defaults on full refresh
  const [config, setConfig] = useState<ImageConfig>({
    height: 1024,
    width: 1024,
    cfgScale: 7.0,
    stylePreset: null,
    outputFormat: 'png',
    safetyMode: 'SAFE'
  });

  const resolutionOptions = [
    { label: '1024 x 1024 (Square)', value: [1024, 1024] },
    { label: '1152 x 896 (Landscape)', value: [1152, 896] },
    { label: '896 x 1152 (Portrait)', value: [896, 1152] },
    { label: '1344 x 768 (Wide)', value: [1344, 768] },
    { label: '768 x 1344 (Tall)', value: [768, 1344] },
    { label: '1536 x 640 (Ultra-wide)', value: [1536, 640] },
    { label: '640 x 1536 (Ultra-tall)', value: [640, 1536] }
  ];

  const stylePresets = [
    'none', '3d-model', 'analog-film', 'anime', 'cinematic', 
    'comic-book', 'digital-art', 'enhance', 'fantasy-art', 
    'photographic', 'pixel-art', 'isometric', 'line-art'
  ];

  // ✅ UPDATED: FULL REFRESH - Clears ALL fields + outputs
  const handleRefresh = () => {
    setRefreshing(true);
    // Small delay to show loader effect
    setTimeout(() => {
      // Clear ALL inputs
      setPrompt('');
      setSamples(1);
      setSteps(30);
      setConfig({
        height: 1024,
        width: 1024,
        cfgScale: 7.0,
        stylePreset: null,
        outputFormat: 'png',
        safetyMode: 'SAFE'
      });
      // Clear outputs
      setGeneratedImages([]);
      setSelectedImages([]);
      setRefreshing(false);
    }, 600);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    setLoading(true);
    setGeneratedImages([]);
    setSelectedImages([]);

    try {
      const response = await fetch('${process.env.NEXT_PUBLIC_BACKEND_URL}/api/image-generation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          config: {
            samples,
            steps,
            height: config.height,
            width: config.width,
            cfgScale: config.cfgScale,
            stylePreset: config.stylePreset === 'none' ? null : config.stylePreset
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedImages(data.data.images);
        setSelectedImages(data.data.images.map((_: any, i: number) => i));
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Generation error:', error);
      alert('Failed to generate images. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleImageSelection = (index: number) => {
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const selectAll = () => {
    setSelectedImages(generatedImages.map((_, i) => i));
  };

  const deselectAll = () => {
    setSelectedImages([]);
  };

  const downloadSelected = () => {
    selectedImages.forEach((index) => {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImages[index]}`;
      link.download = `generated-image-${index + 1}.png`;
      link.click();
    });
  };

  const downloadAll = () => {
    generatedImages.forEach((image, index) => {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${image}`;
      link.download = `generated-image-${index + 1}.png`;
      link.click();
    });
  };

  const shareImages = async () => {
    if (selectedImages.length === 0) {
      alert('Please select at least one image to share');
      return;
    }

    const imagesToShare = selectedImages.map(i => generatedImages[i]);
    
    try {
      const files = await Promise.all(
        imagesToShare.map(async (base64, idx) => {
          const response = await fetch(`data:image/png;base64,${base64}`);
          const blob = await response.blob();
          return new File([blob], `image-${idx + 1}.png`, { type: 'image/png' });
        })
      );

      if (navigator.share && navigator.canShare({ files })) {
        await navigator.share({
          files,
          title: 'AI Generated Images',
          text: `Generated with prompt: ${prompt}`
        });
      } else {
        alert('Sharing not supported on this browser. Use download instead.');
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error);
    }
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const openPreview = (image: string) => {
    setPreviewImage(image);
  };

  const closePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="container">
      {/* ✅ Top Controls with Refresh Loader */}
      <div className="top-controls">
        {onBack && (
          <button className="back-button" onClick={onBack} disabled={refreshing}>
            ← Back to Conversions
          </button>
        )}
        {/* ✅ Refresh Button with Loader */}
        <button 
          className="refresh-button" 
          onClick={handleRefresh} 
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <>
              <div className="refresh-loader"></div>
              Resetting...
            </>
          ) : (
            '🔄 Reset All'
          )}
        </button>
      </div>
      
      <div className="header">
        <h1>🎨 AI Image Generator</h1>
        <p>Create stunning images from text descriptions</p>
      </div>

      {/* ✅ Main Form - Disabled during refresh */}
      <div className={`main-form ${refreshing ? 'refreshing' : ''}`}>
        {refreshing && (
          <div className="form-refresh-overlay">
            <div className="refresh-loader-large"></div>
            <p>🔄 Resetting form...</p>
          </div>
        )}
        
        <div className="input-group">
          <label>Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            disabled={refreshing}
          />
        </div>

        <div className="quick-settings">
          <div className="input-group">
            <label>Samples</label>
            <select 
              value={samples} 
              onChange={(e) => setSamples(Number(e.target.value))}
              disabled={refreshing}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} image{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label>Steps</label>
            <select 
              value={steps} 
              onChange={(e) => setSteps(Number(e.target.value))}
              disabled={refreshing}
            >
              <option value={10}>10 (Fast)</option>
              <option value={20}>20 (Good)</option>
              <option value={30}>30 (Balanced) ✓</option>
              <option value={40} disabled>40 (Premium) 🔒</option>
              <option value={50} disabled>50 (Premium) 🔒</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button 
            className="btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
            disabled={loading || refreshing || !prompt.trim()}
          >
            ⚙️ Advanced Settings
          </button>
          
          <button 
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading || refreshing || !prompt.trim()}
          >
            {loading ? '⏳ Generating...' : '🎨 Generate Images'}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {generatedImages.length > 0 && (
        <div className={`results-section ${refreshing ? 'refreshing' : ''}`}>
          {refreshing && (
            <div className="refresh-overlay">
              <div className="refresh-loader-large"></div>
              <p>🔄 Clearing images...</p>
            </div>
          )}
          
          {!refreshing && (
            <>
              <div className="results-header">
                <h2>📸 Generated Images ({generatedImages.length})</h2>
                <div className="results-actions">
                  <button className="btn-small" onClick={selectAll} disabled={refreshing}>
                    ✓ Select All
                  </button>
                  <button className="btn-small" onClick={deselectAll} disabled={refreshing}>
                    ✕ Deselect All
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={downloadSelected}
                    disabled={selectedImages.length === 0 || refreshing}
                  >
                    💾 Download Selected ({selectedImages.length})
                  </button>
                  <button className="btn-secondary" onClick={downloadAll} disabled={refreshing}>
                    📥 Download All
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={shareImages}
                    disabled={selectedImages.length === 0 || refreshing}
                  >
                    📤 Share
                  </button>
                </div>
              </div>

              <div className="image-grid">
                {generatedImages.map((image, index) => (
                  <div
                    key={index}
                    className={`image-card ${selectedImages.includes(index) ? 'selected' : ''}`}
                    onClick={() => toggleImageSelection(index)}
                  >
                    <img src={`data:image/png;base64,${image}`} alt={`Generated ${index + 1}`} />
                    <div className="image-overlay">
                      {selectedImages.includes(index) && (
                        <div className="checkmark">✓</div>
                      )}
                      <button 
                        className="preview-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPreview(image);
                        }}
                        title="Preview full size"
                        disabled={refreshing}
                      >
                        👁️
                      </button>
                    </div>
                    <div className="image-number">#{index + 1}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Advanced Settings Modal */}
      {showSettings && (
        <div className="modal-overlay" onClick={() => setShowSettings(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚙️ Advanced Settings</h2>
              <button onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="input-group">
                <label>Resolution</label>
                <select
                  value={`${config.width}x${config.height}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    setConfig({ ...config, width: w, height: h });
                  }}
                  disabled={refreshing}
                >
                  {resolutionOptions.map(opt => (
                    <option key={opt.label} value={`${opt.value[0]}x${opt.value[1]}`}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>CFG Scale: {config.cfgScale.toFixed(1)}</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={config.cfgScale}
                  onChange={(e) => setConfig({ ...config, cfgScale: Number(e.target.value) })}
                  disabled={refreshing}
                />
                <small>How strictly AI follows your prompt (1=creative, 10=strict)</small>
              </div>

              <div className="input-group">
                <label>Style Preset</label>
                <select
                  value={config.stylePreset || 'none'}
                  onChange={(e) => setConfig({ 
                    ...config, 
                    stylePreset: e.target.value === 'none' ? null : e.target.value 
                  })}
                  disabled={refreshing}
                >
                  {stylePresets.map(style => (
                    <option key={style} value={style}>
                      {style.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Output Format</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={config.outputFormat === 'png'}
                      onChange={() => setConfig({ ...config, outputFormat: 'png' })}
                      disabled={refreshing}
                    />
                    PNG (Lossless)
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={config.outputFormat === 'jpg'}
                      onChange={() => setConfig({ ...config, outputFormat: 'jpg' })}
                      disabled={refreshing}
                    />
                    JPG (Compressed)
                  </label>
                </div>
              </div>

              <div className="input-group">
                <label>Safety Mode</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      checked={config.safetyMode === 'SAFE'}
                      onChange={() => setConfig({ ...config, safetyMode: 'SAFE' })}
                      disabled={refreshing}
                    />
                    Safe (Recommended)
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={config.safetyMode === 'NONE'}
                      onChange={() => setConfig({ ...config, safetyMode: 'NONE' })}
                      disabled={refreshing}
                    />
                    None
                  </label>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowSettings(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={() => setShowSettings(false)}>
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={closePreview}>
          <div className="modal-content preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🖼️ Image Preview</h2>
              <button onClick={closePreview}>✕</button>
            </div>
            <div className="preview-image-container">
              <img 
                src={`data:image/png;base64,${previewImage}`} 
                alt="Full size preview"
                className="preview-image"
              />
            </div>
            <div className="modal-footer">
              <button className="btn-primary" onClick={closePreview}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="loading-overlay">
          <div className="loader"></div>
          <p>Generating your images...</p>
        </div>
      )}
    </div>
  );
}
