require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const path = require('path');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');

// limit the request to prevent DOS,DDOS
const rateLimit = require('express-rate-limit');
const { SSL_OP_NO_QUERY_MTU } = require('constants');

const app = express();
const limiter = rateLimit({
  // 1 hour per window
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    useTempFiles: true,
  }),
);

//Routes

app.use('/user', require('./routes/userRouter'));
app.use('/api', require('./routes/categoryRouter'));
app.use('/api', require('./routes/uploadImage'));
app.use('/api', require('./routes/productRouter'));
app.use('/api', require('./routes/paymentRouter'));

app.use('/api', require('./routes/UploadAvatar'));

app.use('/api', require('./routes/commentRouter'));

app.use('/api', require('./routes/discountRouter'));
app.use('/api', require('./routes/conversationRouter'));

app.use('/api', require('./routes/messageRouter'));

//Connect to the database with MongoDB Atlas
const URI = process.env.MONGODB_URL;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to the database!');
  },
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

// Provide ssl certificate

// var sslServer = https.createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
//     cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
//   },
//   app,
// );
// sslServer.listen(PORT, () => console.log('Secure server '));

app.listen(PORT, () => {
  console.log(`Server is running on PORT : ${PORT} !`);
});
