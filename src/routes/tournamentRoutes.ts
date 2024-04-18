import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { ITournament, tournamentSchema } from '../models/Tournament';

const tournamentModel = mongoose.model('Tournament', tournamentSchema);
const router = Router();

/**
    * @swagger
    * /Tournament:
    *   get:
    *     description: Get all tournaments
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Tournament'
    */
router.get('/', async (req: Request, res: Response) => {
	let allTournaments = await tournamentModel.find();
	res.status(200).json(allTournaments);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const tournament = await tournamentModel.findById(req.params.id);
		if (tournament) {
			res.status(200).json(tournament);
		} else {
			res.status(404).send('Tournament not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding tournament');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const tournament: ITournament = req.body;
	try {
		let oneTournamentModel = new tournamentModel({
            name: tournament.name,
            teams: tournament.teams,
            rules: tournament.rules,
            winner: tournament.winner,
            league: tournament.league
		});
		await oneTournamentModel.save();
		res.status(201).send('Tournament added');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding tournament');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedTournament: ITournament = req.body;
	try {
		await tournamentModel.findByIdAndUpdate(req.params.id, updatedTournament);
		res.status(200).send('Tournament updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating tournament');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await tournamentModel.findByIdAndDelete(req.params.id);
		res.send('Tournament deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting tournament');
		}
	}
});

export default router