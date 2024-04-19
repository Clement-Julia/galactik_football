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
        <div>
            {loading ? <p>Loading...</p> :
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
                <div className="login-box">
                    <p>Add</p>
                    <form className="mt-4" onSubmit={e => { e.preventDefault(); addRule(); }}>
                        <div className="user-box">
							<input type="text" id="ruleName" value={newRule.name} onChange={e => setNewRule({ ...newRule, name: e.target.value })} required />
                        	<label>Name</label>
                        </div>
                        <div className="user-box">
							<input type="text" id="ruleDescription" value={newRule.description} onChange={e => setNewRule({ ...newRule, description: e.target.value })} required />
                        	<label>Description</label>
                        </div>
						
						<button type="submit" className="btn">
							<span></span>
							<span></span>
							<span></span>
							<span></span>
							Submit
						</button>
                    </form>
                </div>
            </div>}
        </div>
    );
};

export default Rule;