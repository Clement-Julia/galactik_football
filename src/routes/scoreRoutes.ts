import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IScore, scoreSchema } from '../models/Score';

const scoreModel = mongoose.model('Score', scoreSchema);
const router = Router();

/**
    * @swagger
    * /Score:
    *   get:
    *     description: Get all scores
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Score'
    */
router.get('/', async (req: Request, res: Response) => {
	let allScores = await scoreModel.find();
	res.status(200).json(allScores);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const score = await scoreModel.findById(req.params.id);
		if (score) {
			res.status(200).json(score);
		} else {
			res.status(404).send('Score not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding score');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const score: IScore = req.body;
	try {
        const dateScore = new Date(score.dateScore);
		if (isNaN(dateScore.getTime())) {
			throw new Error('Invalid date format');
		}
		let oneScoreModel = new scoreModel({
            player: score.player,
            dateScore: dateScore
		});
		await oneScoreModel.save();
		res.status(201).send('Score added');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding score');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedScore: IScore = req.body;
	try {
		await scoreModel.findByIdAndUpdate(req.params.id, updatedScore);
		res.status(200).send('Score updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating score');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await scoreModel.findByIdAndDelete(req.params.id);
		res.send('Score deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting score');
		}
	}
});

export default router