import mongoose from 'mongoose';
import { UserSchema } from '../models/User';
import User from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default class UserController {
    private model= mongoose.model('User', UserSchema);

    async getAllUsers() {
        try {
            const Users = await this.model.find();
            console.log(Users)
            return Users;
        } catch (error) {
            console.error('Error retrieving User:', error);
            throw error;
        }
      }
      async getUserById(UserId:string) {
        try {
            const User = await this.model.findById(UserId);
            return User;
        } catch (error) {
            console.error('Error retrieving User:', error);
            throw error;
        }
      }
      public async inscription(newUser:User){
        try {
            if (!newUser.nom || !newUser.mail || !newUser.dateNaiss || !newUser.password) {
                return { status:400,message: "Veuillez fournir tous les champs nécessaires." };
            }

            const existingUser = await this.model.findOne({ mail:newUser.mail });
            if (existingUser) {
                return { status:400, message: "Cet email est déjà utilisé." };
            }

            newUser.password = await bcrypt.hash(newUser.password, 10);

            let document = new this.model(newUser);
            let result = await document.save();
            console.log({ status:201, message: "Utilisateur enregistré avec succès.", result})
            return { status:201, message: "Utilisateur enregistré avec succès.", result};
        } catch (error) {
            console.error("Erreur lors de l'enregistrement de l'utilisateur :", error);
            return {status:500, message: "Une erreur est survenue lors de l'enregistrement de l'utilisateur." }
        }
    }
    public async connexion(mail: string, password: string){
        try {
            // Vérification des champs
            if (!mail || !password) {
                return { status: 400, message: "Veuillez fournir l'email et le mot de passe." };
            }

            // Recherche de l'utilisateur dans la base de données par son email
            const user = await this.model.findOne({ mail });
            if (!user) {
                return { status: 404, message: "Utilisateur non trouvé." };
            }

            // Vérification du mot de passe
            let isPasswordValid;
            if(typeof user.password === "string")
            {
                isPasswordValid = await bcrypt.compare(password, user.password);
            }
            
            if (!isPasswordValid) {
                return { status: 401, message: "Mot de passe incorrect." };
            }

            // Génération du jeton d'authentification (JWT)
            const token = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET || 'your-secret-key', // Clé secrète pour la signature du JWT
                { expiresIn: '1h' } // Durée de validité du jeton
            );

            return { status: 200, token, message: "Connexion réussie." , isAdmin: user.isAdmin || null};
        } catch (error) {
            console.error("Erreur lors de l'authentification de l'utilisateur :", error);
            return { status: 500, message: "Une erreur est survenue lors de l'authentification." };
        }
    }
      async  deleteUserById(UserId:string) {
        try {
            const deletedUser = await this.model.findByIdAndDelete(UserId);
            return deletedUser;
        } catch (error) {
            console.error('Error deleting User:', error);
            throw error;
        }
      }
      async updateUserById(UserId:string, updateData:User) {
        console.log(UserId,updateData);
        try {
            const updatedUser = await this.model.findByIdAndUpdate(UserId, updateData, { new: true });
            console.log('---------------------')
            console.log(updatedUser)
            console.log('---------------------')
            return updatedUser;
        } catch (error) {
            console.error('Error updating User:', error);
            throw error;
        }
      }
}