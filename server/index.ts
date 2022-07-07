import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import functionsRoutes from './routes/functions.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ['http://localhost:4200', 'http://127.0.0.1:4200'] }));

app.use('/functions', functionsRoutes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
