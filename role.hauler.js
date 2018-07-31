var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // go grab a task if you have none
        if (!creep.memory.currentTicket) {
            for (var i = 0; i < Memory.haulerQueue.length; i++) {
                var action = Memory.haulerQueue[i].haulerAction;
                var creepCapacity = creep.carry.carryCapacity;
                var creepEnergy = creep.carry[RESOURCE_ENERGY];
                var raiserCapacity = Memory.haulerQueue[i].creepRaiser.carryCapacity;
                if (action == "take" && creepCapacity - creepEnergy > raiserCapacity || action == "give" && creepEnergy >= raiserCapacity) {
                    creep.memory.currentTicket = Memory.haulerQueue[i];
                    creep.memory.currentTicket.creepHauler = creep;
                    Memory.haulerQueue.splice(i, 1);
                    break;
                }
            }
            if (!creep.memory.currentTicket) {
                console.log("fetch container ticket");
                var containers = creep.memory.assignedRoom.find(FIND_STRUCTURES, {
                    filter: {
                        structureType: STRUCTURE_CONTAINER
                    }
                }) //todo
                containers.sort(function (a, b) {
                    return a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY];
                });
                console.log(containers.length);
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
                if (Game.creeps[ticket.creepRaiser.Name].memory.queueTicket) creep.moveTo(ticket.creepRaiser, {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
                else creep.memory.currentTicket = null;
                // give stuff
            } else if (ticket.haulerAction == "give") {
                var tryTransfer = creep.transfer(ticket.creepRaiser);
                if (tryTransfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ticket.creepRaiser, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                } else if (tryTransfer == OK) {
                    if (ticket.creepRaiser.Name && Game.creeps[ticket.creepRaiser.Name]) Game.creeps[ticket.creepRaiser.Name].memory.queueTicket = null;
                    else if (ticket.creepRaiser.id && Memory.structures[ticket.creepRaiser.id]) {
                        delete Memory.structuresEnergy[ticket.creepRaiser.id]
                    } else if (ticket.creepRaiser.name && Memory.structures[ticket.creepRaiser.name]) {
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
                if (tryWithdraw == OK) {
                    creep.memory.currentTicket = null;
                }
            }
        }
    }
};

module.exports = roleHauler;