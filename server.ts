import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import router from './routes/index';
import cors from 'cors';
dotenv.config();

// Create an Express application
const app: Application = express();

// Define the port for the server
const port: unknown = process.env.PORT || 3000;
app.listen(port);

// Middleware to enable CORS
app.use(cors());

// Middleware to parse JSON in request bodies
app.use(express.json());


app.use('/api/v1/blog', router);


// Define a sample route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript and Express from app!!');
});


