import { createCharacter, findCharacterById as findCharacterByCharacterId, findAllCharactersByUserId, updateCharacter, deleteCharacter} from "../repos/characters.repo";

const characterSchema = {
    user_id: 'number',
    char_name: 'string',
    total_level: 'number',
    total_hp: 'number',
    initiative_bonus: 'number',
    strength: 'number',
    dexterity: 'number',
    constitution: 'number',
    intelligence: 'number',
    wisdom: 'number',
    charisma: 'number',
    languages: 'string',
};

const requiredFields = ['user_id', 'char_name'];

export async function createCharacterController(req, res) {
    try {
        const characterData = req.body;

        const missingFields = requiredFields.filter(field => !(field in characterData));
        if (missingFields.length > 0) {
            return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
        }

        const invalidFields = [];
        for (const [field, type] of Object.entries(characterSchema)) {
            if (field in characterData && typeof characterData[field] !== type) {
                invalidFields.push(field);
            }
        }

        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Invalid data types for fields: ${invalidFields.join(', ')}` });
        }

        const newCharacter = await createCharacter(characterData);
        res.status(201).json(newCharacter);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getCharacterByCharacterId(req, res) {
    try {
        const characterId = req.params.charId;
        if (!characterId || isNaN(characterId)) {
            return res.status(400).json({ error: 'Invalid character ID' });
        }

        const character = await findCharacterByCharacterId(characterId);

        if (character) {
            res.status(200).json(character);
        } else {
            res.status(404).json({ error: 'Character not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function getAllCharactersByUserId(req, res) {
    try {
        const userId = req.params.userId;
        if (!userId || isNaN(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }
        const characters = await findAllCharactersByUserId(userId);
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export async function updateCharacterController(req, res) {
    try {
        const characterId = req.params.id;
        const updateData = req.body;
        await updateCharacter(characterId, updateData);
        const updatedCharacter = await findCharacterByCharacterId(characterId);
        res.status(200).json(updatedCharacter);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }  
}

export async function deleteCharacterController(req, res) {
    try {
        const characterId = req.params.id;
        await deleteCharacter(characterId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}