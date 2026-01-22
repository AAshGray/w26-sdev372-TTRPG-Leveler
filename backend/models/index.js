import {sequelize} from '../config/database.js';

import defineAbilities from './abilities.js';
import defineAbilityPrerequisiteList from './ability_prerequisite_list.js';
import defineCharacterAbilities from './character_abilities.js';
import defineCharacterClasses from './character_classes.js';
import defineCharacters from './characters.js';
import defineClassReference from './class_reference.js';
import defineUsers from './users.js';

const Abilities = defineAbilities(sequelize);
const AbilityPrerequisiteList = defineAbilityPrerequisiteList(sequelize);
const CharacterAbilities = defineCharacterAbilities(sequelize);
const CharacterClasses = defineCharacterClasses(sequelize);
const Characters = defineCharacters(sequelize);
const ClassReference = defineClassReference(sequelize);
const Users = defineUsers(sequelize);

const db = {
    sequelize,
    Abilities,
    AbilityPrerequisiteList,
    CharacterAbilities,
    CharacterClasses,
    Characters,
    ClassReference,
    Users
}

Users.hasMany(Characters, { foreignKey: 'user_id', as: 'characters' });
Characters.belongsTo(Users, { foreignKey: 'user_id', as: 'user' });

ClassReference.hasMany(Abilities, { foreignKey: 'class_id', as: 'abilities' });
Abilities.belongsTo(ClassReference, { foreignKey: 'class_id', as: 'class_reference' });

Characters.hasMany(CharacterClasses, { foreignKey: 'character_id', as: 'character_classes' });
CharacterClasses.belongsTo(Characters, { foreignKey: 'character_id', as: 'character' });

CharacterClasses.belongsTo(ClassReference, { foreignKey: 'class_id', as: 'class_reference' });
ClassReference.hasMany(CharacterClasses, { foreignKey: 'class_id', as: 'character_classes' });

Characters.hasMany(CharacterAbilities, { foreignKey: 'character_id', as: 'character_abilities' });
CharacterAbilities.belongsTo(Characters, { foreignKey: 'character_id', as: 'character' });

CharacterAbilities.belongsTo(Abilities, { foreignKey: 'ability_id', as: 'ability' });
Abilities.hasMany(CharacterAbilities, { foreignKey: 'ability_id', as: 'character_abilities' });

export default db;