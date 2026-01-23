# TTRPG-Leveler

## 1. Project Overview
Solve the issue of crappy character sheets past level 1 for TTRPG players who would prefer a more streamlined and automated way to level up their characters.
  
## 2. Feature Breakdown
### MVP Features
- DnD Character sheet that can, when the user interacts with it, is able to update stats – features and abilities. Focus on per-level basis.
- Using the currently tracked level per character, the sheet will be able to tell the user what options they receive on a level up.

### Extended Features
-	Be able to instead present all the options to a player, rather than simply tell them what to look for.
-	Allow a character to be multiple seperate classes at the same time. 
-	Allow the option of using a different system that is not just DnD 5th Edition.

## 3. Data Model
### Core Entities
-	A Character, their stats – abilities – and features. Anything that comes with a character.
-	Users should be able to log in and track their character as characters tend to level up over the progress of weeks or months at a time.
-	Data on how each class levels up and how each character levels up.
-	Data on what specifically is available to players at each level up.

### Key Relationships
-	A user can log in, create an account, maintain or create new characters.
-	A character is owned by a player, though might be viewable by others. A character has levels, stats and class.
-	A Class has progression tables. Which outlines which exact things a character gains on each level up.

## 4. User Experience
### User Flows
When a user is upon their character sheet, they should be able to state they wish to level up, and the website then presents either what the player should look for – or what exact options they have at their disposal.
