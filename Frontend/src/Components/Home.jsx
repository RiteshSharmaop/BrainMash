import React, { useState, useEffect } from "react";
import { Lock, MessageCircle } from "lucide-react";
import axios from "axios"
import ParticleBackground from "./Layout/ParticleBackground";
import LLMColumn from "./Chat/LLMColumn";
import Sidebar from "./Layout/Sidebar";

const Home = ({paymentDone, setPaymentDone }) => {
  const [visibleLLMs, setVisibleLLMs] = useState({
    ChatGPT: true,
    Gemini: true,
    DeepSeek: true,
    Perplexity: true,
    Lama: true,
  });

  const [messages, setMessages] = useState({
    ChatGPT: [],
    Gemini: [],
    DeepSeek: [],
    Perplexity: [],
    Lama: []
  });
  const [chatMessages, setChatMessages] = useState({
    1: { ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], Lama: [] },
    2: { ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], Lama: [] },
  });


  const [isTyping, setIsTyping] = useState({
    ChatGPT: false,
    Gemini: false,
    DeepSeek: false,
    Perplexity: false,
    Lama: false
  });

  const llmConfigs = [
    { name: 'ChatGPT', color: 'bg-green-600' , model:"openai/gpt-4o-mini"},
    { name: 'Gemini', color: 'bg-blue-600',  model:"google/gemini-2.5-flash"  },
    { name: 'DeepSeek', color: 'bg-purple-600' , model:"deepseek/deepseek-chat-v3.1" },
    { name: 'Perplexity', color: 'bg-orange-600',  model:"perplexity/sonar-pro"},
    { name: 'Lama', color: 'bg-cyan-600' ,  model:"meta-llama/llama-4-maverick" }
  ];

  const [input, setInput] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  // state for Multi-LLM messages + typing
  
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showMultiLLMBox, setShowMultiLLMBox] = useState(false);
  const [chats, setChats] = useState([
    { id: 1, title: "Chat 1", subtitle: "New Conversation" },
    { id: 2, title: "Chat 2", subtitle: "New Conversation" },
  ]);
  const [activeChat, setActiveChat] = useState(1);
  const [multiLLMMessages, setMultiLLMMessages] = useState([]);
  const [multiLLMTyping, setMultiLLMTyping] = useState(false);


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
      Lama: `Lama's insights: "${query}". Scalable solutions.`
    };
    return responses[llmName] || `Response from ${llmName}`;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!input.trim()) return;

  const userMessage = { 
    type: "user", 
    content: input, 
    time: new Date().toLocaleTimeString() 
  };

  // ✅ Add user message to all visible LLMs in current chat
  setChatMessages(prev => ({
    ...prev,
    [activeChat]: Object.fromEntries(
      Object.entries(prev[activeChat]).map(([llm, msgs]) => [
        llm,
        [...msgs, userMessage],
      ])
    ),
  }));

  // ✅ Also add to Multi-LLM (if open)
  if (showMultiLLMBox) {
    setMultiLLMMessages(prev => [...prev, userMessage]);
    setMultiLLMTyping(true);
  }

  // ✅ Set typing indicators
  setIsTyping(prev => {
    const updated = {};
    Object.keys(prev).forEach(llm => {
      updated[llm] = visibleLLMs[llm];
    });
    return updated;
  });

  try {
    const selectedLLMs = llmConfigs
      .filter(llm => visibleLLMs[llm.name])
      .map(llm => llm.model);

    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}api/chat/`,
      { 
        prompt: input, 
        selectedLLMs,
        isMultiLLM: showMultiLLMBox 
      }
    );

    const data = res.data;

    if (data.success) {
      const results = data.data.results;

      // --- Normal LLM responses ---
      llmConfigs.forEach(llm => {
        if (!visibleLLMs[llm.name]) return;
        const aiMessage = { 
          type: "ai", 
          content: results[llm.model] || "⚠️ No response", 
          time: new Date().toLocaleTimeString() 
        };
        setChatMessages(prev => ({
          ...prev,
          [activeChat]: {
            ...prev[activeChat],
            [llm.name]: [...prev[activeChat][llm.name], aiMessage],
          },
        }));
        setIsTyping(prev => ({ ...prev, [llm.name]: false }));
      });

      // --- Multi-LLM response ---
      if (showMultiLLMBox && data.data.multiLLMResponse) {
        const aiMessage = {
          type: "ai",
          content: data.data.multiLLMResponse,
          time: new Date().toLocaleTimeString(),
        };
        setMultiLLMMessages(prev => [...prev, aiMessage]);
        setMultiLLMTyping(false);
      }
    }
  } catch (err) {
    console.error("❌ Error in handleSubmit:", err);
  }

  setInput("");
};


  const handleNewChat = () => {
    const newId = Date.now();
    const newChat = { id: newId, title: `Chat ${chats.length + 1}`, subtitle: 'New Conversation' };
    
    setChats([...chats, newChat]);
    setActiveChat(newId);

    // Initialize messages for this new chat
    setChatMessages(prev => ({
      ...prev,
      [newId]: { ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], Lama: [] }
    }));
  };


  const handleDeleteChat = (chatId) => {
    if (chats.length <= 1) return;
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    if (activeChat === chatId) {
      setActiveChat(updatedChats[0].id);
      setMessages({ ChatGPT: [], Gemini: [], DeepSeek: [], Perplexity: [], Lama: [] });
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
        paymentDone={paymentDone}
        setPaymentDone={setPaymentDone}
        
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative z-10">
        




        {/* LLM Columns */}
        {/* <div
          className="flex-1 grid gap-4 p-6 overflow-hidden"
          style={{ gridTemplateColumns: `repeat(${getVisibleLLMs().length}, 1fr)` }}
        >
          {getVisibleLLMs().map((llm) => (
            <LLMColumn
              key={llm.name}
              name={llm.name}
              model={llm.model}
              color={llm.color}
              // messages={messages[llm.name]}
              messages={chatMessages[activeChat]?.[llm.name] || []}
              isTyping={isTyping[llm.name]}
              onClose={handleCloseLLM}
              isVisible={visibleLLMs[llm.name]}
            />
          ))}
        </div> */}
        
        {/* LLM Columns */}
  <div
    className="flex-1 grid gap-4 p-6 overflow-hidden"
    style={{ gridTemplateColumns: `repeat(${getVisibleLLMs().length + (showMultiLLMBox ? 1 : 0)}, 1fr)` }}
  >
    {/* Multi-LLM column appears first if enabled */}
    {showMultiLLMBox && (
      <LLMColumn
        key="Multi-LLM"
        name="Multi-LLM"
        model="multi-llm"
        color="bg-pink-600"
        messages={multiLLMMessages}
        isTyping={multiLLMTyping}
        onClose={() => setShowMultiLLMBox(false)}
        isVisible={true}
      />
    )}

    {/* Other LLMs */}
    {getVisibleLLMs().map((llm) => (
      <LLMColumn
        key={llm.name}
        name={llm.name}
        model={llm.model}
        color={llm.color}
        messages={chatMessages[activeChat]?.[llm.name] || []}
        isTyping={isTyping[llm.name]}
        onClose={handleCloseLLM}
        isVisible={visibleLLMs[llm.name]}
      />
    ))}
  </div>
          

        
        {/* Input Area */}
        <div className="p-6 border-t border-gray-700/50 bg-gray-800/30 backdrop-blur-md">
          <div className="flex gap-4">
            {/* Multi-LLM Button */}
            
           
            <button
              onClick={() => paymentDone && setShowMultiLLMBox(prev => !prev)}
              disabled={!paymentDone}
              className="relative bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Multi-LLM

              {/* Overlay */}
              {!paymentDone && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl">
                  <Lock className="text-white w-5 h-5" />
                </div>
              )}
            </button>



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
