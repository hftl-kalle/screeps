var utilityTickets = require('utility.tickets');

var roleTower = {

    /** @param {Creep} creep **/
    run: function (tower) {

        if (tower.energy < tower.energyCapacity) {
            utilityTickets.addTicket(tower.id,"give");
        } else if (tower.energy == tower.energyCapacity) {
            utilityTickets.removeTicket(tower.id);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
};

module.exports = roleTower;

