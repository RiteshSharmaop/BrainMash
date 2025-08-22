import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

import ParticleBackground from "./Layout/ParticleBackground";
import LLMColumn from "./Chat/LLMColumn";
import Sidebar from "./Layout/Sidebar";

const Home = () => {
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

  const [input, setInput] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: "Chat 1", subtitle: "General Discussion" },
    { id: 2, title: "Chat 2", subtitle: "Project Planning" },
  ]);
  const [activeChat, setActiveChat] = useState(1);

  const handleCloseLLM = (llmName) => {
    setVisibleLLMs(prev => ({ ...prev, [llmName]: false }));
  };

  const handleRestoreLLM = (llmName) => {
    setVisibleLLMs(prev => ({ ...prev, [llmName]: true }));
  };

  const getVisibleLLMs = () => llmConfigs.filter(llm => visibleLLMs[llm.name]);
  const getClosedLLMs = () => llmConfigs.filter(llm => !visibleLLMs[llm.name]);

  const handleMouseDown = (e) => { setIsResizing(true); e.preventDefault(); };
  const handleMouseMove = (e) => { if(!isResizing) return; const newWidth = Math.min(Math.max(200, e.clientX), 500); setSidebarWidth(newWidth); };
  const handleMouseUp = () => setIsResizing(false);

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
      ChatGPT: `ChatGPT response to: "${query}". This is a simulated response.`,
      Gemini: `Gemini's analysis of: "${query}". Detailed insights.`,
      DeepSeek: `DeepSeek's deep analysis: "${query}". Technical details.`,
      Perplexity: `Perplexity's research on: "${query}". Relevant findings.`,
      CloudSonar: `CloudSonar's insights: "${query}". Scalable solutions.`
    };
    return responses[llmName] || `Response from ${llmName}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { type: 'user', content: input, time: new Date().toLocaleTimeString() };

    setMessages(prev => {
      const updated = {};
      Object.keys(prev).forEach(llm => { updated[llm] = [...prev[llm], userMessage]; });
      return updated;
    });

    setIsTyping(prev => {
      const updated = {};
      Object.keys(prev).forEach(llm => { updated[llm] = visibleLLMs[llm]; });
      return updated;
    });

    Object.keys(messages).forEach((llmName, index) => {
      if (!visibleLLMs[llmName]) return;
      setTimeout(() => {
        const aiMessage = { type: 'ai', content: generateResponse(llmName, input), time: new Date().toLocaleTimeString() };
        setMessages(prev => ({ ...prev, [llmName]: [...prev[llmName], aiMessage] }));
        setIsTyping(prev => ({ ...prev, [llmName]: false }));
      }, (index + 1) * 1500 + Math.random() * 1000);
    });

    setInput('');
  };

  const handleNewChat = () => {
    const newChat = { id: Date.now(), title: `Chat ${chats.length + 1}`, subtitle: 'New Conversation' };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
    setMessages({ ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], CloudSonar: [] });
  };

  const handleDeleteChat = (chatId) => {
    if (chats.length <= 1) return;
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id);
      setMessages({ ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], CloudSonar: [] });
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white relative overflow-hidden">
      <ParticleBackground />

      {/* Sidebar */}
      <Sidebar
        sidebarWidth={sidebarWidth}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        handleMouseDown={handleMouseDown}
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        handleNewChat={handleNewChat}
        handleDeleteChat={handleDeleteChat}
        getClosedLLMs={getClosedLLMs}
        handleRestoreLLM={handleRestoreLLM}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        {/* LLM Columns */}
        <div
          className="flex-1 grid gap-4 p-6 overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${getVisibleLLMs().length}, 1fr)` }}
        >
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
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e)}
              placeholder="Ask all LLMs simultaneously..."
              className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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

export default Home;
