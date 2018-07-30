var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');

// test commit for creds
module.exports.loop = function () {
    // declare gobals
    Memory.maxCreeps = 11;
    Memory.harvesterPercentage = 0.6;
    if (!Memory.listOfEmptySources) Memory.listOfEmptySources = [];
    if (!Memory.haulerQueue) Memory.haulerQueue = [];
    if (!Memory.sources) Memory.sources = {};

    // set number of available spots for miners on all sources
    for (var spawn in Game.spawns) {
        var sources = Game.spawns[spawn].room.find(FIND_SOURCES, {
            filter: (source) => {
                return !Memory.sources[source.id];
            }
        });
        for (var sourceIndex = 0; sourceIndex < sources.length; sourceIndex++) {
            Memory.sources[sources[sourceIndex].id] = {};
            Memory.sources[sources[sourceIndex].id].freeTiles = 0;
            for (var i = -1; i < 2; i++) {
                for (var j = -1; j < 2; j++) {
                    if (j != 0 && i != 0) {
                        var position = Game.spawns[spawn].room.lookAt(sources[sourceIndex].pos.x + i, sources[sourceIndex].pos.y + j)
                        if (_.findIndex(position, {
                                type: "wall"
                            }) > -1) Memory.sources[sources[sourceIndex].id].freeTiles++;
                    }
                }
            }
        }
    }
    // delete died creeps from memory
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

    // set all roles to units
    roleSpawner.run(Game.spawns["Spawn1"]);

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];
        creep.memory.assignedRoom = Game.spawns["Spawn1"].room;
        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }

    // fill debug energy field
    for (var i = Memory.listOfEmptySources.length - 1; i > -1; i--) {
        if (Memory.listOfEmptySources[i] != 0) Memory.listOfEmptySources.splice(i, 1);
    }
    if (Memory.listOfEmptySources.length > 0) {
        console.log("Empty Sources on " + Game.time);
    }
}