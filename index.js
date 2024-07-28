import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";

const uri = "mongodb+srv://henriquebkotz:bcUrLHd4gDSh8GyW@barbearia-db.ihxjsbx.mongodb.net/?retryWrites=true&w=majority&appName=barbearia-db";

const client = new MongoClient(uri);

async function run() {
    try {
        const database = client.db('barbearia_db');
        const customers = database.collection('barbearia_tb');

        const query = { name: "Henrique Kötz" };
        const customer = await customers.findOne(query);

        console.log(customer);
    } finally {
        await client.close();
    }
}

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
    finally {
        await client.close();
    }
})

app.post('/', async (req, res) => {
    try {
        const { body } = req;

        const database = client.db('barbearia_db');
        const customers = database.collection('barbearia_tb');

        await customers.insertOne(body);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    } finally {
        await client.close();
    }
})


app.listen(5000, () => {
    console.log('Listening on port 5000...');
})

//run().catch(console.dir);