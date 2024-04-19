import express, { Request, Response } from 'express';
import Player from '../models/Player';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (error) {
        console.error('Erreur lors de la récupération des joueurs :', error);
        res.status(500).send('Erreur lors de la récupération des joueurs');
    }
});

router.get('/search', async (req: Request, res: Response) => {
    const searchTerm = req.query.name as string;
    try {
        const players = await Player.find({ name: { $regex: searchTerm, $options: 'i' } }); // Recherche insensible à la casse
        res.json(players);
    } catch (error) {
        console.error('Erreur lors de la recherche des joueurs par nom :', error);
        res.status(500).send('Erreur lors de la recherche des joueurs par nom');
    }
});

router.get('/:playerId', async (req: Request, res: Response) => {
    const playerId = req.params.playerId;
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).send('Joueur non trouvé');
        }
        res.json(player);
    } catch (error) {
        console.error('Erreur lors de la récupération du joueur :', error);
        res.status(500).send('Erreur lors de la récupération du joueur');
    }
});

export default router;
