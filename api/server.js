const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();


const app = express();
app.use(cors());
app.use(express.json());
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
app.use('/uploads', express.static('uploads')); // serve static files

// Routes
app.use('/api/users', require('./router/userRoutes'));
app.use('/api/banner', require('./router/bannerRoutes'));
app.use("/api/shipping", require('./router/shippingRoutes'));
// app.use('/api/categories',require('./router/categoryRoutes'));
app.use('/api/categories', require('./router/categoryRoutes'));
app.use('/api', require('./router/freshGroceryRoutes'));
app.use('/api', require('./router/storeRoutes'));
app.use('/api', require('./router/aboutTeamRoutes'));
app.use('/api', require('./router/appIntroRoutes'));
app.use('/api', require('./router/faqRoutes'));
app.use('/api', require('./router/testimonialRoutes'));
app.use('/api', require('./router/footerRoutes'));
app.use('/api', require('./router/authRoutes'));
app.use("/api", require("./router/headerrouter"));
app.use('/api/auth', require('./router/auth'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
