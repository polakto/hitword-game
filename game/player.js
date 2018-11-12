const DEFAULT_PLAYER_HP = 10

class Player {
    constructor(id, hp){
        this.id = id
        this.hp = hp || DEFAULT_PLAYER_HP
    }
    
    // damage receives damagePoints - this method return actual damage cause byt hitWord - in future, blocking and immortality can be applied
    damage(damagePoints){
        this.hp -= damagePoints
        return damagePoints
    }

}

module.exports = Player