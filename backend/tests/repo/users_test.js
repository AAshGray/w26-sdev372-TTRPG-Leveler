import db from '../../models/index.js';
import { createUser, findUserById, findUserByEmail, updateUser, deleteUser } from '../../repos/users.repo.js';
import assert from 'assert';

// Helper to generate random strings
function randomString(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

async function testUserRepository() {
  try {
    // Connect to the database
    await db.sequelize.authenticate();

    const suffix = randomString();
    const randomPass = randomString(10);

    const newUser = await createUser({
      user_name: `TestUser_${suffix}`,
      user_email: `testuser_${suffix}@example.com`,
      user_password: `${randomPass}`
    });

    assert.strictEqual(newUser.user_name, `TestUser_${suffix}`, 'User name should match');
    assert.strictEqual(newUser.user_email, `testuser_${suffix}@example.com`, 'User email should match');
    assert.strictEqual(newUser.user_password, `${randomPass}`, 'User password should match');

    const foundById = await findUserById(newUser.id);
    assert.ok(foundById, 'User should be found by ID');
    assert.strictEqual(foundById.user_name, `TestUser_${suffix}`, 'User name from findById should match');

    const foundByEmail = await findUserByEmail(newUser.user_email);
    assert.ok(foundByEmail, 'User should be found by email');
    assert.strictEqual(foundByEmail.id, newUser.id, 'IDs from findByEmail and createUser should match');

    const updatedName = `UpdatedUser_${suffix}`;
    await updateUser(newUser.id, { user_name: updatedName });
    const updatedUser = await findUserById(newUser.id);
    assert.strictEqual(updatedUser.user_name, updatedName, 'User name should be updated');

    const deletedCount = await deleteUser(newUser.id);
    assert.strictEqual(deletedCount, 1, 'Exactly 1 user should be deleted');

    const afterDelete = await findUserById(newUser.id);
    assert.strictEqual(afterDelete, null, 'User should no longer exist after deletion');

    console.log('User repository tests passed successfully');

  } catch (err) {
    console.error('User repository test failed:', err);
  } finally {
    // Close DB connection
    await db.sequelize.close();
  }
}

testUserRepository();