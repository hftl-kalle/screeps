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
        }
    }
};

module.exports = roleExtension;