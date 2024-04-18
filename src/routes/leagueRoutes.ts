import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { ILeague, leagueSchema } from '../models/League';

const leagueModel = mongoose.model('League', leagueSchema);
const router = Router();

/**
    * @swagger
    * /League:
    *   get:
    *     description: Get all leagues
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/League'
    */
router.get('/', async (req: Request, res: Response) => {
	let allLeagues = await leagueModel.find();
	res.status(200).json(allLeagues);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const league = await leagueModel.findById(req.params.id);
		if (league) {
			res.status(200).json(league);
		} else {
			res.status(404).send('League not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding league');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const league: ILeague = req.body;
	try {
		let oneLeagueModel = new leagueModel({
			name: league.name,
			pays: league.pays,
		});
		await oneLeagueModel.save();
		res.status(201).send('League added');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding league');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedLeague: ILeague = req.body;
	try {
		await leagueModel.findByIdAndUpdate(req.params.id, updatedLeague);
		res.status(200).send('League updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating league');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await leagueModel.findByIdAndDelete(req.params.id);
		res.send('League deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting league');
		}
	}
});

export default router