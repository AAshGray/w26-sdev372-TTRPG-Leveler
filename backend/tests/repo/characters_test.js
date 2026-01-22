import assert from 'assert';
import db from '../../models/index.js';
import { createUser, deleteUser } from '../../repos/users.repo.js';
import {
  createCharacter,
  findCharacterById,
  findAllCharactersByUserId,
  updateCharacter,
} from '../../repos/characters.repo.js';


function randomString(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

async function testCharacterRepository() {
  try {
    await db.sequelize.authenticate();

    const suffix = randomString();

    const user = await createUser({
      user_name: `TestUser_${suffix}`,
      user_email: `testuser_${suffix}@example.com`,
      user_password: 'password123'
    });

    const character = await createCharacter({
      user_id: user.id,
      char_name: `Hero_${suffix}`,
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

    assert.strictEqual(character.char_name, `Hero_${suffix}`, 'Character name should match');
    assert.strictEqual(character.user_id, user.id, 'Character user_id should match');

    const foundChar = await findCharacterById(character.id);
    assert.ok(foundChar, 'Character should exist');
    assert.strictEqual(foundChar.char_name, character.char_name, 'Character name should match from find');

    const userChars = await findAllCharactersByUserId(user.id);
    assert.ok(Array.isArray(userChars), 'Should return an array');
    assert.strictEqual(userChars.length, 1, 'There should be exactly one character for the user');
    assert.strictEqual(userChars[0].char_name, character.char_name, 'Character name should match in findAll');

    const updatedName = `SuperHero_${suffix}`;
    await updateCharacter(character.id, { char_name: updatedName });
    const updatedChar = await findCharacterById(character.id);
    assert.strictEqual(updatedChar.char_name, updatedName, 'Character name should be updated');

    await deleteUser(user.id);

    const afterDeleteChar = await findCharacterById(character.id);
    assert.strictEqual(afterDeleteChar, null, 'Character should be deleted automatically via cascade');

    console.log('Character repository test passed successfully, including findAll and cascade delete');

  } catch (err) {
    console.error('Character repository test failed:', err);
  } finally {
    await db.sequelize.close();
  }
}

testCharacterRepository();