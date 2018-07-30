var roleUpgrader = require('role.upgrader');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var raiseCapacity=0.2

        if(creep.energy<creep.energyCapacity*raiseCapacity && !creep.memory.queueTicket){
            if(_.findIndex(Memory.haulerQueue,{creepRaiser:creep})==-1){
                creep.memory.queueTicket={creepRaiser:creep,creepHauler:null,haulerAction:"give"}
                Memory.haulerQueue.push(creep.memory.queueTicket);
            } 
        }
       
        var targets = creep.memory.assignedRoom.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
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
            if (targets.length > 0) {
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
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