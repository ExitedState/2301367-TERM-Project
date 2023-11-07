import express from 'express';
import YourModel from '../models/OurModel';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await YourModel.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error!" });
  }
});

// Add more routes for creating, updating, and deleting data as needed

export default router;
