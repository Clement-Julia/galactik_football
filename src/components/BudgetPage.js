import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetPage = () => {
    const [budget, setBudget] = useState(null);
    const [playerList, setPlayerList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const userId = "66222cee9fd7ae9425e9e093";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const budgetResponse = await axios.get(`http://localhost:3001/api/user/${userId}/budget`);
                setBudget(budgetResponse.data.budget);

                const playerListResponse = await axios.get(`http://localhost:3001/api/userplayer/${userId}`);
                setPlayerList(playerListResponse.data);

                const playerDataRequests = playerListResponse.data.map(async (player) => {
                    const playerDataResponse = await axios.get(`http://localhost:3001/api/player/${player.playerId}`);
                    return playerDataResponse.data;
                });

                const playersWithData = await Promise.all(playerDataRequests);
                setPlayerList(playersWithData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/player`);
            const filteredResults = response.data.filter(player => player.name.includes(searchTerm));
    
            const searchResultsWithOwnership = filteredResults.map(player => {
                const playerIds = playerList.map(player => player._id);
                const isOwned = playerIds.includes(player._id);
                return { ...player, isOwned };
            });            
    
            setSearchResults(searchResultsWithOwnership);
        } catch (error) {
            console.error('Erreur lors de la recherche des joueurs :', error);
        }
    };

    const handleBuy = async (playerId, playerOverallRating) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user/${userId}/budget`);
            const userBudget = response.data.budget;
            const totalPrice = playerOverallRating * 100;
    
            if (totalPrice > userBudget) {
                alert("Vous n'avez pas suffisamment de budget pour acheter ce joueur.");
                return;
            }
    
            const newBudget = userBudget - totalPrice;

            await axios.put(`http://localhost:3001/api/user/${userId}/budget`, { budget: newBudget });
            await axios.post('http://localhost:3001/api/userplayer', { userId, playerId });

            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de l\'achat du joueur :', error);
        }
    };
    
    const handleSell = async (playerId, playerOverallRating) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/user/${userId}/budget`);
            const userBudget = response.data.budget;
            const newBudget = userBudget + (playerOverallRating * 100);

            await axios.put(`http://localhost:3001/api/user/${userId}/budget`, { budget: newBudget });
            await axios.delete(`http://localhost:3001/api/userplayer/${userId}/${playerId}`);
    
            window.location.reload();
        } catch (error) {
            console.error('Erreur lors de la vente du joueur :', error);
        }
    };

    return (
        <div className='container mb-5'>
            <h1 className='display-5 text-center my-4'>Budget actuel : <span className='display-4'>{budget}€</span></h1>

            <div className='d-flex mb-3'>
                <input
                    type="text"
                    className='form-control'
                    placeholder="Entrez un nom de joueur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-primary" onClick={handleSearch}>Rechercher</button>
            </div>

            <div className="d-flex flex-wrap justify-content-center mb-4">
                {searchResults.map(player => (
                    <div key={player._id} className="card col-3 m-2">
                    <div className='card-header text-center fs-4'>{player.name}</div>
                    <div className='card-body d-flex flex-wrap'>
                        <div className='col-12 d-flex justify-content-center my-1'>Id : {player._id} </div>
                        <div className='col-6 d-flex justify-content-center my-1'>{player.age} ans</div>
                        <div className='col-6 d-flex justify-content-center my-1'>Origine : {player.nationalite}</div>
                        <div className='col-12 d-flex justify-content-center my-1'>Position : {player.position}</div>
                        <div className='col-12 d-flex justify-content-center mt-2 fs-4'>Score global : {player.overallRating}</div>
                    </div>

                        {player.isOwned ? (
                            <button className='btn btn-outline-danger' onClick={() => handleSell(player._id, player.overallRating)}>Vendre ({player.overallRating * 100}€)</button>
                        ) : (
                            <button className='btn btn-outline-success' onClick={() => handleBuy(player._id, player.overallRating)}>Acheter ({player.overallRating * 100}€)</button>
                        )}
                    </div>
                ))}
            </div>

            <h2 className='display-5 text-center'>Liste des joueurs achetés :</h2>
            <div className="d-flex flex-wrap justify-content-center">
            {playerList.map(player => (
                 <div key={player._id} className="card col-5 m-2">
                 <div className='card-header text-center fs-4'>{player.name}</div>
                 <div className='card-body d-flex flex-wrap'>
                     <div className='col-12 d-flex justify-content-center my-1'>Id : {player._id} </div>
                     <div className='col-6 d-flex justify-content-center my-1'>{player.age} ans</div>
                     <div className='col-6 d-flex justify-content-center my-1'>Origine : {player.nationality}</div>
                     <div className='col-12 d-flex justify-content-center my-1'>Position : {player.position}</div>
                     <div className='col-12 d-flex justify-content-center mt-2 fs-4'>Score global : {player.overallRating}</div>
                 </div>
                    <button className='btn btn-outline-danger' onClick={() => handleSell(player._id, player.overallRating)}>Vendre ({player.overallRating * 100}€)</button>
                </div>
            ))}
            </div>
        </div>
    );
};

export default BudgetPage;
