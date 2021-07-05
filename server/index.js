import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2';
import cors from 'cors';

import usersRoutes from './routes/users.js';
import cardsRoutes from './routes/cards.js';

import { db } from './config/db.js';

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use('/user', usersRoutes);
app.use('/cards', cardsRoutes);


const PORT = process.env.PORT || 4000;

const connection = mysql.createConnection(db);

connection.connect();
app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));