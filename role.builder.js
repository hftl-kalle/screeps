var utilityTickets = require('utility.tickets');

var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var raiseCapacity = 0.2

        if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity * raiseCapacity) {
            utilityTickets.addTicket(creep.id, "give")
        } else if (creep.carry[RESOURCE_ENERGY] == creep.carryCapacity) utilityTickets.removeTicket(creep.id);

        var targets = creep.memory.assignedRoom.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            var intent = creep.build(targets[0]);
            if (intent == ERR_NOT_IN_RANGE || intent == ERR_NOT_ENOUGH_RESOURCES) {
                creep.moveTo(targets[0], {
                    visualizePathStyle: {
                        stroke: '#ffffff'
                    }
                });
            }
        } else {
            var targets = creep.memory.assignedRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.hits < structure.hitsMax;
                }
            });
            while (targets.length > 0 && targets[0].structureType == STRUCTURE_WALL && targets[0].hits > 100000) {
                targets.splice(0, 1);
            }
            targets.sort(function (a, b) {
                return a.hits - b.hits;
            });
            if (targets.length > 0) {
                var intent = creep.repair(targets[0])
                if (intent == ERR_NOT_IN_RANGE || intent == ERR_NOT_ENOUGH_RESOURCES) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                    creep.say('?? repair');
                }
            } else roleUpgrader.run(creep);
        }
    }
};

module.exports = roleBuilder;