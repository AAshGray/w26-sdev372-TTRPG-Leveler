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
VALUES 
('Fighter', 'Martial', 10, 'STR'),
('Wizard', 'Arcane', 6, 'INT'),
('Cleric', 'Divine', 8, 'WIS');

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
 'Archery Fighting Style', 
 'You gain a +2 bonus to attack rolls you make with ranged weapons.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Blind Fighting', 
 'You have blindsight with a range of 10 feet. Within that range, you can effectively see anything that is not behind total cover. Moreover, you can see an invisible creature within that range, unless they successfully hide from you.', 
 'Fighting Style', 1),
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
 'Interception', 
 'When a creature you can see hits a target other than you within 5 feet, you can use your reaction to reduce the damage the target takes by 1d10 + your profiecency bonus (to a minimum of 0 damage). You must have a shield, simple, or martial weapon to use this reaction.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Protection', 
 'When a creature you can see attacks a target other than you that is within 5 feet of you, you can use your reaction to impose disadvantage on the attack roll. You must be wielding a shield.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Superior Technique', 
 'You learn one maneuver of your choice from the Battle Master subclass. You also gain one superiority die, a d6, which resets on a rest.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Thrown Weapon Fighting', 
 'When you hit with a thrown weapon, you gain +2 to damage rolls. You can draw a weapon as part of the attack.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Two-Weapon fighting', 
 'When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack.', 
 'Fighting Style', 1),
((SELECT id FROM class_reference WHERE class_name = 'Fighter'),
 'Unarmed Fighting', 
 'Your unarmed strikes can deal bludgeoning damage equal to 1d6 + your Strength modifier. If you are not weilding any weaposn or a shield, your d6 becomes a d8. At the start of each of your turns, you can deal 1d4 bludgeoning damage to one creature you are grappling.', 
 'Fighting Style', 1)


-- Wizard Features
((SELECT id FROM class_reference WHERE class_name = 'Wizard'),
 'Spellcasting (Wizard)', 
 'You can cast arcane spells using Intelligence as your spellcasting ability.', 
 'Class Feature', 1),
((SELECT id FROM class_reference WHERE class_name = 'Wizard'),
 'Spellbook', 
 'At first level, you have a spellbook containing six 1st-level spells of your choice. Your spellbook is the repository of the wizards spells you know', 
 'Class Feature', 1),
((SELECT id FROM class_reference WHERE class_name = 'Wizard'),
 'Arcane Recovery', 
 'Once per day on a short rest, you can recover spell slots with a combined level equal to half your wizard level (rounded up).', 
 'Class Feature', 1),
 
-- Cleric Features
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Spellcasting (Cleric)', 
 'You can cast divine spells using Wisdom as your spellcasting ability.', 
 'Class Feature', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Divine Domain', 
 'Choose one domain related to your deity. Your choice grants you domain spells and other features.', 
 'Class Feature', 1),

