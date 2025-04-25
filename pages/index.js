
import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'שפיר שלום! בטון לא זורקים – ממחזרים. תן לי פרטים, ואכין לך תערובת חדשה.' }]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: 'user', text: input }]);

    const res = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { from: 'bot', text: data.message }]);
    setInput('');
  };

  return (
    <div dir="rtl" style={{ backgroundColor: '#0d1117', color: 'white', minHeight: '100vh', fontFamily: 'Arial' }}>
      <Head>
        <title>ConcreteMate | שפיר</title>
      </Head>
      <header style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#004080' }}>
        <img src="/logo.svg" alt="שפיר לוגו" style={{ height: '60px' }} />
      </header>
      <main style={{ padding: '2rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ textAlign: msg.from === 'bot' ? 'right' : 'left', margin: '0.5rem 0' }}>
              <span style={{ background: msg.from === 'bot' ? '#0070f3' : '#333', padding: '0.5rem 1rem', borderRadius: '1rem', display: 'inline-block' }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <input style={{ flex: 1, padding: '0.5rem', borderRadius: '1rem', border: '1px solid #ccc' }} value={input} onChange={(e) => setInput(e.target.value)} placeholder="כתוב כאן..." />
          <button style={{ padding: '0.5rem 1rem', borderRadius: '1rem', backgroundColor: '#0070f3', color: 'white', border: 'none' }} onClick={sendMessage}>שלח</button>
        </div>
      </main>
    </div>
  );
}
