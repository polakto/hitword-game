var createHash = require('hash-generator')
var randomWord = require('./words')
var Player = require('./player')
var events = require('./events')

// Game represents one battleground where players can be registered to and emit events
class Game {
    constructor(
        emitter,
        logger
    ){
        const gameId = createHash(8)
        this.id = gameId
        // players holds references to all registered players
        this.players = new Map()
        // hitWords contains list of all currently active hitWords
        this.hitWords = new Map()
        // initPlayerHP defines default HP set to newly registered player
        this.initPlayerHP = 5
        // emitter serves as central point to emit information from game (for example socket io instance)
        this.emitter = emitter
        // logger
        this.logger = logger
    }

    registerNewPlayer(playerId) {
        // check if playerId unique
        if (this.players.has(playerId)){
            const msg = `player with id ${playerId} already registered`
            this.log('warn', msg)
            this.emit(playerId, "message", events.createRegisterNewPlayerFail(playerId, msg))
        } else {
            // create new Player and hitWord
            const player = new Player(playerId, this.initPlayerHP)
            const hitWord = this.randomUniqueWord()
            // register new player
            this.players.set(playerId, player)
            this.registerHitWord(hitWord, player)

            const msg = `new player ${playerId} entered arena with hitword ${hitWord}`
            this.log('info', msg)
            const text = `Welcome ${player.id}, type hitWords of your enemies to the text input below and send them to attack!`
            this.emit(playerId, "message", events.createRegisterNewPlayerSuccess(player.id, player.id, player.hp, text))
            this.emitCurrentState()
        }
    }

    unregisterPlayer(playerId){
        if (this.players.has(playerId)){        
            // find and delete associated hitWords
            this.hitWords.forEach((value, key) => {
                if (value instanceof Player) {
                    if (value.id === playerId){
                        this.hitWords.delete(key)
                    }
                }
            })

            // delete from players
            this.players.delete(playerId)
        }
        this.emit(null, "message", events.createPlayerLeftGame(playerId))
        this.emitCurrentState()
    }

    registerHitWord(hitWord, player) {
        this.hitWords.set(hitWord, player)
        const msg = `player ${player.id} has hitword ${hitWord}`
        this.log('info', msg)
        this.emitCurrentState()
    }

    processHitWord(fromPlayerId, hitWord) {
        const targetPlayer = this.hitWords.get(hitWord)
        if (targetPlayer == null) {
            const msg = `player ${fromPlayerId} missed with hitword ${hitWord}`
            this.log('info', msg)
            this.emit(null, "message", events.createHitFail(fromPlayerId, msg))
        } else if (targetPlayer.id === fromPlayerId) {
            const msg = `stop hitting yourself!`
            this.emit(targetPlayer.id, "message", events.createHitFail(fromPlayerId, msg))
        } else {
            this.hitWords.delete(hitWord)
            const damageDelta = targetPlayer.damage(hitWord.length)

            let msg = `player ${fromPlayerId} hit player ${targetPlayer.id} with word ${hitWord} and caused damage ${damageDelta}, new HP is ${targetPlayer.hp}`
            this.log('info', msg)

            // notify target player about damage
            this.emit(targetPlayer.id, "message", events.createReceivedDamage(targetPlayer.id, damageDelta))
            // notify attacking player about success
            this.emit(fromPlayerId, "message", events.createHitSuccess(fromPlayerId, targetPlayer, damageDelta))

            // in case HP lower than 0 - player died
            if (targetPlayer.hp <=0){
                this.emit(targetPlayer.id, "message", events.createYouDied(targetPlayer.id, "you died!"))
                this.emit(null, "message", events.createPlayerDied(targetPlayer))
                // this.unregisterPlayer(targetPlayer.id)
                return
            } else {
                const newHitWord = this.randomUniqueWord()
                this.registerHitWord(newHitWord, targetPlayer)
            }           
            
            this.emitCurrentState()
        } 
    }

    currentPlayers(){
        // remap Map to object for transport
        const players = {}
        this.players.forEach((v, k) => {
            players[k] = v
            players[k].hitWord = this.hitWordByPlayerId(v.id)
        })
        return players
    }

    hitWordByPlayerId(playerId){
        for (let [k, v] of this.hitWords){
            if (v.id === playerId){
                return k
            }
        }
    }

    randomUniqueWord(){
        while (true) {
            const newWord = randomWord()
            if (!this.hitWords.has(newWord)){
                return newWord
            }
        }
    }

    emitCurrentState(){
        this.emit(null, "message", events.createCurrentPlayers(this.currentPlayers()))
    }

    emit(playerId, msgType, payload){
        console.log('emitting ' + JSON.stringify(payload))
        if (playerId == null) {
            this.emitToAll(msgType, payload)
        } else {
            this.emitToOne(playerId, msgType, payload)
        }
    }

    emitToOne(playerId, msgType, payload){
        try {
            this.emitter.to(playerId).emit(msgType, payload)
        } catch(err) {
            this.log('error', err)
        }
    }

    emitToAll(msgType, payload){
        try {
            this.emitter.emit(msgType, payload)
        } catch(err) {
            this.log('error', err)
        }
    }

    log(logLevel = 'info', logMessage){
        this.logger.log({
            level: logLevel,
            message: logMessage
        })
    }
}

module.exports = Game