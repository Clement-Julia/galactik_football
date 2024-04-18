import React, { useState } from 'react';
import axios from 'axios';
import UserController from '../controller/userController';
const controller = new UserController();
const Connexion = () => {
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/user/connexion', {
        mail,
        password,
      });
      console.log('Utilisateur connecté !', response.data);
      controller.login(response.data.msg.token)
      window.location.href = '/';
      
      // Rediriger ou mettre à jour l'état de connexion ici
    } catch (error) {
      console.error('Erreur de connexion :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Mail"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default Connexion;