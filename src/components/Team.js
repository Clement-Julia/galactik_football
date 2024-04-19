import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Team = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTeam, setNewTeam] = useState({ name: '', league: null });
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/league')
        .then(response => {
            setLeagues(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/team')
        .then(response => {
            const teamsData = response.data;
            console.log(teamsData);
            const updatedTeams = teamsData.map(team => {
                const leagueNames = team.league.map(leagueId => {
                    const league = leagues.find(league => league._id === leagueId);
                    return league ? league.name : null;
                });
                return { ...team, league: leagueNames };
            });
            setTeams(updatedTeams);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, [leagues]);

    const addTeam = () => {
        if (newTeam.name && newTeam.league) {
            axios.post('http://localhost:3001/api/team', newTeam)
                .then(response => {
                    const newTeamData = response.data.data;
                    const leagueNames = newTeamData.league.map(leagueId => {
                        const league = leagues.find(league => league._id === leagueId);
                        return league ? league.name : null;
                    });
                    const updatedTeam = { ...newTeamData, league: leagueNames };
                    setTeams([...teams, updatedTeam]);
                    setNewTeam({ name: '', league: null });
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            alert('All fields must be filled!');
        }
    };

    const updateTeam = (id, updatedTeam) => {
        axios.put(`http://localhost:3001/api/team/${id}`, updatedTeam)
            .then(response => {
                setTeams(teams.map(team => (team._id === id ? response.data : team)));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deleteTeam = (id) => {
        axios.delete(`http://localhost:3001/api/team/${id}`)
            .then(() => {
                setTeams(teams.filter(team => team._id !== id));
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
                        <th>League</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {teams.map((team, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{team.name}</td>
                            <td>{team.league}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => updateTeam(team._id, team)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTeam(team._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={e => { e.preventDefault(); addTeam(); }}>
                <input type="text" value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="Team Name" required />
                <select value={newTeam.league} onChange={e => setNewTeam({ ...newTeam, league: e.target.value })} required defaultValue={"0"}>
                    <option value="0">Select a league</option>
                    {leagues.map((league, index) => (
                        <option key={index} value={league._id}>{league.name}</option>
                    ))}
                </select>
                <button type="submit" className="btn btn-success">Add Team</button>
            </form>
        </div>
    );
};

export default Team;
