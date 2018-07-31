var roleSpawner = {

    /** @param {Creep} creep **/
    run: function (spawn) {

        if (spawn.energy < spawn.energyCapacity) {
            if (!Memory.structuresEnergy[spawn.name]) {
                Memory.structuresEnergy[spawn.name] = {
                    creepRaiser: spawn,
                    creepHauler: null,
                    haulerAction: "give"
                };
                Memory.haulerQueue.splice(0, 0, Memory.structuresEnergy[spawn.name]);
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

        if (sumMiner == 0 && sumHauler == 0 && sumHarvester == 0 && spawn.room.energyAvailable == 200) {
            var role = sumHarvester < Memory.maxCreeps * Memory.harvesterPercentage ? 'harvester' : 'builder';
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {
                memory: {
                    role: "harvester"
                }
            });
        } else if (Object.keys(Game.creeps).length <= Memory.maxCreeps && spawn.energy == spawn.energyCapacity && !spawn.spawning && spawn.room.energyAvailable == spawn.room.energyCapacityAvailable) {
            var sumMiningSpaces = 0;
            for (var key in Memory.sources) {
                sumMiningSpaces += Memory.sources[key].freeTiles;
            }

            if (sumMiner != sumMiningSpaces && sumMiner <= sumHauler) {
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                var target = Game.structures[Memory.sources[0]];
                for (var key in Memory.sources) {
                    if (Memory.sources.miners < Memory.sources.freeTiles) {
                        target = Game.structures[Memory.sources[key]];
                        break;
                    }
                }
                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "miner",
                        targetSource: target
                    }
                });
            } else if (sumMiner < sumHauler || Object.keys(Game.creeps).length <= Memory.maxCreeps && (sumUpgrader + sumBuilder + sumMiner) / 2 < sumHauler) {
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable) / 100; i++) {
                    body.push(MOVE);
                    body.push(CARRY);
                }

                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "hauler"
                    }
                });
            } else if (sumBuilder < Memory.maxBuilders) {
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "builder"
                    }
                });
            } else if (sumUpgrader < Memory.maxUpgraders) {
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "upgrader"
                    }
                });
            }
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