const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRoutes);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/verify/:uuid', async (req, res) => {
  try {
    const Certificate = require('./models/Certificate');
    const cert = await Certificate.findOne({ uuid: req.params.uuid, status: 'active' });
    if (!cert) return res.status(404).send('Certificate not found');
    res.render('verify', { cert });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Move DB connection and server start here
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://innovativemind0001_db_user:dsN2lTkVcxz9Ga1X@cluster0.ch7g0bc.mongodb.net/?appName=Cluster0'; // remove the hardcoded fallback

async function startServer() {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // give it 30s to connect
    });
    console.log('✅ MongoDB connected');
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // don't start the server if DB is down
  }
}

startServer();