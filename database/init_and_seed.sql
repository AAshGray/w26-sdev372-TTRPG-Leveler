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

-- CREATE TABLE IF NOT EXISTS prerequisite_ability_list(
-- 	id INT AUTO_INCREMENT PRIMARY KEY,
--     skill_id INT,
--     requirement_id INT,
--     requirement_description VARCHAR(255),
--     FOREIGN KEY (skill_id) REFERENCES abilities(id),
--     FOREIGN KEY (ability_id) REFERENCES abilities(id)
-- );

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
    -- FOREIGN KEY (prerequisite_ability_id) REFERENCES prerequisite_ability_list(id)
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