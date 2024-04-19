import React, { useEffect, useState } from 'react';
import axios from 'axios';

const League = () => {
    const [leagues, setLeagues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newLeague, setNewLeague] = useState({ name: '', pays: '' });

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

    const addLeague = () => {
        axios.post('http://localhost:3001/api/league', newLeague)
            .then(response => {
                setLeagues([...leagues, response.data.data]);
                setNewLeague({ name: '', pays: '' });
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const updateLeague = (id, updatedLeague) => {
        axios.put(`http://localhost:3001/api/league/${id}`, updatedLeague)
            .then(response => {
                setLeagues(leagues.map(league => (league._id === id ? response.data : league)));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deleteLeague = (id) => {
        axios.delete(`http://localhost:3001/api/league/${id}`)
            .then(() => {
                setLeagues(leagues.filter(league => league._id !== id));
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
                        <th>Pays</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leagues.map((league, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{league.name}</td>
                            <td>{league.pays}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => updateLeague(league._id, league)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteLeague(league._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={e => { e.preventDefault(); addLeague(); }}>
                <input type="text" value={newLeague.name} onChange={e => setNewLeague({ ...newLeague, name: e.target.value })} placeholder="League Name" required />
                <input type="text" value={newLeague.pays} onChange={e => setNewLeague({ ...newLeague, pays: e.target.value })} placeholder="League country" required />
                <button type="submit" className="btn btn-success">Add League</button>
            </form>
        </div>
    );
};

export default League;