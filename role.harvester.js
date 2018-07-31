var roleUpgrader = require('role.upgrader');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && !creep.memory.upgrading) {
            var sources = creep.memory.assignedRoom.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
            }
        } else {
            var targets = creep.memory.assignedRoom.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {
                        visualizePathStyle: {
                            stroke: '#ffffff'
                        }
                    });
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};

module.exports = roleHarvester;