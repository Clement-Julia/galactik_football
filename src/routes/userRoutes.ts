import {Router, Request, Response} from 'express';
import { UserSchema } from '../models/User';
import User from '../models/User';
import mongoose from "mongoose";
import UserController from '../controller/userController';
const router = Router();
const controller = new UserController();
const monmodel = mongoose.model('User', UserSchema);


router.get('/', (req: Request, res: Response) => {
    controller.getAllUsers().then(Users => {
        console.log('All Users:', Users);
        res.status(200).json({Users});
    })
    .catch(error => {
        console.error('Error:', error);
    });
      
})

router.get('/:id', (req: Request, res: Response) => {
    controller.getUserById(req.params.id).then(User => {
        console.log('User:', User);
        res.status(200).json({User});
      })
      .catch(error => {
        console.error('Error:', error);
      });
})


router.post('/inscription', (req: Request, res: Response) => {
    const User:User = req.body;
    controller.inscription(User).then(User =>{
      res.status(201).send({User,msg:'User ajouté'});
    }).catch(error => {
      console.log('Error', error);
    });   
})

router.post('/connexion', (req: Request, res: Response) => {
    const {mail,password} = req.body;
    console.log('mail',mail)
    console.log('password',password)
    controller.connexion(mail,password).then(User =>{
      console.log(User);
      if(User.status === 200)
        res.status(201).send({text:'User ajouté',msg:User});
      else
        res.status(User.status).send({text:User.message,})
    }).catch(error => {
      console.log('Error', error);
    });   
})


router.put('/:id', (req: Request, res: Response) => {
  console.log(req.params.id)
  console.log(req.body)
    controller.updateUserById(req.params.id, req.body as User).then(User =>{
        res.status(201).send("User mis à jour")
    }).catch(error =>{
        console.log('Error', error)
    })
})


router.delete('/:id', (req: Request, res: Response) => {
    controller.deleteUserById(req.params.id).then(User => {
        res.status(200).send('User supprimé')
      }).catch(error=>{
        console.log("Error",error);
      res.status(404).send('error');
    });
})


export default router