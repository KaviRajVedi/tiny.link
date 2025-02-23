// backend/src/index.ts
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import urlRoutes from './routes/url';
import redirectRoutes from './routes/redirect';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/url', urlRoutes);
app.use('/', redirectRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
