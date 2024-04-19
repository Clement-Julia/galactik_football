// User.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const User = () => {
  const [user, setUser] = useState(null);
  const [formState, setFormState] = useState('read')
  const { userId } = useParams(); // Récupère l'ID de l'utilisateur à partir des paramètres d'URL

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/user/${userId}`); // Utilisez l'ID de l'utilisateur dans l'URL
        setUser(response.data.User);
      } catch (error) {
        console.error('Erreur lors de la récupération des informations utilisateur :', error);
      }
    };

    fetchUser();
  }, [userId]); // Assurez-vous de dépendre de userId dans le tableau des dépendances

  const setUpdateOrSave = () => {
    if(formState === "read"){
        setFormState('update')
    }else{
        axios.put('http://localhost:3001/api/user/'+user._id, user)
        .then(response => {
            console.log(response.data.data);

            setFormState('read')
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
        
    }
  }
  console.log(user);
  return (
    <div>
      <h2>Informations Utilisateur</h2>
      <button onClick={()=>{ setUpdateOrSave() }}>{formState === "read" ? "Editer" : "Sauvegarder"}</button>
      {user ? (
        formState === "read" ? (
          <div>
            <p>Nom d'utilisateur: {user.nom}</p>
            <p>Mail: {user.mail}</p>
            <p>Date de Naissance: {user.dateNaiss}</p>
            {/* Affichez d'autres informations sur l'utilisateur ici */}
          </div>
        ) : (
          <div>
            <label>Nom d'utilisateur:</label>
            <input value={user.nom}  onChange={(e) => setUser({ ...user, nom: e.target.value })}/>
            <label>Mail:</label>
            <input value={user.mail}  onChange={(e) => setUser({ ...user, mail: e.target.value })}/>
            <label>Date de Naissance :</label>
            <input type="date" value={user.dateNaiss} onChange={(e) => setUser({ ...user, dateNaiss: e.target.value })}/>
          </div>
        )
      ) : (
        <p>Chargement des informations utilisateur...</p>
      )}
    </div>
  );
  
};

export default User;
