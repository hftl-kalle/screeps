var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // go grab a task if you have none
        if (!creep.memory.currentTicket) {
            for (var i = 0; i < Memory.haulerQueue.length; i++) {
                var action = Memory.haulerQueue[i].haulerAction;
                var creepCapacity = creep.carry.carryCapacity;
                var creepEnergy = creep.carry[RESOURCE_ENERGY];
                var raiserCapacity = Memory.haulerQueue[i].creepRaiser.carryCapacity ? Memory.haulerQueue[i].creepRaiser.carryCapacity : Memory.haulerQueue[i].creepRaiser.energyCapacity;
                if (action == "take" && creepCapacity - creepEnergy > raiserCapacity || action == "give" && creepEnergy > 0) {
                    creep.memory.currentTicket = Memory.haulerQueue[i];
                    creep.memory.currentTicket.creepHauler = creep;
                    Memory.haulerQueue.splice(i, 1);
                    break;
                }
            }
            if (!creep.memory.currentTicket) {
                var containers = creep.memory.assignedRoom.find(FIND_STRUCTURES, {
                    filter: {
                        structureType: STRUCTURE_CONTAINER
                    }
                }) //todo
                containers.sort(function (a, b) {
                    return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY];
                });
                if (containers.length > 0)
                    creep.memory.currentTicket = {
                        creepRaiser: containers[0],
                        creepHauler: creep,
                        haulerAction: "fetch"
                    }
            }
        }

        if (creep.memory.currentTicket) {
            // fetch the stuff from miners directly
            var ticket = creep.memory.currentTicket;
            if (ticket.haulerAction == "take") {
                if (Game.creeps[ticket.creepRaiser.name].memory.queueTicket) creep.moveTo(Game.creeps[ticket.creepRaiser.name], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
                else creep.memory.currentTicket = null;
                // give stuff
            } else if (ticket.haulerAction == "give") {
                var giveTarget = ticket.creepRaiser.id ? Game.getObjectById(ticket.creepRaiser.id) : Game.creeps[ticket.creepRaiser.name];
                var tryTransfer = creep.transfer(giveTarget, RESOURCE_ENERGY);
                if (tryTransfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(giveTarget, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                } else if (tryTransfer == OK) {
                    if (ticket.creepRaiser.name && Game.creeps[ticket.creepRaiser.name]) Game.creeps[ticket.creepRaiser.name].memory.queueTicket = null;
                    else if (ticket.creepRaiser.id && Memory.structuresEnergy[ticket.creepRaiser.id]) {
                        delete Memory.structuresEnergy[ticket.creepRaiser.id]
                    } else if (ticket.creepRaiser.name && Memory.structuresEnergy[ticket.creepRaiser.name]) {
                        delete Memory.structuresEnergy[ticket.creepRaiser.name];
                    }
                    creep.memory.currentTicket = null;
                }
            } else if (ticket.haulerAction == "fetch") {
                var tryWithdraw = creep.withdraw(Game.getObjectById(ticket.creepRaiser.id), RESOURCE_ENERGY);
                if (tryWithdraw == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(ticket.creepRaiser.id), {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                if (tryWithdraw == OK || creep.carry.energy == creep.carryCapacity) {
                    creep.memory.currentTicket = null;
                }
            }
        }
    }
};

module.exports = roleHauler;