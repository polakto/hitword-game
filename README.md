# HitWord game

Simply run server with

```
npm start
```

and then open localhost:{PORT} to enter the game.

# Game
Goal of game is to defeat other players by typing their hitWords to text input at the bottom of screen and send those to server. When player enters game, hitWord and init hit points are assigned. Then others try to hit him/her by typing and sending hitWords to server. When entered hitWord match hitWord assigned to player, number of targeted player HP is decreased by the length of typed word. When is HP less or equals zero, player dies.

# Screen

## you are
At the top of screen is your name (unique generated key) with current state of hitpoints (HP)

## Online players
Other online players on this server, your goal is to lower their HP until >= 0.

## Game log
Game log provides information about progress of game.

RECOMMENDATION: Play game with sound on. :)