var roleSpawner = {
    
    /** @param {Creep} creep **/
    run: function (spawn) {

        if(spawn.energy<spawn.energyCapacity){
            if(_.findIndex(Memory.haulerQueue,{creepRaiser:spawn})==-1){
                Memory.structuresEnergy[spawn.name]={creepRaiser:spawn,creepHauler:null,haulerAction:"give"};
                Memory.haulerQueue.splice(0,0,Memory.structuresEnergy[spawn.name]);     
            } 
        }

        var roles = {
            upgrader: {
                MOVE: 1,
                CARRY: 1,
                WORK: "x"
            },
            builder: {
                MOVE: 1,
                CARRY: 1,
                WORK: "x"
            },
            miner: {
                MOVE: 1,
                CARRY: 1,
                WORK: "x"
            },
            hauler: {
                MOVE: 1,
                CARRY: "x"
            }
        };

        var sumHarvester = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        var sumMiner = _.sum(Game.creeps, (c) => c.memory.role == 'miner');
        var sumHauler = _.sum(Game.creeps, (c) => c.memory.role == 'hauler');
        var sumUpgrader = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        var sumBuilder = _.sum(Game.creeps, (c) => c.memory.role == 'builder');

        var nonFullExtensions = spawn.room.find(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                if (structure.structureType == STRUCTURE_EXTENSION) return structure.energy < structure.energyCapacity;
                else return;
            }
        });

        if (Object.keys(Game.creeps).length <= Memory.maxCreeps && spawn.energy == spawn.energyCapacity && !spawn.spawning && spawn.room.energyAvailable == spawn.room.energyCapacityAvailable) {
            

            var role = sumHarvester < Memory.maxCreeps * Memory.harvesterPercentage ? 'harvester' : 'builder';
            spawn.spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'Worker' + Game.time, {
                memory: {
                    role: role
                }
            });
        }

        var emptySource = spawn.room.find(FIND_SOURCES, {
            filter: (energySource) => {
                if (energySource.energy == 0 && Memory.listOfEmptySources.indexOf(energySource) == -1) {
                    Memory.listOfEmptySources.push(energySource);
                    return true;
                } else return false;

            }
        });
    }
};

module.exports = roleSpawner;