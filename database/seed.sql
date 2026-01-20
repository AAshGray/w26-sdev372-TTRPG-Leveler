-- 1. Insert a test user
INSERT INTO users (user_name, user_email, user_password)
VALUES ('testuser', 'testuser@example.com', 'password123');

-- 2. Insert class reference
INSERT INTO class_reference (class_name, class_type, hit_die, primary_stat)
VALUES ('Fighter', 'Martial', 10, 'STR');

-- 3. Insert a level 1 character linked to the user
INSERT INTO characters (
    user_id, char_name, total_level, total_hp, initiative_bonus, 
    strength, dexterity, constitution, intelligence, wisdom, charisma, languages
)
VALUES (
    (SELECT id FROM users WHERE user_name = 'testuser'),
    'Test Hero',
    1,
    12,
    2,
    16,
    14,
    14,
    10,
    12,
    8,
    'Common, Elvish'
);

-- 4. Add abilities (skills, feats, class features)
INSERT INTO abilities (class_id, ability_name, ability_description, ability_type, level_required)
VALUES
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Second Wind', 
 'On your turn, you can use a bonus action to regain 1d10 + fighter level HP. Once per short rest.', 
 'Class Feature', 1),
(NULL, 'Perception', 'You are proficient in noticing details around you.', 'Skill', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Longsword Mastery', 
 'You gain proficiency with longswords and deal an extra 1d4 damage on crits.', 
 'Feat', 1);

-- 5. Assign the character to Fighter class level 1
INSERT INTO character_classes (character_id, class_id, class_level)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM class_reference WHERE class_name = 'Fighter'),
    1
);

-- 6. Link abilities to the character
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus, ability_level, number_of_uses)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM abilities WHERE ability_name = 'Second Wind'),
    FALSE,
    0,
    1,
    1
);

INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus, ability_level, number_of_uses)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM abilities WHERE ability_name = 'Perception'),
    TRUE,
    2,
    1,
    NULL
);

INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus, ability_level, number_of_uses)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM abilities WHERE ability_name = 'Longsword Mastery'),
    FALSE,
    0,
    1,
    NULL
);