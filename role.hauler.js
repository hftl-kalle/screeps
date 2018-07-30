var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if(!creep.memory.currentTicket)
        {
            for(var i=0; i< Memory.haulerQueue.length; i++){
                var action=Memory.haulerQueue[i].haulerAction;
                var creepCapacity = creep.carry.carryCapacity;
                var creepEnergy = creep.carry.energy;
                var raiserCapacity = Memory.haulerQueue[i].creepRaiser.carryCapacity;
                if(action=="take" && creepCapacity-creepEnergy>raiserCapacity || action=="give" && creepEnergy>=raiserCapacity)
                {
                    creep.memory.currentTicket=Memory.haulerQueue[i];
                    creep.memory.currentTicket.creepHauler=creep;
                    Memory.haulerQueue.splice(i,1);
                }
            }
        }

        if(creep.memory.currentTicket){
            var ticket=creep.memory.currentTicket;
            if(ticket.haulerAction=="take"){
                if(ticket.creepRaiser.memory.queueTicket) creep.moveTo(ticket.creepRaiser,{
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
                else creep.memory.currentTicket=null;       
            } else if(ticket.haulerAction=="give"){
                var tryTransfer=creep.transfer(ticket.creepRaiser);
                if ( tryTransfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(ticket.creepRaiser, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }else if(tryTransfer== OK) {
                    if(ticket.creepRaiser.Name&&Game.creeps[ticket.creepRaiser.Name])ticket.creepRaiser.memory.queueTicket=null;
                    else if(ticket.creepRaiser.id&&Memory.structures[ticket.creepRaiser.id]){
                        delete Memory.structuresEnergy[ticket.creepRaiser.id]
                    }else if(ticket.creepRaiser.name&&Memory.structures[ticket.creepRaiser.name]){
                        delete Memory.structuresEnergy[ticket.creepRaiser.name];
                    }
                    creep.memory.currentTicket=null;
                }
            }
        }
    }
};

module.exports = roleHauler;