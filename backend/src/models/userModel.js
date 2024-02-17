const mongoose = require('mongoose');

require('dotenv').config();

const dbConnection = `mongodb://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`;

mongoose.connect(dbConnection, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.error('MongoDB connection error:', err));

const invoiceSchema = new mongoose.Schema({
  invoiceName: String,
  date: Date,
  amount: Number,
});

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roomNumber: Number,
  isAdmin: { type: Boolean, default: false },
  temperature: Number,
  humidity: Number,
  invoices: [invoiceSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
