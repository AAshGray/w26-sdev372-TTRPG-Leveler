import { Link } from 'react-router-dom';

/**
 * CharacterCard Component
 * Displays a character summary card for the character list
 */
function CharacterCard({ character }) {
    // Generate a placeholder icon color based on character id
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c'];
    const iconColor = colors[character.id % colors.length];

    return (
        <Link to={`/character/${character.id}`} className="character-card">
            <div 
                className="character-icon" 
                style={{ backgroundColor: iconColor }}
            >
                {character.charName.charAt(0).toUpperCase()}
            </div>
            <div className="character-info">
                <h3 className="character-name">{character.charName}</h3>
                <div className="character-stats">
                    <span className="stat">Level {character.totalLevel}</span>
                    <span className="stat">HP: {character.totalHp}</span>
                </div>
            </div>
        </Link>
    );
}

export default CharacterCard;
