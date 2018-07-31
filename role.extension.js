var roleExtension = {

    /** @param {Creep} creep **/
    run: function (extension) {

        if (extension.energy < extension.energyCapacity) {
            if (!Memory.structuresEnergy[extension.id]) {
                Memory.structuresEnergy[extension.id] = {
                    creepRaiser: extension,
                    creepHauler: null,
                    haulerAction: "give"
                };
                Memory.haulerQueue.splice(0, 0, Memory.structuresEnergy[extension.id]);
            }
        } else if (extension.energy == extension.energyCapacity && Memory.structuresEnergy[extension.id]) {
            delete Memory.structuresEnergy[extension.id];
            var index = _.findIndex(Memory.haulerQueue, function (o) {
                return o.creepRaiser.id == extension.id;
            })
            if (index > -1) Memory.haulerQueue.splice(index, 1);
        }
    }
};

module.exports = roleExtension;