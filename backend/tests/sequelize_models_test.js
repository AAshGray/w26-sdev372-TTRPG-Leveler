import { sequelize } from '../config/database.js';
import db from '../models/index.js';
import randomString from '../test_utilities.js';

async function testTTRPGModels() {
  try {
    await sequelize.authenticate();

    const user = await db.Users.create({
      user_name: `testuser_${randomString()}`,
      user_email: `testuser_${randomString()}@Player.com`,
      user_password: 'password123'
    });

    const fighterClass = await db.ClassReference.create({
      class_name: `testclass_${randomString()}`,
      class_type: 'Martial',
      hit_die: 10,
      primary_stat: 'STR'
    });

    const character = await db.Characters.create({
      user_id: user.id,
      char_name: 'Test Hero',
      total_level: 1,
      total_hp: 12,
      initiative_bonus: 2,
      strength: 16,
      dexterity: 14,
      constitution: 14,
      intelligence: 10,
      wisdom: 12,
      charisma: 8,
      languages: 'Common, Elvish'
    });

    const abilities = await Promise.all([
      db.Abilities.create({
        class_id: fighterClass.id,
        ability_name: 'Second Wind',
        ability_description: 'On your turn, you can use a bonus action to regain 1d10 + fighter level HP. Once per short rest.',
        ability_type: 'Class Feature',
        level_required: 1
      }),
      db.Abilities.create({
        class_id: null,
        ability_name: 'Perception',
        ability_description: 'You are proficient in noticing details around you.',
        ability_type: 'Skill',
        level_required: 1
      }),
      db.Abilities.create({
        class_id: fighterClass.id,
        ability_name: 'Longsword Mastery',
        ability_description: 'You gain proficiency with longswords and deal an extra 1d4 damage on crits.',
        ability_type: 'Feat',
        level_required: 1
      })
    ]);

    const charClass = await db.CharacterClasses.create({
      character_id: character.id,
      class_id: fighterClass.id,
      class_level: 1
    });

    const charAbilities = await Promise.all([
      db.CharacterAbilities.create({
        character_id: character.id,
        ability_id: abilities[0].id,
        proficient: false,
        proficiency_bonus: 0,
        ability_level: 1,
        number_of_uses: 1
      }),
      db.CharacterAbilities.create({
        character_id: character.id,
        ability_id: abilities[1].id,
        proficient: true,
        proficiency_bonus: 2,
        ability_level: 1,
        number_of_uses: null
      }),
      db.CharacterAbilities.create({
        character_id: character.id,
        ability_id: abilities[2].id,
        proficient: false,
        proficiency_bonus: 0,
        ability_level: 1,
        number_of_uses: null
      })
    ]);

    console.log('TTRPG model test completed');

  } catch (err) {
    console.error('Model test failed:', err);
  } finally {
    await sequelize.close();
  }
}

testTTRPGModels();