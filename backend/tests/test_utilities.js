export default function randomString(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function getTestUserInput() {
  const randomStr = randomString(6);
  const randomPass = randomString(10);

  return {
    user_name: `TestUser_${randomStr}`,
    user_email: `testuser_${randomStr}@example.com`,
    user_password: randomPass
  };
}

export function getTestCharacterInput(userId) {
  const randomStr = randomString(6);

  return {
    user_id: userId,
    char_name: `Hero_${randomStr}`,
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
  };
}

export function getTestClassInput() {
  const randomStr = randomString(6);

  return {
    class_name: `name_${randomStr}`,
    class_type: `type_${randomStr}`,
    hit_die: 10,
    primary_stat: `stat_${randomStr}`
  };
}

export function getTestAbilityInput(classId) {
  const randomStr = randomString(6);

  return {
    class_id: classId,
    ability_name: `ability_${randomStr}`,
    ability_description: `description_${randomStr}`,
    ability_type: `type_${randomStr}`,
    level_required: 1,
  };
}