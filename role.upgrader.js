var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var raiseCapacity = 0.2

        if (creep.carry[RESOURCE_ENERGY] <= creep.carryCapacity * raiseCapacity && !creep.memory.queueTicket) {
            creep.memory.queueTicket = {
                creepRaiser: creep,
                creepHauler: null,
                haulerAction: "give"
            }
            Memory.haulerQueue.push(creep.memory.queueTicket);
        }

        if (creep.upgradeController(creep.memory.assignedRoom.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }

    }
};

module.exports = roleUpgrader;