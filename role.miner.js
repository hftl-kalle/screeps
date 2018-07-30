var roleMiner = {

    /** @param {Creep} creep **/
    run: function (creep) {
        var queueCapacity =0.7;
        if(creep.carry.energy>= creep.carryCapacity*queueCapacity && !creep.memory.queueTicket){
         creep.memory.queueTicket={creepRaiser:creep,creepHauler:null,haulerAction:"take"}
         Memory.haulerQueue.push(creep.memory.queueTicket);
        }

        if(creep.memory.queueTicket && creep.memory.queueTicket.creepHauler){
           if(creep.transfer(creep.memory.queueTicket.creepHauler,RESOURCE_ENERGY)==OK){
               creep.memory.queueTicket=null;
           }
        }

        if (creep.harvest(creep.memory.targetSource) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.targetSource, {
                visualizePathStyle: {
                    stroke: '#ffaa00'
                }
            });
        }
    }
};

module.exports = roleMiner;