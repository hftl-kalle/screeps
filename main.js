var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleSpawner = require('role.spawner');

// initial git commit
module.exports.loop = function () {
    // declare gobals
    Memory.maxCreeps = 11;
    Memory.harvesterPercentage = 0.6;
    if (!Memory.listOfEmptySources) Memory.listOfEmptySources = [];
    if (!Memory.haulerQueue) Memory.haulerQueue = [];

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