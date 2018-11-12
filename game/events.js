// public events
// ---------------------------------------------------------------------------------------------------------------------
const CURRENT_PLAYERS = 'currentPlayers'
const NEW_PLAYER = 'newPlayer'
const PLAYER_CHANGE = 'playerChange'
const PLAYER_DIED = 'playerDied'
const PLAYER_LEFT_GAME = 'playerLeftGame'

// private events
// ---------------------------------------------------------------------------------------------------------------------
const REGISTER_NEW_PLAYER_SUCCESS = 'registerNewPlayerSuccess'
const REGISTER_NEW_PLAYER_FAIL = 'registerNewPlayerFail'
const HIT_SUCCESS = 'hitSuccess'
const HIT_FAIL = 'hitFail'
const RECEIVED_DAMAGE = 'receivedDamage'
const YOU_DIED = 'youDied'

// creators for events
exports.createCurrentPlayers = function createCurrentPlayers(players){
    return {
        type: CURRENT_PLAYERS,
        payload: {
            players: players
        }
    }
}

exports.createNewPlayer = function createNewPlayer(player){
    return {
        type: NEW_PLAYER,
        payload: {
            player: player
        }
    }    
}

exports.createPlayerChange = function createPlayerChange(player, hitWord){
    return {
        type: PLAYER_CHANGE,
        payload: {
            player: Object.assign({}, player, {hitWord}),
        }
    }    
}

exports.createPlayerDied = function createPlayerDied(player){
    return {
        type: PLAYER_DIED,
        payload: {
            player: player
        }
    }    
}

exports.createPlayerLeftGame = function createPlayerLeftGame(playerId){
    return {
        type: PLAYER_LEFT_GAME,
        payload: {
            playerId: playerId
        }
    }
}

exports.createRegisterNewPlayerSuccess = function createRegisterNewPlayerSuccess(playerId, playerName, playerHP, text){
    return {
        type: REGISTER_NEW_PLAYER_SUCCESS,
        payload: {
            id: playerId,
            name: playerName,
            hp: playerHP,
            text: text
        }
    }
}

exports.createRegisterNewPlayerFail = function createRegisterNewPlayerFail(playerId, err) {
    return {
        type: REGISTER_NEW_PLAYER_FAIL,
        payload: {
            id: playerId,
            err: err
        }
    }
}

exports.createHitSuccess = function createHitSuccess(playerId, targetPlayer, effectiveDamage){
    return {
        type: HIT_SUCCESS,
        payload: {
            id: playerId,
            targetPlayer: targetPlayer,
            effectiveDamage: effectiveDamage
        }
    }
}

exports.createHitFail = function createHitFail(playerId, err) {
    return {
        type: HIT_FAIL,
        payload: {
            id: playerId,
            err: err
        }
    }
}

exports.createReceivedDamage = function createReceivedDamage(playerId, damage) {
    return {
        type: RECEIVED_DAMAGE,
        payload: {
            id: playerId,
            damage: damage,
        }
    }
}

exports.createYouDied = function createYouDied(playerId, reason){
    return {
        type: YOU_DIED,
        payload: {
            id: playerId,
            reason: reason
        }
    }
}
