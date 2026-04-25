import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Sparkles, Copy, CheckCircle2, MessageSquare, Flame } from 'lucide-react';

type Mode = 'to-genz' | 'to-english';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [mode, setMode] = useState<Mode>('to-genz');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // In production, this would point to the deployed backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, mode }),
      });

      if (!response.ok) {
        throw new Error('Failed to translate');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      
      setOutputText(data.translation);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. No cap.');
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleMode = () => {
    setMode(prev => prev === 'to-genz' ? 'to-english' : 'to-genz');
    setInputText(outputText);
    setOutputText('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <header style={{ padding: '2rem', textAlign: 'center' }}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}
        >
          <Flame color="#ec4899" size={32} />
          <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Gen-Z Translator
          </h1>
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ color: '#94a3b8', fontSize: '1.1rem', margin: 0 }}
        >
          Translate formal English to Gen-Z slang, and vice versa. Fr fr.
        </motion.p>
      </header>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <motion.div 
          className="glass-panel"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '900px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
          
          {/* Mode Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', background: 'rgba(15, 23, 42, 0.5)', padding: '0.5rem', borderRadius: '1rem', width: 'fit-content', margin: '0 auto' }}>
            <div 
              style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, transition: 'background 0.2s', color: mode === 'to-genz' ? 'white' : '#94a3b8', background: mode === 'to-genz' ? 'rgba(139, 92, 246, 0.5)' : 'transparent' }}
            >
              English
            </div>
            
            <button 
              onClick={toggleMode}
              style={{ background: 'none', border: 'none', color: '#ec4899', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
              title="Switch direction"
            >
              <motion.div whileHover={{ scale: 1.1, rotate: 180 }} transition={{ duration: 0.3 }}>
                <ArrowRightLeft />
              </motion.div>
            </button>

            <div 
              style={{ padding: '0.5rem 1.5rem', borderRadius: '0.5rem', fontWeight: 600, transition: 'background 0.2s', color: mode === 'to-english' ? 'white' : '#94a3b8', background: mode === 'to-english' ? 'rgba(139, 92, 246, 0.5)' : 'transparent' }}
            >
              Gen-Z
            </div>
          </div>

          {/* Translation Area */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} />
                  {mode === 'to-genz' ? 'Standard English' : 'Gen-Z Slang'}
                </span>
              </div>
              <textarea
                className="input-area custom-scrollbar"
                rows={8}
                placeholder={mode === 'to-genz' ? "Type some proper English here..." : "Type some skibidi slang here..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>

            {/* Output */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#ec4899" />
                  {mode === 'to-genz' ? 'Gen-Z Translation' : 'Standard English Translation'}
                </span>
                <button 
                  onClick={handleCopy}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.25rem' }}
                  title="Copy to clipboard"
                  disabled={!outputText}
                >
                  {copied ? <CheckCircle2 size={20} color="#10b981" /> : <Copy size={20} />}
                </button>
              </div>
              
              <div 
                className="input-area custom-scrollbar" 
                style={{ height: '100%', minHeight: '196px', overflowY: 'auto', background: 'rgba(15, 23, 42, 0.4)', borderColor: outputText ? 'var(--primary)' : 'var(--glass-border)' }}
              >
                {isLoading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <div className="loading-indicator" />
                  </div>
                ) : outputText ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {outputText}
                  </motion.div>
                ) : error ? (
                  <div style={{ color: '#ef4444', display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
                    {error}
                  </div>
                ) : (
                  <div style={{ color: '#64748b', display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center', textAlign: 'center', fontStyle: 'italic' }}>
                    Translation will appear here...
                  </div>
                )}
              </div>
            </div>

          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              className="btn-primary" 
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem', fontSize: '1.1rem' }}
            >
              {isLoading ? 'Translating...' : 'Translate Now'}
              {!isLoading && <Sparkles size={20} />}
            </button>
          </div>

        </motion.div>
      </main>

      <footer style={{ padding: '2rem', textAlign: 'center', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <p style={{ margin: 0 }}>Built with React, Express & Gemini API 🤖</p>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>Designed by Laiba San • Professional Edition</p>
      </footer>
    </div>
  );
}

export default App;
