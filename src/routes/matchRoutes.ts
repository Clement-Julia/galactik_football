import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IMatch, matchSchema } from '../models/Match';

const matchModel = mongoose.model('Match', matchSchema);
const router = Router();

/**
 * @swagger
 * /Match:
 *   get:
 *     description: Get all matches
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', async (req: Request, res: Response) => {
	let allMatchs = await matchModel.find();
	res.status(200).json(allMatchs);
});

/**
 * @swagger
 * /Match/{id}:
 *   get:
 *     description: Get a match by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Match not found
 *       500:
 *         description: Error finding match
 * 
 */
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

/**
    * @swagger
	* /Match:
	*   post:
	*     description: Add a new match
	*     requestBody:
	*       required: true
	*       content:
	*         application/json
	*     responses:
	*       201:
	*         description: Match added
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error adding match
	* 
	*/
router.post('/', async (req: Request, res: Response) => {
	const match: IMatch = req.body;
	try {
		let oneMatchModel = new matchModel({
            team1: match.team1,
            team2: match.team2,
            score1: match.score1,
            score2: match.score2,
			summary: match.summary,
            tournament: match.tournament
		});
		let matchSaved = await oneMatchModel.save();
		res.status(201).send({message: 'Match added', data: matchSaved});
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding match');
		}
	}
});

/**
    * @swagger
	* /Match/{id}:
	*   put:
	*     description: Update a match
	*     parameters:
	*       - name: id
	*         in: path
	*         required: true
	*         schema:
	*           type: string
	*     requestBody:
	*       required: true
	*     responses:
	*       200:
	*         description: Match updated
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error updating match
	* 
	*/
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

/**
    * @swagger
	* /Match/{id}:
	*   delete:
	*     description: Delete a match
	*     parameters:
	*       - name: id
	*         in: path
	*         required: true
	*         schema:
	*           type: string
	*     responses:
	*       200:
	*         description: Match deleted
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error deleting match
	*/
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