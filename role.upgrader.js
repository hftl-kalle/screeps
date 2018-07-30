var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var raiseCapacity=0.2

        if(creep.energy<creep.energyCapacity*raiseCapacity && !creep.memory.queueTicket){
            if(_.findIndex(Memory.haulerQueue,{creepRaiser:creep})==-1){
                creep.memory.queueTicket={creepRaiser:creep,creepHauler:null,haulerAction:"give"}
                Memory.haulerQueue.push(creep.memory.queueTicket);
            } 
        }

        if (creep.upgradeController(creep.memory.assignedRoom.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
                visualizePathStyle: {
                    stroke: '#ffffff'
                }
            });
        }
        
    }
};

module.exports = roleUpgrader;