const { Request, Response } = require('express');
const { db } = require('./firebaseConfig');

// Fetch all customers
const getAllCustomers = async (req, res) => {
  try {
    const customersSnapshot = await db.collection('customers').get();
    const customers = [];
    customersSnapshot.forEach((doc) => {
      customers.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
};

// Add routes for creating, updating, and deleting customers as needed

module.exports = {
  getAllCustomers,
};
