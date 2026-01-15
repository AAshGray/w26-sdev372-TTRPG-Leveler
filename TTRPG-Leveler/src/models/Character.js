/**
 * Character Model
 * SQL -> API
 * works for now, should prolly have more eventually. :D
 */
class Character {
    constructor(data = {}) {
        this.id = data.id || null;
        this.userId = data.user_id || data.userId || null;
        this.charName = data.char_name || data.charName || '';
        this.totalLevel = data.total_level || data.totalLevel || 1;
        this.totalHp = data.total_hp || data.totalHp || 1;
        this.initiativeBonus = data.initative_bonus || data.initiativeBonus || 0; 
        this.strength = data.strength || 10;
        this.dexterity = data.dexterity || 10;
        this.constitution = data.constitution || 10;
        this.intelligence = data.intelligence || 10;
        this.wisdom = data.wisdom || 10;
        this.charisma = data.charisma || 10;
        this.languages = data.languages || '';
    }

    /**
     * Grabs everything from the SQL database and returns it as an object.
     * We then use all the variables here. Thumbs up.
     */
    toAPI() {
        return {
            id: this.id,
            user_id: this.userId,
            char_name: this.charName,
            total_level: this.totalLevel,
            total_hp: this.totalHp,
            initative_bonus: this.initiativeBonus,
            strength: this.strength,
            dexterity: this.dexterity,
            constitution: this.constitution,
            intelligence: this.intelligence,
            wisdom: this.wisdom,
            charisma: this.charisma,
            languages: this.languages
        };
    }

    /**
     * Calculate ability modifier from ability score.
     */
    static getModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    /**
     * fetchers
     */
    getModifiers() {
        return {
            strength: Character.getModifier(this.strength),
            dexterity: Character.getModifier(this.dexterity),
            constitution: Character.getModifier(this.constitution),
            intelligence: Character.getModifier(this.intelligence),
            wisdom: Character.getModifier(this.wisdom),
            charisma: Character.getModifier(this.charisma)
        };
    }

    /**
     * validation for when we eventually do create/update
     */
    validate() {
        const errors = [];

        if (!this.charName || this.charName.trim() === '') {
            errors.push('Character name is required');
        }

        if (this.totalLevel < 1 || this.totalLevel > 20) {
            errors.push('Total level must be between 1 and 20');
        }

        if (this.totalHp < 1) {
            errors.push('Total HP must be at least 1');
        }

        const abilityScores = [
            this.strength, this.dexterity, this.constitution,
            this.intelligence, this.wisdom, this.charisma
        ];

        for (const score of abilityScores) {
            if (score < 1 || score > 30) {
                errors.push('Ability scores must be between 1 and 30');
                break;
            }
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
}

export default Character;
