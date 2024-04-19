import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Match = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newMatches, setNewMatches] = useState({ team1: null, team2: null, score1: [], score2: [], summary: '', tournament: '' });
    const [teams, setTeams] = useState([]);
    const [scores, setScores] = useState([]);
    const [players, setPlayers] = useState([]);
    const [tournaments, setTournaments] = useState([]);

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
        axios.get('http://localhost:3001/api/score')
        .then(response => {
            setScores(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/player')
        .then(response => {
            setPlayers(response.data);
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
            setTournaments(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:3001/api/match')
        .then(response => {
            const matchesData = response.data;
            const updatedMatches = matchesData.map(match => {
                const team1Name = teams.find(team => team._id === match.team1)?.name;
                const team2Name = teams.find(team => team._id === match.team2)?.name;
                const tournamentName = tournaments.find(tournament => tournament._id === match.tournament)?.name;
                const summaryWithBreaks = match.summary.replace(/Team/g, '<br />- Team');

                return { ...match, team1: team1Name, team2: team2Name, tournament: tournamentName, summary: summaryWithBreaks };
            });
            setMatches(updatedMatches);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error!', error);
            setLoading(false);
        });
    }, [teams, scores, tournaments]);

    return (
        loading ? <p>Loading...</p> :
        <div className="accordion" id="matchAccordion">
            {matches.map((match, index) => (
                <div className="accordion-item" key={index}>
                    <h2 className="accordion-header" id={`heading${index}`}>
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse${index}`} aria-expanded="true" aria-controls={`collapse${index}`}>
                            {match.team1} vs {match.team2} - {match.tournament}
                        </button>
                    </h2>
                    <div id={`collapse${index}`} className="accordion-collapse collapse" aria-labelledby={`heading${index}`} data-bs-parent="#matchAccordion">
                        <div className="accordion-body">
                            <div dangerouslySetInnerHTML={{ __html: match.summary }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Match;
