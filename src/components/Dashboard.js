import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [budget, setBudget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playerList, setPlayerList] = useState([]);
    const [teams, setTeams] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        axios.get('http://localhost:3001/api/team')
        .then(response => {
            setTeams(response.data);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetResponse = await axios.get(`http://localhost:3001/api/user/${userId}/budget`);
                setBudget(budgetResponse.data.budget);

                const playerListResponse = await axios.get(`http://localhost:3001/api/userplayer/${userId}`);
                setPlayerList(playerListResponse.data);

                const playerDataRequests = playerListResponse.data.map(async (player) => {
                    const playerDataResponse = await axios.get(`http://localhost:3001/api/player/${player.playerId}`);
                    const teamDataResponse = await axios.get(`http://localhost:3001/api/team/${playerDataResponse.data.team}`);
                    return {
                        ...playerDataResponse.data,
                        team: teamDataResponse.data.name
                    };
                });

                const playersWithData = await Promise.all(playerDataRequests);
                setPlayerList(playersWithData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    return(
        <div>
            <h1 className='text-center'>Dashboard</h1>
            <h2 className='mb-4 text-center'>Budget: {budget}€</h2>
            <h2>Liste des joueurs :</h2>
            <ul>
                {playerList.map((player, index) => (
                    <li key={index}>
                        <h3>{player.name}</h3>
                        <p className='mb-0'>Position: {player.position}</p>
                        <p>Team: {player.team}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard;