import { useState, useEffect } from 'react';
import characterController from '../controllers/CharacterController';
import CharacterCard from './CharacterCard';
import './CharacterList.css';

/**
 * CharacterList Component
 * Displays all characters in a grid layout
 */
function CharacterList() {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCharacters();
    }, []);

    const fetchCharacters = async () => {
        try {
            setLoading(true);
            setError(null);
            const chars = await characterController.getAllCharacters();
            setCharacters(chars);
        } catch (err) {
            setError(err.message || 'Failed to fetch characters');
            console.error('Error fetching characters:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="character-list loading">
                <p>Loading characters...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="character-list error">
                <h2>Error Loading Characters</h2>
                <p>{error}</p>
                <button onClick={fetchCharacters}>Retry</button>
            </div>
        );
    }

    if (characters.length === 0) {
        return (
            <div className="character-list empty">
                <h2>No Characters Found</h2>
                <p>You don't have any characters yet.</p>
            </div>
        );
    }

    return (
        <div className="character-list">
            <h2>Your Characters</h2>
            <div className="character-grid">
                {characters.map(character => (
                    <CharacterCard key={character.id} character={character} />
                ))}
            </div>
        </div>
    );
}

export default CharacterList;
