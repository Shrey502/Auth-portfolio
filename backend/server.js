const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db');
const { register, login } = require('./controllers/authController');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse incoming JSON

// Connect MongoDB
connectDB();

// Routes
app.post('/api/register', register);
app.post('/api/login', login);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('✅ Server and MongoDB are running...');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
