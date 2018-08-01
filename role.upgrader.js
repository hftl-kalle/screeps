var utilityTickets = require('utility.tickets');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var raiseCapacity = 0.2

        if (creep.carry[RESOURCE_ENERGY] <= creep.carryCapacity * raiseCapacity) {
            utilityTickets.addTicket(creep.id, "give");
        } else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) utilityTickets.removeTicket(creep.id);

        var intent = creep.upgradeController(creep.memory.assignedRoom.controller)
        if (intent == ERR_NOT_IN_RANGE || intent == ERR_NOT_ENOUGH_RESOURCES) {
            creep.moveTo(creep.memory.assignedRoom.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }

    }
};

module.exports = roleUpgrader;