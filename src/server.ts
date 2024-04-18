import express, { Express } from 'express';
import userPlayerRoutes from './routes/userPlayerRoutes';
import playerRoutes from './routes/playerRoutes';
import userRoutes from './routes/userRoutes';

const mongoose = require('mongoose');

const app: Express = express();
const PORT = 3000;

const uri = "mongodb+srv://user:azerty@footmanager.pqkcy3h.mongodb.net/raphael?retryWrites=true&w=majority&appName=FootManager";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
    try {
        await mongoose.connect(uri, clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error);
    }
}
run().catch(console.dir);

app.use(express.json());
app.use('/api/userplayers', userPlayerRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/user', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
