const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const responsesRouter = require('./routes/responses');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.use('/api', responsesRouter);

// Serve index.html for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✨ 4th dimension project running at http://localhost:${PORT}`);
  console.log(`\npress ctrl+c to stop the server\n`);
});
