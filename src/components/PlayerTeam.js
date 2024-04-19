import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlayerTeam = () => {
    const [playerList, setPlayerList] = useState([]);
    const [teams, setTeams] = useState(null);
    const [myTeams, setMyTeams] = useState([]);
    const [selectedPlayers, setSelectedPlayers] = useState(Array(11).fill(''));
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
        axios.get(`http://localhost:3001/api/team/playerTeam/${userId}`)
        .then(response => {
            setMyTeams(response.data);
            // setSelectedPlayers(response.data.players);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const playerListResponse = await axios.get(`http://localhost:3001/api/userplayer/${userId}`);
                setPlayerList(playerListResponse.data);

                const playerDataRequests = playerListResponse.data.map(async (player) => {
                    const playerDataResponse = await axios.get(`http://localhost:3001/api/player/${player.playerId}`);
                    const teamDataResponse = await axios.get(`http://localhost:3001/api/team/${playerDataResponse.data.teamId}`);
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

    const handleSelectChange = (index, event) => {
        const newSelectedPlayers = [...selectedPlayers];
        newSelectedPlayers[index] = event.target.value;
        setSelectedPlayers(newSelectedPlayers);
    };

    const handleSave = () => {
        console.log(selectedPlayers);
    };

    return(
        <div className='text-center'>
            <input type="text" className='my-4' placeholder='Team name' value={myTeams.name} />
            <br/>
            <span>Attaque</span>
            <br/>
            {Array.from({ length: 3 }, (_, i) => (
                <select key={i} className='my-4 mx-2' value={selectedPlayers[i]} onChange={(event) => handleSelectChange(i, event)}>
                    <option value="" disabled>Select a player</option>
                    {playerList.map((player, index) => (
                        <option key={index} value={player._id} disabled={selectedPlayers.includes(player._id)}>
                            {player.name}
                        </option>
                    ))}
                </select>
            ))}
            <br/>
            <span>Milieu</span>
            <br/>
            {Array.from({ length: 3 }, (_, i) => (
                <select key={i+3} className='my-4 mx-3' value={selectedPlayers[i+3]} onChange={(event) => handleSelectChange(i+3, event)}>
                    <option value="" disabled>Select a player</option>
                    {playerList.map((player, index) => (
                        <option key={index} value={player._id} disabled={selectedPlayers.includes(player._id)}>
                            {player.name}
                        </option>
                    ))}
                </select>
            ))}
            <br/>
            <span>Défenseur</span>
            <br/>
            {Array.from({ length: 4 }, (_, i) => (
                <select key={i+7} className='my-4 mx-1' value={selectedPlayers[i+7]} onChange={(event) => handleSelectChange(i+7, event)}>
                    <option value="" disabled>Select a player</option>
                    {playerList.map((player, index) => (
                        <option key={index} value={player._id} disabled={selectedPlayers.includes(player._id)}>
                            {player.name}
                        </option>
                    ))}
                </select>
            ))}
            <br/>
            <span>Gardien</span>
            <br/>
            {Array.from({ length: 1 }, (_, i) => (
                <select key={i+11} className='my-4' value={selectedPlayers[i+11]} onChange={(event) => handleSelectChange(i+11, event)}>
                    <option value="" disabled>Select a player</option>
                    {playerList.map((player, index) => (
                        <option key={index} value={player._id} disabled={selectedPlayers.includes(player.name)}>
                            {player.name}
                        </option>
                    ))}
                </select>
            ))}
            <br/>
            <button className='btn btn-success' onClick={handleSave}>Save</button>
        </div>
    )
}

export default PlayerTeam;