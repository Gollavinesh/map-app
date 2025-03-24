const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

const SECRET_KEY = 'your_secure_key_123!@#';

// Mock user database
const users = [{
  id: 1,
  username: 'user',
  password: 'password' // In production, use bcrypt for hashing
}];

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    status: 'running',
    message: 'Backend server is operational'
  });
});

// Login API with enhanced validation
app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const { username, password } = req.body;
  
  if (!username?.trim() || !password?.trim()) {
    console.log('Validation failed: empty credentials');
    return res.status(400).json({ 
      success: false,
      message: 'Username and password are required' 
    });
  }

  const user = users.find(u => 
    u.username === username.trim() && 
    u.password === password.trim()
  );
  
  if (user) {
    console.log('User authenticated:', user.username);
    const token = jwt.sign({ 
      userId: user.id,
      username: user.username
    }, SECRET_KEY, { expiresIn: '1h' });
    
    return res.json({ 
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username
      }
    });
  }
  
  console.log('Authentication failed for user:', username);
  res.status(401).json({ 
    success: false,
    message: 'Invalid username or password' 
  });
});

// Protected routes middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Authorization token required' 
    });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    req.user = decoded;
    next();
  });
};

// Protected dashboard route
app.get('/api/dashboard', authenticate, (req, res) => {
  res.json({ 
    success: true,
    cards: [
      { id: 1, title: 'Location 1' },
      { id: 2, title: 'Location 2' },
      { id: 3, title: 'Location 3' }
    ],
    user: req.user
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});