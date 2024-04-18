import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IMatch, matchSchema } from '../models/Match';

const matchModel = mongoose.model('Match', matchSchema);
const router = Router();

/**
    * @swagger
    * /Match:
    *   get:
    *     description: Get all matchs
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Match'
    */
router.get('/', async (req: Request, res: Response) => {
	let allMatchs = await matchModel.find();
	res.status(200).json(allMatchs);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const match = await matchModel.findById(req.params.id);
		if (match) {
			res.status(200).json(match);
		} else {
			res.status(404).send('Match not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding match');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const match: IMatch = req.body;
	try {
		let oneMatchModel = new matchModel({
            team1: match.team1,
            team2: match.team2,
            score1: match.score1,
            score2: match.score2,
            tournament: match.tournament
		});
		await oneMatchModel.save();
		res.status(201).send('Match added');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding match');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedMatch: IMatch = req.body;
	try {
		await matchModel.findByIdAndUpdate(req.params.id, updatedMatch);
		res.status(200).send('Match updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating match');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await matchModel.findByIdAndDelete(req.params.id);
		res.send('Match deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting match');
		}
	}
});

export default router