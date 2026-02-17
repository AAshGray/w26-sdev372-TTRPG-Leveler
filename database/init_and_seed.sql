-- Create Database
CREATE DATABASE IF NOT EXISTS ttrpg_leveler;
USE ttrpg_leveler;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    user_email VARCHAR(100) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);

-- Create Characters Table
CREATE TABLE IF NOT EXISTS characters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    char_name VARCHAR(100) NOT NULL,
    total_level INT DEFAULT 1,
    total_hp INT DEFAULT 1,
    initiative_bonus INT DEFAULT 0,
    strength INT DEFAULT 10,
    dexterity INT DEFAULT 10,
    constitution INT DEFAULT 10,
    intelligence INT DEFAULT 10,
    wisdom INT DEFAULT 10,
    charisma INT DEFAULT 10,
    languages VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create class reference table
CREATE TABLE IF NOT EXISTS class_reference (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_name VARCHAR(50) NOT NULL UNIQUE,
    class_type VARCHAR(50),
    hit_die INT NOT NULL,
    primary_stat VARCHAR(50) NOT NULL
);

-- Create Level Unlocks Table
CREATE TABLE IF NOT EXISTS level_unlocks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    level INT NOT NULL,
    unlock_type VARCHAR(50) NOT NULL,
    choice_count INT DEFAULT 1,
    config JSON,
    infoblock TEXT,
    FOREIGN KEY (class_id) REFERENCES class_reference(id) ON DELETE CASCADE
);

-- Create Skills/Spells/Abilities/Features Table
CREATE TABLE IF NOT EXISTS abilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT,
    ability_name VARCHAR(100) NOT NULL,
    ability_description TEXT,
    ability_type VARCHAR(50) NOT NULL,
    level_required INT,
    prerequisite_required BOOLEAN DEFAULT FALSE,
    prerequisite_list_id INT,
    FOREIGN KEY (class_id) REFERENCES class_reference(id) ON DELETE CASCADE
);

-- Skill/Spell/Ability/Feature Prerequisite List Table
CREATE TABLE IF NOT EXISTS ability_prerequisite_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ability_id INT NOT NULL,
    prerequisite_ability_id INT NOT NULL,
    FOREIGN KEY (ability_id) REFERENCES abilities(id) ON DELETE CASCADE,
    FOREIGN KEY (prerequisite_ability_id) REFERENCES abilities(id) ON DELETE CASCADE
);

-- Create Character Classes Table
CREATE TABLE IF NOT EXISTS character_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id INT NOT NULL,
    class_id INT NOT NULL,
    class_level INT DEFAULT 1,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES class_reference(id)
);

-- Create Character Abilities Table
CREATE TABLE IF NOT EXISTS character_abilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    character_id INT NOT NULL,
    ability_id INT NOT NULL,
    proficient BOOLEAN DEFAULT FALSE,
    proficiency_bonus INT DEFAULT 0,
    ability_level INT DEFAULT 1,
    number_of_uses INT DEFAULT 0,
    FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
    FOREIGN KEY (ability_id) REFERENCES abilities(id)
);

-- 1. Insert a test user
INSERT INTO users (user_name, user_email, user_password)
VALUES ('testuser', 'testuser@example.com', 'password123');

-- 2. Insert base class
INSERT INTO class_reference (class_name, class_type, hit_die, primary_stat)
VALUES ('Fighter', 'Martial', 10, 'STR');

-- 3. Add abilities (skills, feats, class features)
INSERT INTO abilities (class_id, ability_name, ability_description, ability_type, level_required)
VALUES
-- Class features
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Second Wind', 
 'On your turn, you can use a bonus action to regain 1d10 + fighter level HP. Once per short rest.', 
 'Class Feature', 1),

-- Fighting Styles
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Defense Fighting Style', 
 'While you are wearing armor, you gain a +1 bonus to AC.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Dueling Fighting Style', 
 'When wielding a melee weapon in one hand and no other weapons, you gain +2 to damage rolls.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Great Weapon Fighting Style', 
 'When you roll a 1 or 2 on a damage die for an attack with a two-handed weapon, you can reroll the die.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Archery Fighting Style', 
 'You gain a +2 bonus to attack rolls you make with ranged weapons.', 
 'Fighting Style', 1),

-- Saving Throws
(NULL, 'Strength Save', 'Proficiency in Strength saving throws', 'Saving Throw', 1),
(NULL, 'Dexterity Save', 'Proficiency in Dexterity saving throws', 'Saving Throw', 1),
(NULL, 'Constitution Save', 'Proficiency in Constitution saving throws', 'Saving Throw', 1),
(NULL, 'Intelligence Save', 'Proficiency in Intelligence saving throws', 'Saving Throw', 1),
(NULL, 'Wisdom Save', 'Proficiency in Wisdom saving throws', 'Saving Throw', 1),
(NULL, 'Charisma Save', 'Proficiency in Charisma saving throws', 'Saving Throw', 1),

