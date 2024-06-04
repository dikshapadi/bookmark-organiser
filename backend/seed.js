const mongoose = require('mongoose');
const Category = require('./models/Category');
require('dotenv').config();
const connectDB = require('./config/db');

// Connect to the database
connectDB();

const categories = [
  { name: 'Entertainment' },
  { name: 'Study' },
  { name: 'Work' },
  { name: 'Personal' },
  { name: 'Important' },
  { name: 'Later' },
  { name: 'Shopping' }
];

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    // Add new categories
    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedCategories();
