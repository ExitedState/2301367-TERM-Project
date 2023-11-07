import express from 'express';
import mongoose from 'mongoose';
import ourRoutes from './routes/OurRoutes';

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = 'mongodb://localhost:27017/your-database-name';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use('/ourRoute', ourRoutes);
