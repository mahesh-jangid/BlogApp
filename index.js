const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// MongoDB Connection with improved error handling
const mongoURL = process.env.MONGODB_URI || "mongodb+srv://narsijangid01:12345678nj@cluster0.x8tzdfv.mongodb.net/blogapp?retryWrites=true&w=majority&appName=Cluster0";

// Connection options with timeout and retry settings
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true,
  serverSelectionTimeoutMS: 5000, // 5 second timeout for server selection
  socketTimeoutMS: 45000, // 45 second socket timeout
  connectTimeoutMS: 10000, // 10 second connection timeout
  maxPoolSize: 10,
  minPoolSize: 5,
};

// Connect to MongoDB with retry logic
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL, mongoOptions);
    console.log('✅ MongoDB connected successfully');
    
    // Log connection state
    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
    
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Security Middleware
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
});
app.use('/api/', limiter);

// Body Parser Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS Middleware - Allow multiple origins
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      // Allow Vercel preview and production domains
      if (
        !origin || 
        allowedOrigins.includes(origin) ||
        (origin && origin.includes('.vercel.app')) ||
        (process.env.NODE_ENV === 'production' && origin && new URL(origin).hostname === process.env.FRONTEND_DOMAIN)
      ) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' });
});

// 404 Route
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ MongoDB: ${mongoURL.split('@')[0]}...`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
