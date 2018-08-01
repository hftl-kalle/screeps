var utilityTickets = require('utility.tickets');

var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var queueCapacity = 0.7;
        var containerAtPos = _.findIndex(creep.memory.assignedRoom.lookAt(creep.pos.x, creep.pos.y), {
            type: 'structure',
            structure: STRUCTURE_CONTAINER
        });
        if (creep.carry[RESOURCE_ENERGY] >= creep.carryCapacity * queueCapacity && containerAtPos == -1) {
            // utilityTickets.addTicket(creep.id,"take");
        }

        var raisedTicket = utilityTickets.getRaisedTicket(creep.id);
        if (raisedTicket && raisedTicket.Worker) {
            if (creep.transfer(Game.getObjectById(raisedTicket.Worker), RESOURCE_ENERGY) == OK) {
                utilityTickets.removeTicket(creep.id)
            }
        }

        if (creep.harvest(Game.getObjectById(creep.memory.targetSource)) == ERR_NOT_IN_RANGE) {
            creep.moveTo(Game.getObjectById(creep.memory.targetSource), {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    }
};

module.exports = roleMiner;