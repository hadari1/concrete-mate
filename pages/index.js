// pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'שפיר שלום! בטון לא זורקים – ממחזרים. תן לי פרטים, ואכין לך תערובת חדשה מדויקת.' }
  ]);
  const [input, setInput] = useState('');
  const [threadId, setThreadId] = useState(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, threadId })
      });

      const data = await response.json();
      if (data.threadId) setThreadId(data.threadId);
      if (data.response) {
        setMessages(prev => [...prev, { sender: 'bot', text: data.response }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'תקלה בשליחה, נסה שוב' }]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-start p-6">
      <div className="text-3xl font-bold my-4">צ'אט הבטון של שפיר</div>
      <div className="w-full max-w-2xl flex flex-col gap-2 bg-neutral-900 p-4 rounded-xl shadow-xl">
        {messages.map((msg, idx) => (
          <div key={idx} className={`p-2 rounded-xl ${msg.sender === 'bot' ? 'bg-gray-800 text-white self-start' : 'bg-blue-700 text-white self-end'}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="w-full max-w-2xl mt-4 flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-3 rounded-l-xl border-none text-black"
          placeholder="הקלד כאן..."
        />
        <button onClick={sendMessage} className="bg-blue-700 p-3 rounded-r-xl">שלח</button>
      </div>
    </div>
  );
