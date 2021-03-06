const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const path = require('path');
const port = process.env.PORT || 5000;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// enable accessing env variable
require('dotenv').config();

// to remove deprecation warning -> useNewUrlParser: true
// To use the new Server Discover and Monitoring engine, pass option { useUnifiedTopology: true } to the MongoClient constructor
mongoose.connect(config.mongoURI
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('error', error));

// for queury string. Extended for removing depreciation warning
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user', require('./routes/user'));
app.use('/api/video', require('./routes/video'));
app.use('/api/subscribe', require('./routes/subscribe'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));
app.use('/api/blog', require('./routes/blog'));

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/upload', express.static('upload'));

// Helmet helps you secure your Express apps by setting various HTTP headers. 
app.use(helmet())

// Logger Middleware
app.use(morgan('dev'));

// CORS Middleware
app.use(cors());

// for deployment
if (process.env.NODE_ENV === 'production') {
  // set static folder; All JS and css files read from this folder
  app.use(express.static('frontend/build'));

  // set location for all page routes
  app.get('*', (request, response) => {
    response.sendFile(path.resolve(__dirname, '../frontend', 'build', 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});