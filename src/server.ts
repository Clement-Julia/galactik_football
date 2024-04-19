import express, { Express, Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
const mongoose = require('mongoose');
import cors from 'cors';
import tournamentRoutes from './routes/tournamentRoutes';
import playerRoutes from './routes/playerRoutes';
import teamRoutes from './routes/teamRoutes';
import matchRoutes from './routes/matchRoutes';
import ruleRoutes from './routes/ruleRoutes';
import leagueRoutes from './routes/leagueRoutes';
import scoreRoutes from './routes/scoreRoutes';

const app: Express = express()
const PORT = 3001

const uri = "mongodb+srv://user:azerty@footmanager.pqkcy3h.mongodb.net/clement?retryWrites=true&w=majority&appName=FootManager";
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

const options = {
    swaggerDefinition: {
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'This is a sample server',
        },
    },
    apis: ['./src/routes/*.ts'],
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json())
app.use(cors());
app.use('/api/tournament', tournamentRoutes)
app.use('/api/player', playerRoutes)
app.use('/api/team', teamRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/rule', ruleRoutes)
app.use('/api/league', leagueRoutes)
app.use('/api/score', scoreRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})