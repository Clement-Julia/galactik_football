import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdministrationUser = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:3000/api/user/')
        .then(response => {
            console.log(response.data);
            setUsers(response.data.Users);
            setLoading(false);
            console.log(users);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

    const deleteUser = (id) => {
        axios.delete(`http://localhost:3000/api/user/${id}`)
            .then(() => {
                setUsers(users.filter(user => user._id !== id));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };
    const handleGoToInscription = () => {
        const previousPageUrl = location.state?.referrer || '/';
        navigate('/inscription', { state: { referrer: previousPageUrl } });
      };
    return (
        loading ? <p>Loading...</p> :
        <div>
            <h4>Liste des Utilisateurs :</h4>
            <button className="nav-item" onClick={ () => { handleGoToInscription() }}>
                    Ajout d'Utilisateur
            </button>
            <div>
                {users.map((user,idx)=>{
                    return  (<div key={idx}>
                        <h4>{user.nom}</h4>
                        <div>
                            <h5>{user.mail}</h5>
                            <h5>{user.dateNaiss}</h5>
                        </div>
                        <div>
                            <button><Link  to={"/user/"+user._id} >Consulter</Link></button>
                            <button onClick={() => {deleteUser(user._id)}}>Delete</button>
                        </div>
                    </div>);
                })}
            </div>
        </div>
    );
};

export default AdministrationUser;