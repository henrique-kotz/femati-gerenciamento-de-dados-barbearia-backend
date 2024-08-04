import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const database = client.db('barbearia_db');
        const customers = database.collection('barbearia_tb');

        const cursor = customers.find();

        const data = [];
        for await (const doc of cursor) {
            data.push(doc);
        }

        res.send(data);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})

app.post('/', async (req, res) => {
    try {
        const { body } = req;
        const { name, phone } = body;

        const database = client.db('barbearia_db');
        const customers = database.collection('barbearia_tb');

        const existingCustomer = await customers.findOne({ name: body.name });
        if (existingCustomer) return res.sendStatus(400);
        
        const nameRegex = "^[a-z A-Z]{4,40}$";
        const phoneRegex = "^[0-9]{11}$";
        const trimmedName = name.trim();

        const validName = trimmedName.match(nameRegex);
        const validPhone = phone.match(phoneRegex);
        if (!validName || !validPhone) return res.sendStatus(400);


        await customers.insertOne(body);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
})


app.listen(5000, () => {
    console.log('Listening on port 5000...');
})