-- Armor Proficiencies
(NULL, 'Light Armor', 'Proficiency with light armor', 'Armor Proficiency', 1),
(NULL, 'Medium Armor', 'Proficiency with medium armor', 'Armor Proficiency', 1),
(NULL, 'Heavy Armor', 'Proficiency with heavy armor', 'Armor Proficiency', 1),
(NULL, 'Shields', 'Proficiency with shields', 'Armor Proficiency', 1),

-- Weapon Proficiencies
(NULL, 'Simple Weapons', 'Proficiency with simple weapons', 'Weapon Proficiency', 1),
(NULL, 'Martial Weapons', 'Proficiency with martial weapons', 'Weapon Proficiency', 1),

-- Skills
(NULL, 'Athletics', 'Your Strength (Athletics) checks cover difficult situations you encounter while climbing, jumping, or swimming.', 'Skill', 1),
(NULL, 'Acrobatics', 'Your Dexterity (Acrobatics) checks cover your attempt to stay on your feet in tricky situations.', 'Skill', 1),
(NULL, 'Sleight of Hand', 'Your Dexterity (Sleight of Hand) checks cover picking pockets, concealing objects, and other acts of manual trickery.', 'Skill', 1),
(NULL, 'Stealth', 'Your Dexterity (Stealth) checks cover your attempt to conceal yourself from enemies, slink past guards, or move without being heard.', 'Skill', 1),
(NULL, 'Arcana', 'Your Intelligence (Arcana) checks measure your ability to recall lore about spells, magic items, eldritch symbols, and magical traditions.', 'Skill', 1),
(NULL, 'History', 'Your Intelligence (History) checks measure your ability to recall lore about historical events, legendary people, ancient kingdoms, and past disputes.', 'Skill', 1),
(NULL, 'Investigation', 'Your Intelligence (Investigation) checks help you deduce location of hidden objects, discern from appearance of a wound what kind of weapon dealt it, or determine the weakest point in a tunnel.', 'Skill', 1),
(NULL, 'Nature', 'Your Intelligence (Nature) checks measure your ability to recall lore about terrain, plants and animals, the weather, and natural cycles.', 'Skill', 1),
(NULL, 'Religion', 'Your Intelligence (Religion) checks measure your ability to recall lore about deities, rites and prayers, religious hierarchies, holy symbols, and the practices of secret cults.', 'Skill', 1),
(NULL, 'Animal Handling', 'Your Wisdom (Animal Handling) checks cover calming domesticated animals, keeping a mount from getting spooked, or intuiting an animal''s intentions.', 'Skill', 1),
(NULL, 'Insight', 'Your Wisdom (Insight) checks decide whether you can determine the true intentions of a creature, such as when searching out a lie or predicting someone''s next move.', 'Skill', 1),
(NULL, 'Medicine', 'Your Wisdom (Medicine) checks let you try to stabilize a dying companion or diagnose an illness.', 'Skill', 1),
(NULL, 'Perception', 'Your Wisdom (Perception) checks let you spot, hear, or otherwise detect the presence of something.', 'Skill', 1),
(NULL, 'Survival', 'Your Wisdom (Survival) checks cover following tracks, hunting, guiding your group, and predicting weather.', 'Skill', 1),
(NULL, 'Deception', 'Your Charisma (Deception) checks determine whether you can convincingly hide the truth, either verbally or through your actions.', 'Skill', 1),
(NULL, 'Intimidation', 'Your Charisma (Intimidation) checks cover when you influence others through overt threats or hostile actions.', 'Skill', 1),
(NULL, 'Performance', 'Your Charisma (Performance) checks determine how well you can delight an audience with music, dance, acting, storytelling, or some other form of entertainment.', 'Skill', 1),
(NULL, 'Persuasion', 'Your Charisma (Persuasion) checks cover attempts to influence someone or a group of people with tact, social graces, or good nature.', 'Skill', 1);

-- 4. Insert level unlocks for Fighter level 1
INSERT INTO level_unlocks (class_id, level, unlock_type, choice_count, config, infoblock)
VALUES
-- Ability Score Assignment at character creation - Standard Array
(NULL, 1, 'Ability Scores', 1,
 JSON_OBJECT(
     'method', 'Standard Array',
     'values', JSON_ARRAY(15, 14, 13, 12, 10, 8),
     'stats', JSON_ARRAY('Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma')
 ),
 'Assign the following values to your ability scores: 15, 14, 13, 12, 10, 8.'),

