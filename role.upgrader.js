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