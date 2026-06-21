require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const todoRoutes = require('./routes/todoRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5005;

// Connect to MongoDB
connectDB();

// Middleware
const clientUrl = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.replace(/\/$/, '') 
  : 'http://localhost:5173';

app.use(cors({
  origin: [clientUrl, `${clientUrl}/`, 'http://localhost:5173', 'http://localhost:5173/'],
  credentials: true,
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Remdo API is running' });
});
app.use('/api/todos', todoRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
