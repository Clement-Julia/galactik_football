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
 */
router.get('/', async (req: Request, res: Response) => {
	let allLeagues = await leagueModel.find();
	res.status(200).json(allLeagues);
});

/**
 * @swagger
 * /League/{id}:
 *   get:
 *     description: Get a league by ID
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
 *         description: League not found
 *       500:
 *         description: Error finding league
 * 
 */
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

/**
    * @swagger
	* /League:
	*   post:
	*     description: Add a new league
	*     requestBody:
	*       required: true
	*       content:
	*         application/json
	*     responses:
	*       201:
	*         description: League added
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error adding league
	* 
	*/
router.post('/', async (req: Request, res: Response) => {
	const league: ILeague = req.body;
	try {
		let oneLeagueModel = new leagueModel({
			name: league.name,
			pays: league.pays,
		});
		let savedLeague = await oneLeagueModel.save();
		res.status(201).send({ message: 'League added', data: savedLeague });
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding league');
		}
	}
});

/**
    * @swagger
	* /League/{id}:
	*   put:
	*     description: Update a league
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
	*         description: League updated
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error updating league
	* 
	*/
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

/**
    * @swagger
	* /League/{id}:
	*   delete:
	*     description: Delete a league
	*     parameters:
	*       - name: id
	*         in: path
	*         required: true
	*         schema:
	*           type: string
	*     responses:
	*       200:
	*         description: League deleted
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error deleting league
	*/
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