import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IPlayer, playerSchema } from '../models/Player';

const playerModel = mongoose.model('Player', playerSchema);
const router = Router();

/**
    * @swagger
    * /Player:
    *   get:
    *     description: Get all players
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Player'
    */
router.get('/', async (req: Request, res: Response) => {
	let allPlayers = await playerModel.find();
	res.status(200).json(allPlayers);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const player = await playerModel.findById(req.params.id);
		if (player) {
			res.status(200).json(player);
		} else {
			res.status(404).send('Player not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding player');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const player: IPlayer = req.body;
	try {
		let onePlayerModel = new playerModel({
            name: player.name,
            age: player.age,
            nationality: player.nationality,
            position: player.position,
            team: player.team
		});
		let savedPlayer = await onePlayerModel.save();
		res.status(201).send({ message: 'Player added', data: savedPlayer });
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding player');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedPlayer: IPlayer = req.body;
	try {
		await playerModel.findByIdAndUpdate(req.params.id, updatedPlayer);
		res.status(200).send('Player updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating player');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await playerModel.findByIdAndDelete(req.params.id);
		res.send('Player deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting player');
		}
	}
});

export default router