-- Cleric Domains
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Arcana Domain', 
 'The Arcana domain focuses on the study and use of magic.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Death Domain', 
 'The Death domain is about the power of death and undeath.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Forge Domain', 
 'The Forge domain is all about artisan work, from the humble smith to the master artificer.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Grave Domain', 
 'The Grave domain watches over the line between life and death.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Knowledge Domain', 
 'The Knowledge domain is about the pursuit of knowledge and wisdom.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Life Domain', 
 'The Life domain focuses on the vibrant positive energy that sustains all life.', 
 'Subclass', 1),
 ((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Light Domain', 
 'The Light domain is aobut rebirth, renewal, truth and beauty.', 
 'Subclass', 1),
 ((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Nature Domain', 
 'The Nature domain is about the power of nature, the changing of seasons, and natural processes.', 
 'Subclass', 1),
 ((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Order Domain', 
 'The Order domain is about the power of order and law.', 
 'Subclass', 1),
 ((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Peace Domain', 
 'The Peace domain thrives at the heart of healthy communities.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Tempest Domain', 
 'The Tempest domain is about the magnitude of storms and the fury of the elements.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Trickery Domain', 
 'The Trickery domain is about the power of trickery and illusion.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'Twilight Domain', 
 'The Twilight domain is about the power of twilight and the transition between light and darkness.', 
 'Subclass', 1),
((SELECT id FROM class_reference WHERE class_name = 'Cleric'),
 'War Domain', 
 'The War domain is about the nobility of battle and the strength of arms.', 
 'Subclass', 1),

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

-- 4.1. Insert level unlocks for Fighter level 1
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
     'ability_ids', (
         SELECT JSON_ARRAYAGG(id) 
         FROM abilities 
         WHERE class_id = (SELECT id FROM class_reference WHERE class_name = 'Fighter')
         AND ability_type = 'Fighting Style'
     ),
     'category', 'Fighting Style'
 ),
 'Choose a Fighting Style from your class list.'),

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

-- 4.2. Insert level unlocks for Wizard level 1
INSERT INTO level_unlocks (class_id, level, unlock_type, choice_count, config, infoblock)
VALUES
-- Hit Points
((SELECT id FROM class_reference WHERE class_name = 'Wizard'), 1, 'Hit Points', 1,
    JSON_OBJECT(
        'die', 6,
        'modifier', 'intelligence'
    ),
 'Wizards start with 6 + Intelligence modifier hit points at 1st level.'),

-- Arcane Recovery, Spellcasting, Spellbook (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Wizard'), 1, 'Class Feature', 1,
 JSON_OBJECT(
     'ability_ids', (
         SELECT JSON_ARRAYAGG(id) 
         FROM abilities 
         WHERE class_id = (SELECT id FROM class_reference WHERE class_name = 'Wizard')
         AND ability_type = 'Class Feature'
         AND level_required = 1
     ),
     'automatic', true
 ),
 'Wizards gain their starting class features.'),

-- Saving throw proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Wizard'), 1, 'Saving Throw', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Intelligence Save'),
         (SELECT id FROM abilities WHERE ability_name = 'Wisdom Save')
     ),
     'automatic', true
 ),
 'Wizards are proficient in Intelligence and Wisdom saving throws.'),

-- Weapon proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Wizard'), 1, 'Weapon Proficiency', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons')
     ),
     'automatic', true
 ),
 'Wizards are proficient with simple weapons.'),

-- Skill proficiencies (choose 2)
((SELECT id FROM class_reference WHERE class_name = 'Wizard'), 1, 'Skill Proficiency', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Arcana'),
         (SELECT id FROM abilities WHERE ability_name = 'History'),
         (SELECT id FROM abilities WHERE ability_name = 'Insight'),
         (SELECT id FROM abilities WHERE ability_name = 'Investigation'),
         (SELECT id FROM abilities WHERE ability_name = 'Medicine'),
         (SELECT id FROM abilities WHERE ability_name = 'Religion')
     ),
     'category', 'Skill'
 ),
 'Choose 2 skill proficiencies from: Arcana, History, Insight, Investigation, Medicine, or Religion.');

-- 4.3. Insert level unlocks for Cleric level 1
INSERT INTO level_unlocks (class_id, level, unlock_type, choice_count, config, infoblock)
VALUES
-- Hit Points
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Hit Points', 1,
    JSON_OBJECT(
        'die', 8,
        'modifier', 'wisdom'
    ),
 'Clerics start with 8 + Wisdom modifier hit points at 1st level.'),

-- Cleric Features (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Class Feature', 1,
 JSON_OBJECT(
     'ability_ids', (
         SELECT JSON_ARRAYAGG(id) 
         FROM abilities 
         WHERE class_id = (SELECT id FROM class_reference WHERE class_name = 'Cleric')
         AND ability_type = 'Class Feature'
         AND level_required = 1
     ),
     'automatic', true
 ),
 'Clerics gain their starting class features.'),

-- Divine Domain Choice (choose 1)
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Subclass', 1,
 JSON_OBJECT(
     'ability_ids', (
         SELECT JSON_ARRAYAGG(id) 
         FROM abilities 
         WHERE class_id = (SELECT id FROM class_reference WHERE class_name = 'Cleric')
         AND ability_type = 'Subclass'
     ),
     'category', 'Domain'
 ),
 'Choose a Divine Domain.'),

