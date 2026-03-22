const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

const authRoutes     = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth',      authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analysis',  analysisRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'VakilAI API is running 🚀' }));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n⚖️  VakilAI Server running on port ${PORT} [${process.env.NODE_ENV}]\n`);
});