const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express(); // ⬅️ Обязательно ДО вызова .use()

app.use(cors());
app.use(express.json());
app.use('/api/settings', require('./Routes/settings'));
app.use('/api/auth', require('./Routes/auth'));
app.use('/api/projects', require('./Routes/projects'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server started on port 5000'));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
