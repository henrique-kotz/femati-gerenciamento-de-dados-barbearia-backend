import { MongoClient } from "mongodb";

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

run().catch(console.dir);