import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Hi! I'm your Financial AI Assistant. I can help you with:\n\n💡 Spending insights\n📊 Budget advice\n🎯 Expense tracking tips\n💰 Financial management\n\nWhat would you like help with?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Greeting responses
    if (lowerMessage.includes('hi') || lowerMessage.includes('hello')) {
      return "👋 Hey there! How can I help you today? Ask me about budgeting, expense tracking, or financial tips!";
    }

    // Budget-related
    if (lowerMessage.includes('budget')) {
      return "📊 Budget Tips:\n\n✅ Set realistic monthly limits\n✅ Review weekly spending\n✅ Create category limits\n✅ Set alert thresholds at 80%\n✅ Track progress regularly\n\nWant help setting yours up?";
    }

    // Spending advice
    if (lowerMessage.includes('spend') || lowerMessage.includes('money')) {
      return "💰 Smart Spending Tips:\n\n💡 50/30/20 Rule:\n- 50% Essential (bills, food)\n- 30% Wants (entertainment)\n- 20% Savings\n\n📝 Track every transaction\n🎯 Identify spending patterns\n⚠️ Cut unnecessary expenses";
    }

    // Saving advice
    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
      return "🏦 Saving Strategies:\n\n✅ Start small (10% income)\n✅ Automate transfers\n✅ Reduce discretionary spending\n✅ Set specific goals\n✅ Track progress monthly\n✅ Use the 'pay yourself first' method\n\nTry setting a savings goal!";
    }

    // Category help
    if (lowerMessage.includes('category')) {
      return "🏷️ Expense Categories:\n\n🍔 Food - Groceries & dining\n✈️ Travel - Transport & trips\n📋 Bills - Utilities & subscriptions\n🛍️ Shopping - Clothes & items\n🎬 Entertainment - Movies, games\n🏥 Health - Medical & wellness\n📚 Education - Courses & books\n📌 Other - Miscellaneous";
    }

    // Features
    if (lowerMessage.includes('feature') || lowerMessage.includes('how')) {
      return "🎯 App Features:\n\n📊 Dashboard: View overview\n💰 Transactions: Track expenses\n💵 Budget: Set & monitor limits\n👤 Profile: Manage settings\n📈 Analytics: Spending insights\n🔐 Security: Secure JWT auth\n\nWhich feature would you like to learn about?";
    }

    // General financial wisdom
    if (lowerMessage.includes('advice') || lowerMessage.includes('help') || lowerMessage.includes('tip')) {
      return "💡 Financial Wisdom:\n\n✅ Live below your means\n✅ Build emergency fund\n✅ Invest in yourself\n✅ Avoid impulse buying\n✅ Review spending monthly\n✅ Plan for future\n✅ Diversify income\n✅ Learn financial literacy\n\nStart with tracking expenses - that's the first step!";
    }

    // How to use features
    if (lowerMessage.includes('transaction')) {
      return "💳 Adding Transactions:\n\n1️⃣ Go to Transactions page\n2️⃣ Click 'Add Transaction'\n3️⃣ Enter amount & description\n4️⃣ Select category\n5️⃣ Choose type (expense/income)\n6️⃣ Set date\n7️⃣ Save\n\nEasy! Try adding one now!";
    }

    // Default response
    return "🤖 I'm your Financial AI Assistant! I can help with:\n\n💡 Budgeting advice\n📊 Spending tips\n💰 Financial management\n🎯 Expense tracking\n\nTry asking about 'budget', 'spending', 'saving', or 'categories'!";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 600);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#0d7377',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(13, 115, 119, 0.4)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          transform: isOpen ? 'scale(1.1)' : 'scale(1)',
        }}
        title="Chat with AI Assistant"
      >
        🤖
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            width: '400px',
            maxHeight: '600px',
            borderRadius: '16px',
            backgroundColor: 'white',
            boxShadow: '0 8px 32px rgba(13, 115, 119, 0.2)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#0d7377',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>
                💡 AI Financial Assistant
              </h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                Always here to help
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '20px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: msg.sender === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                    backgroundColor: msg.sender === 'user' ? '#0d7377' : '#f0f0f0',
                    color: msg.sender === 'user' ? 'white' : '#333',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordWrap: 'break-word',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px 12px 12px 4px',
                    backgroundColor: '#f0f0f0',
                    color: '#999',
                  }}
                >
                  🤖 Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #e0e0e0',
              display: 'flex',
              gap: '8px',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              style={{
                flex: 1,
                padding: '10px 12px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                outline: 'none',
              }}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '10px 16px',
                backgroundColor: '#0d7377',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: loading || !input.trim() ? 0.6 : 1,
                transition: 'all 0.3s ease',
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