-- Saving throw proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Saving Throw', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Wisdom Save'),
         (SELECT id FROM abilities WHERE ability_name = 'Charisma Save')
     ),
     'automatic', true
 ),
 'Clerics are proficient in Wisdom and Charisma saving throws.'),

-- Armor/Weapon proficiencies (automatic)
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Proficiency', 1,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'Light Armor'),
         (SELECT id FROM abilities WHERE ability_name = 'Medium Armor'),
         (SELECT id FROM abilities WHERE ability_name = 'Shields'),
         (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons')
     ),
     'automatic', true
 ),
 'Clerics are proficient with light and medium armor, shields, and simple weapons.'),

-- Skill proficiencies (choose 2)
((SELECT id FROM class_reference WHERE class_name = 'Cleric'), 1, 'Skill Proficiency', 2,
 JSON_OBJECT(
     'ability_ids', JSON_ARRAY(
         (SELECT id FROM abilities WHERE ability_name = 'History'),
         (SELECT id FROM abilities WHERE ability_name = 'Insight'),
         (SELECT id FROM abilities WHERE ability_name = 'Medicine'),
         (SELECT id FROM abilities WHERE ability_name = 'Persuasion'),
         (SELECT id FROM abilities WHERE ability_name = 'Religion')
     ),
     'category', 'Skill'
 ),
 'Choose 2 skill proficiencies from: History, Insight, Medicine, Persuasion, or Religion.');

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

-- 6. Insert "Morgan the Wizard" (Test Wizard)
INSERT INTO characters (
    user_id, char_name, total_level, total_hp, initiative_bonus, 
    strength, dexterity, constitution, intelligence, wisdom, charisma, languages
)
VALUES (
    (SELECT id FROM users WHERE user_name = 'testuser'),
    'Morgan the Wizard',
    1,
    7, -- HP = 6 + Con mod (1)
    2, -- Init = Dex mod (+2)
    8, 14, 13, 15, 12, 10,
    'Common, Draconic'
);

INSERT INTO character_classes (character_id, class_id, class_level)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
    (SELECT id FROM class_reference WHERE class_name = 'Wizard'),
    1
);

-- Automatic Features
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Arcane Recovery'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Spellcasting (Wizard)'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Spellbook'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Intelligence Save'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Wisdom Save'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons'), TRUE, 0);

-- Chosen Skills
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Arcana'), TRUE, 2),
    ((SELECT id FROM characters WHERE char_name = 'Morgan the Wizard'),
     (SELECT id FROM abilities WHERE ability_name = 'Investigation'), TRUE, 2);

-- 7. Insert "Cassandra the Cleric" (Test Cleric)
INSERT INTO characters (
    user_id, char_name, total_level, total_hp, initiative_bonus, 
    strength, dexterity, constitution, intelligence, wisdom, charisma, languages
)
VALUES (
    (SELECT id FROM users WHERE user_name = 'testuser'),
    'Cassandra the Cleric',
    1,
    10, -- HP = 8 + Wis mod (2)
    1, -- Init = Dex mod (+1)
    10, 12, 13, 10, 15, 14,
    'Common, Celestial, Dwarvish'
);

INSERT INTO character_classes (character_id, class_id, class_level)
VALUES (
    (SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
    (SELECT id FROM class_reference WHERE class_name = 'Cleric'),
    1
);

-- Automatic Features
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Spellcasting (Cleric)'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Wisdom Save'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Charisma Save'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Light Armor'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Medium Armor'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Shields'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Simple Weapons'), TRUE, 0);

-- Chosen Subclass/Skills
INSERT INTO character_abilities (character_id, ability_id, proficient, proficiency_bonus)
VALUES 
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Life Domain'), TRUE, 0),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Medicine'), TRUE, 2),
    ((SELECT id FROM characters WHERE char_name = 'Cassandra the Cleric'),
     (SELECT id FROM abilities WHERE ability_name = 'Persuasion'), TRUE, 2);