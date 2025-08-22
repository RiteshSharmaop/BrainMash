import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Plus, Sparkles, Crown, Settings, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3a 100%)' }}
    />
  );
};

const LLMColumn = ({ name, color, messages, isTyping, onClose, isVisible }) => {
  const getIcon = (llmName) => {
    const icons = {
      'ChatGPT': '🤖',
      'Gemini': '💎',
      'DeepSeek': '🔍',
      'Perplexity': '🧠',
      'CloudSonar': '☁️'
    };
    return icons[llmName] || '🤖';
  };

  if (!isVisible) return null;

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-sm  rounded-xl border border-gray-700/50 overflow-hidden">
      <div className={`p-4 border-b border-gray-700/50 ${color} flex items-center justify-between rounded-t-xl`}>
        <h3 className="font-semibold text-white flex items-center gap-2">
          <span className="text-xl">{getIcon(name)}</span>
          {name}
        </h3>
        <button
          onClick={() => onClose(name)}
          className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-1 transition-all"
        >
          <X size={16} />
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              message.type === 'user'
                ? 'bg-blue-600 text-white ml-6'
                : 'bg-gray-800 text-gray-100 mr-6'
            }`}
          >
            <div className="text-sm">{message.content}</div>
            <div className="text-xs opacity-70 mt-1">{message.time}</div>
          </div>
        ))}
        
        {isTyping && (
          <div className="bg-gray-800 text-gray-100 mr-6 p-3 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatHistory = ({ chats, activeChat, onSelectChat, onNewChat, onDeleteChat }) => {
  return (
    <div className="space-y-2">
      <button
        onClick={onNewChat}
        className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
      >
        <Plus size={18} />
        <span>New Chat</span>
      </button>
      
      <div className="space-y-1">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`group relative rounded-lg transition-colors ${
              activeChat === chat.id
                ? 'bg-purple-600/20 border border-purple-500/30'
                : 'hover:bg-gray-700/30'
            }`}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeChat === chat.id
                  ? 'text-purple-300'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="font-medium text-sm pr-8">{chat.title}</div>
              <div className="text-xs opacity-70 mt-1">{chat.subtitle}</div>
            </button>
            
            {chats.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 p-1 rounded transition-all"
                title="Delete chat"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const Home2 = () => {
  const [input, setInput] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: 'Chat 1', subtitle: 'General Discussion' },
    { id: 2, title: 'Chat 2', subtitle: 'Project Planning' },
    { id: 3, title: 'Chat 3', subtitle: 'Code Review' }
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [visibleLLMs, setVisibleLLMs] = useState({
    ChatGPT: true,
    Gemini: true,
    DeepSeek: true,
    Perplexity: true,
    CloudSonar: true
  });
  const [messages, setMessages] = useState({
    ChatGPT: [],
    Gemini: [],
    DeepSeek: [],
    Perplexity: [],
    CloudSonar: []
  });
  const [isTyping, setIsTyping] = useState({
    ChatGPT: false,
    Gemini: false,
    DeepSeek: false,
    Perplexity: false,
    CloudSonar: false
  });

  const llmConfigs = [
    { name: 'ChatGPT', color: 'bg-green-600' },
    { name: 'Gemini', color: 'bg-blue-600' },
    { name: 'DeepSeek', color: 'bg-purple-600' },
    { name: 'Perplexity', color: 'bg-orange-600' },
    { name: 'CloudSonar', color: 'bg-cyan-600' }
  ];

  const handleCloseLLM = (llmName) => {
    setVisibleLLMs(prev => ({
      ...prev,
      [llmName]: false
    }));
  };

  const handleRestoreLLM = (llmName) => {
    setVisibleLLMs(prev => ({
      ...prev,
      [llmName]: true
    }));
  };

  const getVisibleLLMs = () => {
    return llmConfigs.filter(llm => visibleLLMs[llm.name]);
  };

  const getClosedLLMs = () => {
    return llmConfigs.filter(llm => !visibleLLMs[llm.name]);
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    const newWidth = Math.min(Math.max(200, e.clientX), 500);
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isResizing]);

  const generateResponse = (llmName, query) => {
    const responses = {
      ChatGPT: `ChatGPT response to: "${query}". This is a simulated response with helpful information and suggestions.`,
      Gemini: `Gemini's analysis of: "${query}". Here's my perspective with detailed insights and recommendations.`,
      DeepSeek: `DeepSeek's deep analysis: "${query}". Providing comprehensive technical details and explanations.`,
      Perplexity: `Perplexity's research on: "${query}". Here are the most relevant findings with sources and citations.`,
      CloudSonar: `CloudSonar's cloud-based insights: "${query}". Offering scalable solutions and best practices.`
    };
    return responses[llmName] || `Response from ${llmName}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      time: new Date().toLocaleTimeString()
    };

    // Add user message to all LLMs
    setMessages(prev => {
      const updated = {};
      Object.keys(prev).forEach(llm => {
        updated[llm] = [...prev[llm], userMessage];
      });
      return updated;
    });

    // Set typing indicators for visible LLMs only
    setIsTyping(prev => {
      const updated = {};
      Object.keys(prev).forEach(llm => {
        updated[llm] = visibleLLMs[llm];
      });
      return updated;
    });

    // Simulate LLM responses with different delays for visible LLMs only
    Object.keys(messages).forEach((llmName, index) => {
      if (!visibleLLMs[llmName]) return;
      
      setTimeout(() => {
        const aiMessage = {
          type: 'ai',
          content: generateResponse(llmName, input),
          time: new Date().toLocaleTimeString()
        };

        setMessages(prev => ({
          ...prev,
          [llmName]: [...prev[llmName], aiMessage]
        }));

        setIsTyping(prev => ({
          ...prev,
          [llmName]: false
        }));
      }, (index + 1) * 1500 + Math.random() * 1000);
    });

    setInput('');
  };

  const handleNewChat = () => {
    const newChat = {
      id: Date.now(), // Use timestamp for unique ID
      title: `Chat ${chats.length + 1}`,
      subtitle: 'New Conversation'
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
    
    // Clear messages
    setMessages({
      ChatGPT: [],
      Gemini: [],
      DeepSeek: [],
      Perplexity: [],
      CloudSonar: []
    });
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length <= 1) return; // Don't delete the last chat
    
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    // If deleting the active chat, switch to the first available chat
    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id);
      // Clear messages when switching to a different chat
      setMessages({
        ChatGPT: [],
        Gemini: [],
        DeepSeek: [],
        Perplexity: [],
        CloudSonar: []
      });
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />
      
      {/* Sidebar */}
      <div 
        className="bg-gray-800/30 backdrop-blur-md border-r border-gray-700/50 flex flex-col relative z-10 transition-all duration-300"
        style={{ 
          width: sidebarCollapsed ? '60px' : `${sidebarWidth}px`,
          minWidth: sidebarCollapsed ? '60px' : '200px'
        }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 -right-3 bg-gray-700 hover:bg-gray-600 text-white rounded-full p-1 z-20 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRight size={26} className='cursor-pointer' /> : <ChevronLeft size={26} className='cursor-pointer' />}
        </button>

        {!sidebarCollapsed && (
          <>
            {/* Header */}
            <div className="p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Sparkles size={18} className="text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  20,000,000 ka Startup
                </h1>
              </div>
              
              {/* Upgrade Plan */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={16} className="text-yellow-400" />
                  <span className="font-semibold text-sm">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Unlock unlimited queries and advanced features
                </p>
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm py-2 px-4 rounded-lg transition-all">
                  Upgrade Now
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4 overflow-y-auto">
              <ChatHistory
                chats={chats}
                activeChat={activeChat}
                onSelectChat={setActiveChat}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
              />
            </div>

            {/* Closed LLMs Section */}
            {getClosedLLMs().length > 0 && (
              <div className="p-4 border-t border-gray-700/50">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Closed LLMs</h3>
                <div className="space-y-2">
                  {getClosedLLMs().map((llm) => (
                    <button
                      key={llm.name}
                      onClick={() => handleRestoreLLM(llm.name)}
                      className="w-full text-left p-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700/30 rounded-lg transition-colors flex items-center justify-between"
                    >
                      <span>{llm.name}</span>
                      <Plus size={14} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {sidebarCollapsed && (
          <div className="p-2 flex flex-col items-center gap-4 mt-16">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <button
              onClick={handleNewChat}
              className="w-8 h-8 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        )}

        {/* Resize Handle */}
        {!sidebarCollapsed && (
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-purple-500/50 transition-colors"
            onMouseDown={handleMouseDown}
          />
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* LLM Columns */}
        <div className="flex-1 grid gap-4 p-6" style={{ gridTemplateColumns: `repeat(${getVisibleLLMs().length}, 1fr)` }}>
          {getVisibleLLMs().map((llm) => (
            <LLMColumn
              key={llm.name}
              name={llm.name}
              color={llm.color}
              messages={messages[llm.name]}
              isTyping={isTyping[llm.name]}
              onClose={handleCloseLLM}
              isVisible={visibleLLMs[llm.name]}
            />
          ))}
          
          {getVisibleLLMs().length === 0 && (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-400 mb-4">All LLMs are closed</h3>
                <p className="text-gray-500 mb-6">Restore some LLMs from the sidebar to start chatting</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {llmConfigs.map((llm) => (
                    <button
                      key={llm.name}
                      onClick={() => handleRestoreLLM(llm.name)}
                      className={`px-4 py-2 rounded-lg text-white transition-all hover:scale-105 ${llm.color}`}
                    >
                      Restore {llm.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                placeholder="Ask all LLMs simultaneously..."
                className="w-full bg-gray-700/50 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-medium transition-all disabled:cursor-not-allowed flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home2;