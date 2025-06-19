const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const multer = require('multer');
const session = require("express-session");


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/vehicles'),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });
app.locals.upload = upload;

 
const mongoose = require("mongoose");
require('dotenv').config();
// DB Connection
mongoose.connect(process.env.CONNECTION_STRING,{
     useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ DB Connection Error:', err));
console.log("Mongo URI:", process.env.CONNECTION_STRING);


// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // serve /css, /js, /assets
app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,
  saveUninitialized: false
}));
 
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});


// EJS & Layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Routes
const landingPageRoute = require('./routes/landingPage');
app.use('/', landingPageRoute);
const authRoutes = require('./routes/auth');
app.use('/', authRoutes);
const cartRoutes = require('./routes/cart');
app.use('/', cartRoutes);
const productRoutes = require('./routes/products');
app.use('/', productRoutes);
const orderRoutes = require('./routes/order');
app.use('/', orderRoutes);
const adminRoutes = require('./routes/admin'); 
app.use(adminRoutes); 
const vehicleRoutes = require('./routes/vehicle');
app.use('/', vehicleRoutes);






// Start
app.listen(3000, () => console.log('Server running on http://localhost:5000'));
