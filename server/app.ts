import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';

export const app = express();
app.use(json());
app.use(cors());
