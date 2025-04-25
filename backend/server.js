const express = require('express');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('Server is working!');
});

// Test POST route
app.post('/test', (req, res) => {
  const { message } = req.body;
  res.json({ response: `Received message: ${message}` });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
