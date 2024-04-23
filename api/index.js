const express = require('express');
const authRoutes = require('./auth/authRoutes');
const apiRoutes = require('./apiRoutes');

const app = express();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/api', apiRoutes);

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
