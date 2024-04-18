import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { ITeam, teamSchema } from '../models/Team';

const teamModel = mongoose.model('Team', teamSchema);
const router = Router();

/**
    * @swagger
    * /Team:
    *   get:
    *     description: Get all teams
    *     responses:
    *       200:
    *         description: Success
    *         schema:
    *           type: array
    *           items:
    *             $ref: '#/definitions/Team'
    */
router.get('/', async (req: Request, res: Response) => {
	let allTeams = await teamModel.find();
	res.status(200).json(allTeams);
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const team = await teamModel.findById(req.params.id);
		if (team) {
			res.status(200).json(team);
		} else {
			res.status(404).send('Team not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding team');
		}
	}
});

router.post('/', async (req: Request, res: Response) => {
	const team: ITeam = req.body;
	try {
		let oneTeamModel = new teamModel({
            name: team.name,
            league: team.league,
		});
		await oneTeamModel.save();
		res.status(201).send('Team added');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding team');
		}
	}
});

router.put('/:id', async (req: Request, res: Response) => {
	const updatedTeam: ITeam = req.body;
	try {
		await teamModel.findByIdAndUpdate(req.params.id, updatedTeam);
		res.status(200).send('Team updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating team');
		}
	}
});

router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await teamModel.findByIdAndDelete(req.params.id);
		res.send('Team deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting team');
		}
	}
});

export default router