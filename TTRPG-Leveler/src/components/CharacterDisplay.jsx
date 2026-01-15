import { useState, useEffect } from 'react';
import characterController from '../controllers/CharacterController';
import './CharacterDisplay.css';

/**
 * CharacterDisplay Component
 * Displays the currently selected character
 */
function CharacterDisplay() {
    const [character, setCharacter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCharacter();
    }, []);

    const fetchCharacter = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch character with ID 1 (test character)
            const char = await characterController.getCharacter(1);
            setCharacter(char);
        } catch (err) {
            setError(err.message || 'Failed to fetch character');
            console.error('Error fetching character:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="character-display loading">
                <div className="spinner"></div>
                <p>Loading character...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="character-display error">
                <div className="error-icon">⚠️</div>
                <h2>Error Loading Character</h2>
                <p>{error}</p>
                <button onClick={fetchCharacter} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    if (!character) {
        return (
            <div className="character-display empty">
                <p>No character found</p>
            </div>
        );
    }

    const modifiers = character.getModifiers();

    const formatModifier = (mod) => {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    };

    return (
        <div className="character-display">
            <div className="character-header">
                <h1>{character.charName}</h1>
                <div className="character-basics">
                    <span className="level">Level {character.totalLevel}</span>
                    <span className="hp">HP: {character.totalHp}</span>
                    <span className="initiative">Initiative: {formatModifier(character.initiativeBonus)}</span>
                </div>
            </div>

            <div className="character-body">
                <div className="ability-scores">
                    <h2>Ability Scores</h2>
                    <div className="abilities-grid">
                        <div className="ability-card">
                            <div className="ability-name">STR</div>
                            <div className="ability-score">{character.strength}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.strength)}</div>
                        </div>

                        <div className="ability-card">
                            <div className="ability-name">DEX</div>
                            <div className="ability-score">{character.dexterity}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.dexterity)}</div>
                        </div>

                        <div className="ability-card">
                            <div className="ability-name">CON</div>
                            <div className="ability-score">{character.constitution}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.constitution)}</div>
                        </div>

                        <div className="ability-card">
                            <div className="ability-name">INT</div>
                            <div className="ability-score">{character.intelligence}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.intelligence)}</div>
                        </div>

                        <div className="ability-card">
                            <div className="ability-name">WIS</div>
                            <div className="ability-score">{character.wisdom}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.wisdom)}</div>
                        </div>

                        <div className="ability-card">
                            <div className="ability-name">CHA</div>
                            <div className="ability-score">{character.charisma}</div>
                            <div className="ability-modifier">{formatModifier(modifiers.charisma)}</div>
                        </div>
                    </div>
                </div>

                {character.languages && (
                    <div className="languages-section">
                        <h2>Languages</h2>
                        <p>{character.languages}</p>
                    </div>
                )}

                <div className="character-meta">
                    <p className="meta-item">
                        <strong>Character ID:</strong> {character.id}
                    </p>
                    <p className="meta-item">
                        <strong>User ID:</strong> {character.userId}
                    </p>
                </div>
            </div>

            <div className="character-footer">
                <button onClick={fetchCharacter} className="refresh-button">
                    🔄 Refresh
                </button>
            </div>
        </div>
    );
}

export default CharacterDisplay;
