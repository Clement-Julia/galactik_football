import React, { useState } from 'react';
import { useLocation} from 'react-router-dom';
import axios from 'axios';

const Inscription = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [dateNaiss, setDateNaiss] = useState('');

  const location = useLocation();
  const previousPageUrl = location.state?.referrer || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/user/inscription', {
        nom:username,
        mail:mail,
        dateNaiss,
        password,
      });
    console.log('Utilisateur inscrit !', response.data);
      
    window.location.href = (previousPageUrl) ? previousPageUrl:'/';
      
      
      // Rediriger ou mettre à jour l'état de connexion ici
    } catch (error) {
      console.error('Erreur d\'inscription :', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nom d'utilisateur"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={mail}
        onChange={(e) => setMail(e.target.value)}
      />
      <input
        type="date"
        placeholder="Date de Naissance"
        value={dateNaiss}
        onChange={(e) => setDateNaiss(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default Inscription;