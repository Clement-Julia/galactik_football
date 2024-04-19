import React from 'react';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            budget: 0,
            currentTeam: [],
            upcomingEvents: []
        };
    }



    render() {
        return (
            <div>
                <h1>Club Dashboard</h1>
                <h2>Budget: {this.state.budget}</h2>
                <h3>Current Team</h3>
                <ul>
                    {this.state.currentTeam.map((player, index) => <li key={index}>{player.name}</li>)}
                </ul>
                <h3>Upcoming Events</h3>
                <ul>
                    {this.state.upcomingEvents.map((event, index) => <li key={index}>{event.name}</li>)}
                </ul>
            </div>
        );
    }
}

export default Dashboard;