import express, { Request, Response } from 'express';
import UserPlayer from '../models/UserPlayer';

const router = express.Router();

router.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const userPlayers = await UserPlayer.find({ userId });
        res.json(userPlayers);
    } catch (error) {
        console.error('Erreur lors de la récupération des associations utilisateur-joueur :', error);
        res.status(500).send('Erreur lors de la récupération des associations utilisateur-joueur');
    }
});

router.post('/', async (req: Request, res: Response) => {
    const { userId, playerId } = req.body;
    try {
        const newUserPlayer = new UserPlayer({ userId, playerId });
        const savedUserPlayer = await newUserPlayer.save();
        res.status(201).json(savedUserPlayer);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'association utilisateur-joueur :', error);
        res.status(500).send('Erreur lors de l\'ajout de l\'association utilisateur-joueur');
    }
});

router.delete('/:userId/:playerId', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const playerId = req.params.playerId;
    try {
        await UserPlayer.findOneAndDelete({ userId, playerId });
        res.status(200).send('Joueur supprimé avec succès');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'association utilisateur-joueur :', error);
        res.status(500).send('Erreur lors de la suppression de l\'association utilisateur-joueur');
    }
});

export default router;
