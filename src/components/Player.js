import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Player = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlayer, setNewPlayer] = useState({ name: '', age: null, nationality: null, position: null, team: null});
    const [teams, setTeams] = useState([]);

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
        axios.get('http://localhost:3001/api/player')
        .then(response => {
            const playersData = response.data;
            const updatedPlayers = playersData.map(player => {
                const team = teams.find(team => team._id === player.team);
                return { ...player, team: team ? team.name : player.team };
            });
            setPlayers(updatedPlayers);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, [teams]);

    const addPlayer = () => {
        if (newPlayer.name && newPlayer.age && newPlayer.nationality && newPlayer.position && newPlayer.team) {
            axios.post('http://localhost:3001/api/player', newPlayer)
                .then(response => {
                    response.data.data.team = teams.find(team => team._id === response.data.data.team).name;
                    setPlayers([...players, response.data.data]);
                    setNewPlayer({ name: null, age: null, nationality: null, position: null, team: null});
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            alert('All fields must be filled!');
        }
    };

    const updatePlayer = (id, updatedPlayer) => {
        axios.put(`http://localhost:3001/api/player/${id}`, updatedPlayer)
            .then(response => {
                setPlayers(players.map(player => (player._id === id ? response.data : player)));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deletePlayer = (id) => {
        axios.delete(`http://localhost:3001/api/player/${id}`)
            .then(() => {
                setPlayers(players.filter(player => player._id !== id));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    return (
        loading ? <p>Loading...</p> :
        <div>
            <table className="table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Nationality</th>
                        <th>Position</th>
                        <th>Team</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {players.map((player, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{player.name}</td>
                            <td>{player.age}</td>
                            <td>{player.nationality}</td>
                            <td>{player.position}</td>
                            <td>{player.team}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => updatePlayer(player._id, player)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deletePlayer(player._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={e => { e.preventDefault(); addPlayer(); }}>
                <input type="text" value={newPlayer.name} onChange={e => setNewPlayer({ ...newPlayer, name: e.target.value })} placeholder="Player Name" required />
                <input type="number" value={newPlayer.age} onChange={e => setNewPlayer({ ...newPlayer, age: e.target.value })} placeholder="Player Age" required />
                <input type="text" value={newPlayer.nationality} onChange={e => setNewPlayer({ ...newPlayer, nationality: e.target.value })} placeholder="Player Nationality" required />
                <input type="text" value={newPlayer.position} onChange={e => setNewPlayer({ ...newPlayer, position: e.target.value })} placeholder="Player Position" required />
                <select value={newPlayer.team} onChange={e => setNewPlayer({ ...newPlayer, team: e.target.value })} required defaultValue={"0"}>
                    <option value="0">Select a team</option>
                    {teams.map((team, index) => (
                        <option key={index} value={team._id}>{team.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-success">Add Player</button>
            </form>
        </div>
    );
};

export default Player;
