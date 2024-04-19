import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IUser, userSchema } from '../models/User';

const userModel = mongoose.model('User', userSchema);
const router = express.Router();

router.get('/:userId/budget', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.json({ budget: user.budget });
    } catch (error) {
        console.error('Erreur lors de la récupération du budget de l\'utilisateur :', error);
        res.status(500).send('Erreur lors de la récupération du budget de l\'utilisateur');
    }
});

router.put('/:userId/budget', async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const newBudget = req.body.budget;
    try {
        const user = await userModel.findByIdAndUpdate(userId, { budget: newBudget }, { new: true });
        if (!user) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.status(200).send('Budget mis à jour avec succès');
    } catch (error) {
        console.error('Erreur lors de la mise à jour du budget de l\'utilisateur :', error);
        res.status(500).send('Erreur lors de la mise à jour du budget de l\'utilisateur');
    }
});

export default router;