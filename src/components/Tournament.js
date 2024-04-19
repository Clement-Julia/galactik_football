import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tournament = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newTournament, setNewTournament] = useState({ name: '', teams: [], rules: [], winner: null, league: null});
    const [rules, setRules] = useState([]);
    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:3001/api/rule')
        .then(response => {
            setRules(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

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
            setTeams(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/tournament')
        .then(response => {
            const tournamentsData = response.data;
            const updatedTournaments = tournamentsData.map(tournament => {
                const teamsNames = tournament.teams.map(teamsId => {
                    const team = teams.find(team => team._id === teamsId);
                    return team ? team.name : null;
                }).join(' - ');

                const rulesNames = tournament.rules.map(ruleId => {
                    const rule = rules.find(rule => rule._id === ruleId);
                    return rule ? rule.name : null;
                }).join(' - ');

                const winnerName = teams.find(team => team._id === tournament.winner)?.name || 'Pas encore défini';

                const leagueName = leagues.find(league => league._id === tournament.league)?.name || 'Pas défini';

                return { ...tournament, teams: teamsNames, rules: rulesNames, winner: winnerName, league: leagueName};
            });
            setTournaments(updatedTournaments);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, [leagues, teams, rules]);

    const addTournament = () => {
        if (newTournament.name && newTournament.league) {
            axios.post('http://localhost:3001/api/tournament', newTournament)
                .then(response => {
                    const newTournamentData = response.data.data;
                    console.log(newTournamentData);
                    
                    const teamsNames = newTournamentData.teams.map(teamsId => {
                        const team = teams.find(team => team._id === teamsId);
                        return team ? team.name : null;
                    }).join(' - ');

                    const rulesNames = newTournamentData.rules.map(ruleId => {
                        const rule = rules.find(rule => rule._id === ruleId);
                        return rule ? rule.name : null;
                    }).join(' - ');

                    const winnerName = teams.find(team => team._id === newTournamentData.winner)?.name || 'Pas encore défini';

                    const leagueName = leagues.find(league => league._id === newTournamentData.league)?.name || 'Pas défini';

                    const updatedTournament = { ...newTournamentData, teams: teamsNames, rules: rulesNames, winner: winnerName, league: leagueName};
                    
                    setTournaments([...tournaments, updatedTournament]);
                    setNewTournament({ name: '', teams: [], rules: [], winner: null, league: null});
                })
                .catch(error => {
                    console.error('There was an error!', error);
                });
        } else {
            alert('All fields must be filled!');
        }
    };

    const updateTournament = (id, updatedTournament) => {
        axios.put(`http://localhost:3001/api/tournament/${id}`, updatedTournament)
            .then(response => {
                setTournaments(tournaments.map(tournament => (tournament._id === id ? response.data : tournament)));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deleteTournament = (id) => {
        axios.delete(`http://localhost:3001/api/tournament/${id}`)
            .then(() => {
                setTournaments(tournaments.filter(tournament => tournament._id !== id));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const runTournament = (id) => {
        axios.post(`http://localhost:3001/api/tournament/run/${id}`)
            .then((response) => {
                const updatedTournament = tournaments.find(tournament => tournament._id === id);
                if (updatedTournament) {
                    updatedTournament.winner = response.data.winner.name;
                    setTournaments(tournaments.map(tournament => (tournament._id === id ? updatedTournament : tournament)));
                }
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
                        <th>Teams</th>
                        <th>Rules</th>
                        <th>Winner</th>
                        <th>League</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tournaments.map((tournament, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{tournament.name}</td>
                            <td>{tournament.teams}</td>
                            <td>{tournament.rules}</td>
                            <td>{tournament.winner}</td>
                            <td>{tournament.league}</td>
                            <td>
                                {(!tournament.winner || tournament.winner === "Pas encore défini") && (
                                    <button className="btn btn-success btn-sm" onClick={() => runTournament(tournament._id)}>
                                        <i className="fa-solid fa-play"></i>
                                    </button>
                                )}
                                <button className="btn btn-primary btn-sm" onClick={() => updateTournament(tournament._id, tournament)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteTournament(tournament._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={e => { e.preventDefault(); addTournament(); }}>
                <input type="text" value={newTournament.name} onChange={e => setNewTournament({ ...newTournament, name: e.target.value })} placeholder="Tournament Name" required />
                <select value={newTournament.teams} onChange={e => setNewTournament({ ...newTournament, teams: Array.from(e.target.selectedOptions, option => option.value) })} required multiple>
                    {teams.map((team, index) => (
                        <option key={index} value={team._id}>{team.name}</option>
                    ))}
                </select>
                <select value={newTournament.rules} onChange={e => setNewTournament({ ...newTournament, rules: Array.from(e.target.selectedOptions, option => option.value) })} required multiple>
                    {rules.map((rule, index) => (
                        <option key={index} value={rule._id}>{rule.name}</option>
                    ))}
                </select>
                <select value={newTournament.league} onChange={e => setNewTournament({ ...newTournament, league: e.target.value })} required defaultValue={"0"}>
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

export default Tournament;
