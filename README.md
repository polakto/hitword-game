# HitWord game

Clone repo

```
git clone https://github.com/polakto/hitword-game
```

move to folder
```
cd hitword-game
```

install dependencies
```
npm install
```

run server with

```
npm start
```

and then open localhost:{PORT} to enter the game.

# Game
Goal of a game is to defeat other players by typing their hitWords to text input at the bottom of the screen and send those to server. When player enters game, hitWord and init hit points are assigned. Then others try to hit him/her by typing and sending hitWords to server. When entered hitWord match hitWord assigned to the player, number of targeted player HP is decreased by the length of typed word. When HP is <= zero, player dies.

Game is for 2 and more players (locally player per tab).

# Screen

## you are
At the top of the screen is your name (unique generated key) with current state of hitpoints (HP)

## Online players
Other online players on this server, your goal is to lower their HP to 0.

## Game log
Game log provides information about progress of game.

RECOMMENDATION: Play game with sound on. :)

Test