-- Ability Score Assignment at character creation - Point Buy
(NULL, 1, 'Ability Scores', 1,
 JSON_OBJECT(
     'method', 'Point Buy',
     'point_total', 27,
     'min_score', 8,
     'max_score', 15,
     'cost_table', JSON_OBJECT(
         '8', 0,
         '9', 1,
         '10', 2,
         '11', 3,
         '12', 4,
         '13', 5,
         '14', 7,
         '15', 9
     ),
     'stats', JSON_ARRAY('Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma')
 ),
 'Assign your ability scores using point buy. You have 27 points to distribute. Scores start at 8 and can go up to 15 before modifiers.'),

-- Hit Points (automatic calculation)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Hit Points', 1,
    JSON_OBJECT(
        'die', 10,
        'modifier', 'constitution'
    ),
 'Fighters start with 10 + Constitution modifier hit points at 1st level.'),

-- Second Wind class feature (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Class Feature', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Second Wind')
     ),
     'automatic', true
 ),
 'Fighters gain the Second Wind feature.'),

-- Fighting Style (choose 1)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Fighting Style', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Defense Fighting Style'),
         (SELECT id FROM abilities WHERE ability_name = 'Dueling Fighting Style'),
         (SELECT id FROM abilities WHERE ability_name = 'Great Weapon Fighting Style'),
         (SELECT id FROM abilities WHERE ability_name = 'Archery Fighting Style')
     ),
     'category', 'Fighting Style'
 ),
 'Choose a Fighting Style: Defense, Dueling, Great Weapon Fighting, or Archery.'),

-- Skill proficiencies (choose 2)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Skill Proficiency', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Athletics'),
         (SELECT id FROM abilities WHERE ability_name = 'Acrobatics'),
         (SELECT id FROM abilities WHERE ability_name = 'Intimidation'),
         (SELECT id FROM abilities WHERE ability_name = 'Perception'),
         (SELECT id FROM abilities WHERE ability_name = 'Survival')
     ),
     'category', 'Skill'
 ),
 'Choose 2 skill proficiencies from: Athletics, Acrobatics, Intimidation, Perception, or Survival.'),

-- Saving throw proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Saving Throw', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Strength Save'),
         (SELECT id FROM abilities WHERE ability_name = 'Constitution Save')
     ),
     'automatic', true
 ),
 'Fighters are proficient in Strength and Constitution saving throws.'),

-- Armor proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Armor Proficiency', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Light Armor'),
         (SELECT id FROM abilities WHERE ability_name = 'Medium Armor'),
         (SELECT id FROM abilities WHERE ability_name = 'Heavy Armor'),
         (SELECT id FROM abilities WHERE ability_name = 'Shields')
     ),
     'automatic', true
 ),
 'Fighters are proficient with all armor and shields.'),

-- Weapon proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Fighter'), 1, 'Weapon Proficiency', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons'),
         (SELECT id FROM abilities WHERE ability_name = 'Martial Weapons')
     ),
     'automatic', true
 ),
 'Fighters are proficient with simple and martial weapons.');

-- Insert "Test Hero" character
INSERT INTO characters (
    user_id, char_name, total_level, total_hp, initiative_bonus, 
    strength, dexterity, constitution, intelligence, wisdom, charisma, languages
)
VALUES (
    (SELECT id FROM users WHERE user_name = 'testuser'),
    'Test Hero',
    1,
    12, -- Hit Points = max hit die (10) + Con modifier (2)
    2,  -- Initiative bonus = Dex mod (14 -> +2)
    16, -- STR
    14, -- DEX
    14, -- CON
    10, -- INT
    12, -- WIS
    8,  -- CHA
    'Common, Elvish'
);

-- Assign "Test Hero" to Fighter class level 1
INSERT INTO character_classes (character_id, class_id, class_level)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM class_reference WHERE class_name = 'Fighter'),
    1
);

-- Class Features: Second Wind
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus, ability_level, number_of_uses)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM abilities WHERE ability_name = 'Second Wind'),
    TRUE,
    0,
    1,
    1
);

-- Fighting Style: Defense (auto-picked)
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Test Hero'),
    (SELECT id FROM abilities WHERE ability_name = 'Defense Fighting Style'),
    TRUE,
    0
);

-- Saving Throws: Strength & Constitution
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Strength Save'),
     TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Constitution Save'),
     TRUE, 0);

-- Armor Proficiencies: Light, Medium, Heavy, Shields
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Light Armor'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Medium Armor'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Heavy Armor'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Shields'), TRUE, 0);

-- Weapon Proficiencies: Simple & Martial
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Martial Weapons'), TRUE, 0);

-- Skill Proficiencies: Athletics & Perception (choose 2)
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Athletics'), TRUE, 3),
    ((SELECT id FROM characters WHERE char_name = 'Test Hero'),
     (SELECT id FROM abilities WHERE ability_name = 'Perception'), TRUE, 2);