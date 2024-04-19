import { Router, Request, Response } from "express";
import mongoose from 'mongoose';
import { IRule, ruleSchema } from '../models/Rule';

const ruleModel = mongoose.model('Rule', ruleSchema);
const router = Router();

/**
 * @swagger
 * /Rule:
 *   get:
 *     description: Retrieve all rules
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 */
router.get('/', async (req: Request, res: Response) => {
	let allRules = await ruleModel.find();
	res.status(200).json(allRules);
});

/**
 * @swagger
 * /Rule/{id}:
 *   get:
 *     description: Get a rule by ID
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
 *         description: Rule not found
 *       500:
 *         description: Error finding rule
 * 
 */
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const rule = await ruleModel.findById(req.params.id);
		if (rule) {
			res.status(200).json(rule);
		} else {
			res.status(404).send('Rule not found');
		}
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error finding rule');
		}
	}
});

/**
    * @swagger
	* /Rule:
	*   post:
	*     description: Add a new rule
	*     requestBody:
	*       required: true
	*       content:
	*         application/json
	*     responses:
	*       201:
	*         description: Rule added
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error adding rule
	* 
	*/
router.post('/', async (req: Request, res: Response) => {
	const rule: IRule = req.body;
	try {
		let oneRuleModel = new ruleModel({
			name: rule.name,
			description: rule.description
		});
		await oneRuleModel.save();
		let savedRule = await oneRuleModel.save();
		res.status(201).send({ message: 'Rule added', data: savedRule });
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error adding rule');
		}
	}
});

/**
    * @swagger
	* /Rule/{id}:
	*   put:
	*     description: Update a rule
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
	*         description: Rule updated
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error updating rule
	* 
	*/
router.put('/:id', async (req: Request, res: Response) => {
	const updatedRule: IRule = req.body;
	try {
		await ruleModel.findByIdAndUpdate(req.params.id, updatedRule);
		res.status(200).send('Rule updated');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error updating rule');
		}
	}
});

/**
    * @swagger
	* /Rule/{id}:
	*   delete:
	*     description: Delete a rule
	*     parameters:
	*       - name: id
	*         in: path
	*         required: true
	*         schema:
	*           type: string
	*     responses:
	*       200:
	*         description: Rule deleted
	*       400:
	*         description: Validation failed
	*       500:
	*         description: Error deleting rule
	*/
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		await ruleModel.findByIdAndDelete(req.params.id);
		res.send('Rule deleted');
	} catch (err) {
		if (err instanceof mongoose.Error.ValidationError) {
			res.status(400).send({ message: 'Validation failed', errors: err.errors });
		} else {
			res.status(500).send('Error deleting rule');
		}
	}
});

export default router