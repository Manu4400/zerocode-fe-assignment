import express from 'express';
import session from 'express-session';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import bcrypt from 'bcrypt';

const app = express();
const users = {};

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-very-strong-secret', // Change this in production!
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  users[username] = { password: hashed };
  req.session.user = username;
  res.json({ message: 'Registered', username });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  req.session.user = username;
  res.json({ message: 'Logged in', username });
});

// Check session endpoint
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ username: req.session.user });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

// Logout endpoint
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// Chat endpoint (AI)
app.post('/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const togetherRes = await fetch('https://api.together.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer d33017896c9d0aa9d60f0a55fae1f2b9d7715ce9e17f7014d1f049ea95b77652',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "meta-llama/Llama-3-70b-chat-hf",
        messages
      })
    });
    const data = await togetherRes.json();
    if (!togetherRes.ok) {
      console.error("Together API error:", data);
      return res.status(500).json({ reply: "AI API error: " + (data.error?.message || "Unknown error") });
    }
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a reply.";
    res.json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "Error contacting AI API." });
  }
});

app.get('/', (req, res) => {
  res.send('API server running');
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));