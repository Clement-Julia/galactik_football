import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { ITournament, tournamentSchema } from '../models/Tournament';
import { ITeam, teamSchema } from '../models/Team';
import { IPlayer, playerSchema } from '../models/Player';
import { IMatch, matchSchema } from '../models/Match';
import { IScore, scoreSchema } from '../models/Score';

const tournamentModel = mongoose.model('Tournament', tournamentSchema);
const teamModel = mongoose.model('Team', teamSchema);
const playerModel = mongoose.model('Player', playerSchema);
const matchModel = mongoose.model('Match', matchSchema);
const scoreModel = mongoose.model('Score', scoreSchema);
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
		let savedTournament = await oneTournamentModel.save();
		res.status(201).send({ message: 'Tournament added', data: savedTournament });
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

router.post('/run/:id', async (req: Request, res: Response) => {
	try {
		const id = req.params.id;
		let teams = await getTeamsInTournament(id);

		while (teams.length > 1) {
			const matches = [];

			for (let i = 0; i < teams.length; i++) {
				const team1 = await teamModel.findById(teams[i]);
				const team2 = await teamModel.findById(teams[i + 1]);
				if (team1 !== null && team2 !== null) {
					const match = await createMatch(team1, team2, id);
					matches.push(match);
					teams = teams.filter(team => team !== team1._id.toString() && team !== team2._id.toString());
					i++;
				}
			}

			for (const match of matches) {
				const winner = await runMatch(match);
				teams.push(winner);
			}
		}

		const tournamentWinner = await teamModel.findById(teams[0]);
		if (tournamentWinner) {
			await setTournamentWinner(id, tournamentWinner);
		}
		res.status(200).send({message: 'Tournament finished', winner: tournamentWinner});
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send({message :'Error running tournament', error: err});
		}
	}
});

async function getTeamsInTournament(id: string) {
	try {
		const tournament = await tournamentModel.findById(id);
		if (!tournament) {
			throw new Error('Tournament not found');
		}
		return tournament.teams.map((teamId) => teamId.toString());
	} catch (err) {
		throw new Error('Error fetching teams from tournament');
	}
}

async function createMatch(team1: mongoose.Document, team2: mongoose.Document, tournamentId: string) {
	const tournament = await tournamentModel.findById(tournamentId);

	const match = new matchModel({
		team1: team1,
		team2: team2,
		score1: [],
		score2: [],
		summary: '',
		tournament: tournament
	});

	await match.save();
	return match;
}

async function runMatch(match: mongoose.Document) {
	let scoresTeam1 = await generateScores(match.get('team1'));
	let scoresTeam2 = await generateScores(match.get('team2'));

	while (scoresTeam1.length === scoresTeam2.length) {
		scoresTeam1 = await generateScores(match.get('team1'));
		scoresTeam2 = await generateScores(match.get('team2'));
	}

	match.set('score1', scoresTeam1);
	match.set('score2', scoresTeam2);

	let summary = '';
	scoresTeam1.forEach(score => {
		summary += `Team 1 scored at minute ${score.get('dateScore').getMinutes()} by player ${score.get('player').name}\n`;
	});
	scoresTeam2.forEach(score => {
		summary += `Team 2 scored at minute ${score.get('dateScore').getMinutes()} by player ${score.get('player').name}\n`;
	});

	match.set('summary', summary);

	await matchModel.findByIdAndUpdate(match._id, match);

	const winner = scoresTeam1.length > scoresTeam2.length ? match.get('team1') : match.get('team2');

	return winner;
}

async function generateScores(team: mongoose.Document) {
	const scores: mongoose.Document[] = [];
	const maxMinutes = 90;

	let lastGoalMinute = 0;

	const players = await playerModel.find({ team: team._id, position: { $ne: 'GARDIEN' } });

	while (lastGoalMinute < maxMinutes) {
		const nextGoalMinute = lastGoalMinute + 20 + Math.floor(Math.random() * 10);

		if (nextGoalMinute <= maxMinutes) {
			const randomPlayer = players[Math.floor(Math.random() * players.length)];

			const score = new scoreModel({
				player: randomPlayer,
				dateScore: new Date(2022, 0, 1, 0, nextGoalMinute)
			});
			await score.save();
			scores.push(score);
		}

		lastGoalMinute = nextGoalMinute;
	}

	return scores;
}


async function setTournamentWinner(tournamentId: string, winner: mongoose.Document) {
	const tournament = await tournamentModel.findById(tournamentId);
	if (tournament) {
		tournament.winner = winner._id;
		await tournament.save();
	}
}

export default router;