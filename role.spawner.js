var roleSpawner = {

    /** @param {Creep} creep **/
    run: function (spawn) {

        // ticket creation and cleanup
        if (spawn.energy < spawn.energyCapacity) {
            if (!Memory.structuresEnergy[spawn.name]) {
                Memory.structuresEnergy[spawn.name] = {
                    creepRaiser: spawn,
                    creepHauler: null,
                    haulerAction: "give"
                };
                Memory.haulerQueue.splice(0, 0, Memory.structuresEnergy[spawn.name]);
            }
        } else if (spawn.energy == spawn.energyCapacity && Memory.structuresEnergy[spawn.name]) {
            delete Memory.structuresEnergy[spawn.name];
            var index = _.findIndex(Memory.haulerQueue, function (o) {
                return o.creepRaiser.name == spawn.name;
            });
            if (index) Memory.haulerQueue.splice(index, 1);
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

        if (sumMiner == 0 && sumHauler == 0 && sumHarvester < 3 && spawn.room.energyAvailable >= 200) {
            var role = sumHarvester < Memory.maxCreeps * Memory.harvesterPercentage ? 'harvester' : 'builder';
            spawn.spawnCreep([WORK, CARRY, MOVE], 'Worker' + Game.time, {
                memory: {
                    role: "harvester",
                    assignedRoom: spawn.room
                }
            });
        } else if (Object.keys(Game.creeps).length <= Memory.maxCreeps && spawn.energy == spawn.energyCapacity && !spawn.spawning && spawn.room.energyAvailable == spawn.room.energyCapacityAvailable) {
            var sumMiningSpaces = 0;
            for (var key in Memory.sources) {
                sumMiningSpaces += Memory.sources[key].freeTiles;
            }

            if (sumMiner != sumMiningSpaces && sumMiner <= sumHauler) {
                console.log("spawning miner");
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                var target = null;

                for (var key in Memory.sources) {
                    console.log(key);
                    if (Memory.sources[key].miners < Memory.sources[key].freeTiles) {
                        target = spawn.room.find(FIND_SOURCES, {
                            filter: (source) => {
                                return source.id == key;
                            }
                        })[0];
                        break;
                    }
                    if (target == null) {
                        target = spawn.room.find(FIND_SOURCES, {
                            filter: (source) => {
                                return source.id == key;
                            }
                        })[0];
                    }
                }
                console.log(target);

                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "miner",
                        targetSource: target,
                        assignedRoom: spawn.room
                    }
                });
            } else if (sumMiner < sumHauler || Object.keys(Game.creeps).length <= Memory.maxCreeps && (sumUpgrader + sumBuilder + sumMiner) / 2 < sumHauler) {
                console.log("spawning hauler");
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable) / 100; i++) {
                    body.push(MOVE);
                    body.push(CARRY);
                }

                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "hauler",
                        assignedRoom: spawn.room
                    }
                });
            } else if (sumBuilder < Memory.maxBuilders) {
                console.log("spawning builder");
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "builder",
                        assignedRoom: spawn.room
                    }
                });
            } else if (sumUpgrader < Memory.maxUpgraders) {
                console.log("spawning upgrader");
                var body = [];
                for (var i = 1; i < (spawn.room.energyAvailable - 100) / 100; i++) {
                    body.push(WORK);
                }
                body.push(MOVE);
                body.push(CARRY);
                spawn.spawnCreep(body, 'Worker' + Game.time, {
                    memory: {
                        role: "upgrader",
                        assignedRoom: spawn.room
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