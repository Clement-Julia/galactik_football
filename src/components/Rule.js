import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rule = () => {
    const [rules, setRules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newRule, setNewRule] = useState({ name: '', description: '' });

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

    const addRule = () => {
        axios.post('http://localhost:3001/api/rule', newRule)
            .then(response => {
                console.log(response.data.data);
                setRules([...rules, response.data.data]);
                setNewRule({ name: '', description: '' });
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const updateRule = (id, updatedRule) => {
        axios.put(`http://localhost:3001/api/rule/${id}`, updatedRule)
            .then(response => {
                setRules(rules.map(rule => (rule._id === id ? response.data : rule)));
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };

    const deleteRule = (id) => {
        axios.delete(`http://localhost:3001/api/rule/${id}`)
            .then(() => {
                setRules(rules.filter(rule => rule._id !== id));
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
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rules.map((rule, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{rule.name}</td>
                            <td>{rule.description}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => updateRule(rule._id, rule)}>
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={() => deleteRule(rule._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <form onSubmit={e => { e.preventDefault(); addRule(); }}>
                <input type="text" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} placeholder="Rule Name" required />
                <input type="text" value={newRule.description} onChange={e => setNewRule({ ...newRule, description: e.target.value })} placeholder="Rule Description" required />
                <button type="submit" className="btn btn-success">Add Rule</button>
            </form>
        </div>
    );
};

export default Rule;