import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Play, Pause, RotateCcw, Info, Sparkles } from 'lucide-react';

const GPTArchitectureVisualization = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [selectedHead, setSelectedHead] = useState(0);
  const [attentionAnimationPhase, setAttentionAnimationPhase] = useState(0);
  
  // Refs for scrolling
  const sectionRefs = {
    input: useRef(null),
    embeddings: useRef(null),
    positional: useRef(null),
    transformer: useRef(null),
    attention: useRef(null),
    feedforward: useRef(null),
    output: useRef(null)
  };

  // Auto-scroll to active section
  useEffect(() => {
    const scrollToSection = () => {
      let targetRef = null;
      
      switch(activeStep) {
        case 0:
          targetRef = sectionRefs.input;
          break;
        case 1:
          targetRef = sectionRefs.embeddings;
          break;
        case 2:
          targetRef = sectionRefs.positional;
          break;
        case 3:
        case 4:
          targetRef = sectionRefs.attention;
          break;
        case 5:
        case 6:
          targetRef = sectionRefs.feedforward;
          break;
        case 7:
          targetRef = sectionRefs.output;
          break;
      }
      
      if (targetRef?.current) {
        targetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    };
    
    // Small delay to ensure DOM updates have completed
    const scrollTimer = setTimeout(scrollToSection, 100);
    return () => clearTimeout(scrollTimer);
  }, [activeStep]);

  // Smooth attention animation phases
  useEffect(() => {
    if (activeStep === 3 && isPlaying) {
      const phaseTimer = setInterval(() => {
        setAttentionAnimationPhase(prev => (prev + 1) % 4);
      }, 750);
      return () => clearInterval(phaseTimer);
    }
  }, [activeStep, isPlaying]);

  // Animation control
  useEffect(() => {
    if (isPlaying && activeStep < 7) {
      const timer = setTimeout(() => {
        setActiveStep(activeStep + 1);
      }, 4000); // Increased duration for smoother experience
      return () => clearTimeout(timer);
    } else if (isPlaying && activeStep === 7) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep]);

  const steps = [
    { id: 0, name: "Input Tokenization", description: "Text is split into tokens (words or subwords). Each token becomes the basic unit of processing." },
    { id: 1, name: "Token Embeddings", description: "Each token is converted to a high-dimensional vector (typically 768 dimensions) that captures its semantic meaning." },
    { id: 2, name: "Positional Encoding", description: "Position information is added to embeddings using sinusoidal patterns, giving the model awareness of word order." },
    { id: 3, name: "Multi-Head Attention", description: "Tokens attend to each other through parallel attention heads, each capturing different types of relationships." },
    { id: 4, name: "Add & Normalize", description: "Residual connection preserves original information while layer normalization stabilizes training." },
    { id: 5, name: "Feed Forward", description: "Position-wise neural network applies non-linear transformations to refine each token's representation." },
    { id: 6, name: "Add & Normalize", description: "Another residual connection and normalization to integrate the feed-forward transformations." },
    { id: 7, name: "Output Projection", description: "Final linear transformation projects to vocabulary size, producing probability distribution over next tokens." }
  ];

  // Sample tokens for visualization
  const tokens = ["The", "cat", "sat", "on", "the", "mat"];
  
  // Token component with smoother animation
  const Token = ({ text, index, isActive, delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
      if (isActive) {
        const timer = setTimeout(() => setIsVisible(true), delay * 100);
        return () => clearTimeout(timer);
      } else {
        setIsVisible(false);
      }
    }, [isActive, delay]);
    
    return (
      <div 
        className={`
          px-4 py-2 rounded-lg font-mono text-sm transition-all duration-700 ease-out
          ${isVisible ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-105 shadow-lg' : 'bg-gray-200 text-gray-700 scale-100'}
        `}
        style={{
          transform: isVisible ? 'translateY(-4px)' : 'translateY(0)',
          opacity: isVisible ? 1 : 0.7,
        }}
      >
        {text}
      </div>
    );
  };

  // Enhanced vector visualization with wave animation
  const VectorVisualization = ({ size = 8, highlighted = false, label = "", animate = false }) => {
    return (
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-1 gap-1">
          {[...Array(size)].map((_, i) => (
            <div
              key={i}
              className={`
                w-14 h-3 rounded transition-all duration-500 ease-out
                ${highlighted ? 'bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500' : 'bg-gray-300'}
              `}
              style={{
                opacity: highlighted ? 0.9 : 0.3,
                transform: highlighted ? `scaleX(${0.7 + Math.sin(i * 0.5) * 0.3})` : 'scaleX(1)',
                animation: animate && highlighted ? `pulse ${1 + i * 0.1}s ease-in-out infinite` : 'none',
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
        {label && (
          <span className={`text-xs mt-2 transition-all duration-500 ${highlighted ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
            {label}
          </span>
        )}
      </div>
    );
  };

  // Enhanced self-attention visualization
  const SelfAttentionVisualization = () => {
    const heads = 8;
    const [hoveredCell, setHoveredCell] = useState(null);
    
    // Generate attention scores with some structure
    const generateAttentionScore = (i, j) => {
      // Make diagonal slightly stronger
      const diagonalBonus = i === j ? 0.3 : 0;
      // Make adjacent tokens have higher attention
      const adjacencyBonus = Math.abs(i - j) === 1 ? 0.2 : 0;
      // Add some randomness
      const randomScore = Math.random() * 0.5;
      
      return Math.min(diagonalBonus + adjacencyBonus + randomScore, 0.99);
    };
    
    return (
      <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 rounded-2xl p-8 shadow-xl" ref={sectionRefs.attention}>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="text-purple-600" size={24} />
          <h3 className="text-xl font-bold text-gray-800">Multi-Head Self-Attention in Action</h3>
        </div>
        
        {/* Attention heads selector with smooth transitions */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Each attention head learns different patterns. Select a head to explore:</p>
          <div className="flex gap-2 flex-wrap">
            {[...Array(heads)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSelectedHead(i)}
                className={`
                  px-4 py-2 rounded-lg text-sm transition-all duration-300 transform
                  ${selectedHead === i 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-105 shadow-lg' 
                    : 'bg-gray-200 hover:bg-gray-300 hover:scale-102'}
                `}
              >
                Head {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Q, K, V transformation visualization with animation phases */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {[
            { name: 'Query (Q)', color: 'orange', desc: 'What am I looking for?', icon: '🔍' },
            { name: 'Key (K)', color: 'green', desc: 'What information do I have?', icon: '🔑' },
            { name: 'Value (V)', color: 'blue', desc: 'What content to pass forward?', icon: '💎' }
          ].map((item, idx) => (
            <div 
              key={item.name}
              className={`
                transform transition-all duration-700 ease-out
                ${attentionAnimationPhase >= idx ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}
              `}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              <div className={`bg-${item.color}-100 rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-bold text-${item.color}-800`}>{item.name}</h4>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <VectorVisualization size={6} highlighted={activeStep === 3 && attentionAnimationPhase >= idx} animate={true} />
                <p className="text-xs text-gray-600 mt-3">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced attention matrix visualization */}
        <div className="bg-white rounded-xl p-6 shadow-inner">
          <h4 className="font-semibold mb-4 text-gray-700">
            Attention Pattern Visualization (Head {selectedHead + 1})
          </h4>
          
          {/* Token labels on top */}
          <div className="flex gap-1 mb-2 ml-16">
            {tokens.map((token, i) => (
              <div key={i} className="w-12 text-center text-xs font-semibold text-gray-600">
                {token}
              </div>
            ))}
          </div>
          
          {/* Matrix with row labels */}
          <div className="flex">
            <div className="flex flex-col gap-1 mr-2">
              {tokens.map((token, i) => (
                <div key={i} className="h-12 flex items-center justify-end pr-2 text-xs font-semibold text-gray-600">
                  {token}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-6 gap-1">
              {tokens.map((token1, i) => (
                tokens.map((token2, j) => {
                  const score = generateAttentionScore(i, j);
                  const isHovered = hoveredCell?.i === i && hoveredCell?.j === j;
                  
                  return (
                    <div
                      key={`${i}-${j}`}
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 transform cursor-pointer"
                      style={{
                        backgroundColor: `rgba(139, 92, 246, ${activeStep === 3 ? score * 0.8 : 0.1})`,
                        color: score > 0.5 ? 'white' : 'black',
                        transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                        boxShadow: isHovered ? '0 4px 12px rgba(139, 92, 246, 0.4)' : 'none'
                      }}
                      onMouseEnter={() => setHoveredCell({ i, j })}
                      onMouseLeave={() => setHoveredCell(null)}
                      title={`Attention from "${token1}" to "${token2}": ${(score * 100).toFixed(0)}%`}
                    >
                      {(score * 10).toFixed(1)}
                    </div>
                  );
                })
              ))}
            </div>
          </div>
          
          <p className="text-xs text-gray-500 mt-4 flex items-center gap-2">
            <Info size={14} />
            Brighter cells indicate stronger attention. Notice how tokens attend to themselves and nearby context.
          </p>
        </div>
      </div>
    );
  };

  // Main architecture flow with enhanced animations
  const ArchitectureFlow = () => {
    return (
      <div className="relative space-y-8">
        {/* Input tokens section */}
        <div className="mb-10" ref={sectionRefs.input}>
          <div className={`
            border-3 rounded-2xl p-8 transition-all duration-700
            ${activeStep >= 0 ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl' : 'border-gray-300 bg-white'}
          `}>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className={`transition-all duration-500 ${activeStep >= 0 ? 'text-blue-700' : 'text-gray-700'}`}>
                Step 1: Input Text Tokenization
              </span>
              {activeStep >= 0 && <Sparkles className="text-blue-500" size={20} />}
            </h3>
            <div className="flex gap-3 flex-wrap">
              {tokens.map((token, i) => (
                <Token key={i} text={token} index={i} isActive={activeStep >= 0} delay={i} />
              ))}
            </div>
            {activeStep === 0 && (
              <p className="mt-4 text-sm text-gray-600 animate-fade-in">
                Each word becomes a discrete token - the fundamental unit that flows through the neural network.
              </p>
            )}
          </div>
        </div>

        {/* Token Embeddings with flow animation */}
        <div ref={sectionRefs.embeddings} className={`
          border-3 rounded-2xl p-8 transition-all duration-700 transform
          ${activeStep >= 1 ? 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-100' : 'border-gray-300 bg-white scale-98'}
        `}>
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className={`transition-all duration-500 ${activeStep >= 1 ? 'text-purple-700' : 'text-gray-700'}`}>
              Step 2: Token → Vector Embeddings
            </span>
            {activeStep >= 1 && <Sparkles className="text-purple-500" size={20} />}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tokens.slice(0, 3).map((token, i) => (
              <div 
                key={i} 
                className={`
                  flex items-center gap-4 p-4 rounded-xl transition-all duration-700
                  ${activeStep >= 1 ? 'bg-white shadow-md' : 'bg-gray-50'}
                `}
                style={{ transitionDelay: `${i * 200}ms` }}
              >
                <span className="font-mono text-lg font-semibold">{token}</span>
                <ChevronRight className={`transition-all duration-500 ${activeStep >= 1 ? 'text-purple-500' : 'text-gray-400'}`} />
                <VectorVisualization 
                  highlighted={activeStep >= 1} 
                  label={activeStep >= 1 ? 'd=768' : 'd=?'} 
                  animate={true}
                />
              </div>
            ))}
          </div>
          {activeStep === 1 && (
            <p className="mt-6 text-sm text-gray-600 animate-fade-in">
              Each token transforms into a 768-dimensional vector encoding its semantic meaning - similar words have similar vectors.
            </p>
          )}
        </div>

        {/* Positional Encoding with wave visualization */}
        <div ref={sectionRefs.positional} className={`
          border-3 rounded-2xl p-8 transition-all duration-700 transform
          ${activeStep >= 2 ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl scale-100' : 'border-gray-300 bg-white scale-98'}
        `}>
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className={`transition-all duration-500 ${activeStep >= 2 ? 'text-green-700' : 'text-gray-700'}`}>
              Step 3: Adding Positional Information
            </span>
            {activeStep >= 2 && <Sparkles className="text-green-500" size={20} />}
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              {[0, 1, 2, 3, 4, 5].map(pos => (
                <div 
                  key={pos} 
                  className={`
                    px-4 py-2 rounded-lg font-mono text-sm transition-all duration-500 transform
                    ${activeStep >= 2 ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md' : 'bg-gray-200'}
                  `}
                  style={{ 
                    transitionDelay: `${pos * 100}ms`,
                    transform: activeStep >= 2 ? `translateY(${Math.sin(pos * 0.5) * 4}px)` : 'translateY(0)'
                  }}
                >
                  Pos {pos}
                </div>
              ))}
            </div>
            <ChevronRight className={`transition-all duration-500 ${activeStep >= 2 ? 'text-green-500' : 'text-gray-400'}`} size={24} />
            <span className={`text-gray-600 transition-all duration-500 ${activeStep >= 2 ? 'font-semibold' : ''}`}>
              Added to embeddings
            </span>
          </div>
          {activeStep === 2 && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg animate-fade-in">
              <p className="text-sm text-green-800">
                Sinusoidal position encodings give the model awareness of word order - crucial since attention operates on all positions simultaneously.
              </p>
            </div>
          )}
        </div>

        {/* Transformer Block */}
        <div ref={sectionRefs.transformer} className={`
          border-4 rounded-3xl p-8 transition-all duration-700
          ${activeStep >= 3 ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 shadow-2xl' : 'border-gray-400 bg-gray-50'}
        `}>
          <h2 className="text-2xl font-bold mb-6 text-center">
            <span className={`transition-all duration-500 ${activeStep >= 3 ? 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600' : 'text-gray-700'}`}>
              Transformer Block (Repeated 12-96 times)
            </span>
          </h2>
          
          {/* Self-Attention - now integrated into the main component */}
          {activeStep >= 3 && <SelfAttentionVisualization />}
          
          {/* Feed Forward Network */}
          <div ref={sectionRefs.feedforward} className={`
            mt-8 border-3 rounded-2xl p-8 transition-all duration-700 transform
            ${activeStep >= 5 ? 'border-indigo-400 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-xl scale-100' : 'border-gray-300 bg-white scale-98'}
          `}>
            <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
              <span className={`transition-all duration-500 ${activeStep >= 5 ? 'text-indigo-700' : 'text-gray-700'}`}>
                Feed-Forward Neural Network
              </span>
              {activeStep >= 5 && <Sparkles className="text-indigo-500" size={20} />}
            </h3>
            <div className="flex items-center justify-center gap-6">
              <VectorVisualization size={8} highlighted={activeStep >= 5} label="Input (d=768)" animate={true} />
              
              <div className="flex flex-col items-center gap-2">
                <div className={`
                  px-6 py-3 rounded-xl font-semibold transition-all duration-700 transform
                  ${activeStep >= 5 ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg scale-105' : 'bg-gray-300 text-gray-600'}
                `}>
                  Linear → ReLU → Linear
                </div>
                <span className={`text-xs transition-all duration-500 ${activeStep >= 5 ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                  4× expansion (3072 dims)
                </span>
              </div>
              
              <VectorVisualization size={8} highlighted={activeStep >= 5} label="Output (d=768)" animate={true} />
            </div>
            {activeStep >= 5 && (
              <p className="mt-6 text-sm text-gray-600 text-center animate-fade-in">
                Position-wise transformations refine each token independently, adding non-linearity and capacity.
              </p>
            )}
          </div>
        </div>

        {/* Output Projection */}
        <div ref={sectionRefs.output} className={`
          border-3 rounded-2xl p-8 transition-all duration-700 transform
          ${activeStep >= 7 ? 'border-red-400 bg-gradient-to-br from-red-50 to-orange-50 shadow-xl scale-100' : 'border-gray-300 bg-white scale-98'}
        `}>
          <h3 className="text-xl font-bold mb-5 flex items-center gap-2">
            <span className={`transition-all duration-500 ${activeStep >= 7 ? 'text-red-700' : 'text-gray-700'}`}>
              Final Step: Output Probability Distribution
            </span>
            {activeStep >= 7 && <Sparkles className="text-red-500" size={20} />}
          </h3>
          <div className="flex items-center gap-6 justify-center">
            <VectorVisualization size={8} highlighted={activeStep >= 7} label="Final hidden state" animate={true} />
            <ChevronRight className={`transition-all duration-500 ${activeStep >= 7 ? 'text-red-500' : 'text-gray-400'}`} size={32} />
            <div className="grid grid-cols-2 gap-3">
              {[
                { word: "sat", prob: 0.89, highlight: true },
                { word: "slept", prob: 0.05 },
                { word: "jumped", prob: 0.03 },
                { word: "ran", prob: 0.02 },
                { word: "ate", prob: 0.008 },
                { word: "...", prob: 0.002 }
              ].map((item, i) => (
                <div 
                  key={i} 
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-500 transform
                    ${activeStep >= 7 && item.highlight 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white scale-110 shadow-lg' 
                      : activeStep >= 7 
                        ? 'bg-gray-200 text-gray-700' 
                        : 'bg-gray-100 text-gray-400'}
                  `}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {item.word}: {activeStep >= 7 ? item.prob : '?'}
                </div>
              ))}
            </div>
          </div>
          {activeStep === 7 && (
            <div className="mt-6 p-4 bg-red-100 rounded-lg animate-fade-in">
              <p className="text-sm text-red-800 text-center">
                The model predicts "sat" with 89% confidence - it has learned that cats typically sit!
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-3xl shadow-2xl">
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.9; transform: scaleX(0.95); }
          50% { opacity: 1; transform: scaleX(1.05); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          GPT Architecture: Interactive Deep Dive
        </h1>
        <p className="text-lg text-gray-600">
          Watch how transformers revolutionize language understanding through parallel self-attention
        </p>
      </div>

      {/* Control Panel with enhanced styling */}
      <div className="bg-white rounded-2xl p-6 shadow-xl mb-10 sticky top-4 z-10 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pause' : 'Play'} Journey
            </button>
            <button
              onClick={() => { setActiveStep(0); setIsPlaying(false); setAttentionAnimationPhase(0); }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <RotateCcw size={20} />
              Reset
            </button>
          </div>
          <div className="text-sm text-gray-600 font-medium">
            Step {activeStep + 1} of {steps.length}: <span className="font-bold text-gray-800">{steps[activeStep]?.name}</span>
          </div>
        </div>

        {/* Enhanced step indicators */}
        <div className="flex gap-2 mt-6">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => { setActiveStep(step.id); setIsPlaying(false); }}
              className={`
                flex-1 h-3 rounded-full transition-all duration-500 relative overflow-hidden
                ${activeStep >= step.id ? 'bg-gradient-to-r from-blue-400 to-purple-400' : 'bg-gray-300'}
                ${activeStep === step.id ? 'ring-4 ring-purple-300 ring-offset-2' : ''}
              `}
              title={step.name}
            >
              {activeStep === step.id && (
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {/* Current step description */}
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 leading-relaxed">{steps[activeStep]?.description}</p>
          </div>
        </div>
      </div>

      {/* Main visualization */}
      <ArchitectureFlow />

      {/* Key insights with enhanced styling */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-blue-800">Self-Attention Magic ✨</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Each token dynamically attends to all other tokens, learning complex relationships and long-range dependencies that RNNs struggle to capture.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-100 via-green-50 to-emerald-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-green-800">Parallel Processing ⚡</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            Unlike sequential models, transformers process all positions simultaneously, enabling massive parallelization on modern GPUs.
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-100 via-purple-50 to-pink-100 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
          <h3 className="font-bold text-lg mb-3 text-purple-800">Deep Architecture 🏗️</h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            GPT stacks 12-96 transformer layers, with each layer refining representations to capture increasingly abstract linguistic patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GPTArchitectureVisualization;