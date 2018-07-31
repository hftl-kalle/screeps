var utilityTickets = require('utility.tickets');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // go grab a task if you have none
        var currentTicket= utilityTickets.getCurrentTicket(creep.id);

        if (currentTicket) {
            // fetch the stuff from miners directly
            var ticket = creep.memory.currentTicket;

            if (ticket.Action == "take") {
                if (Game.creeps[ticket.Raiser]) creep.moveTo(Game.creeps[ticket.Raiser], {
                    visualizePathStyle: {
                        stroke: '#ffaa00'
                    }
                });
                else {
                    var tryWithdraw = creep.withdraw(Game.getObjectById(ticket.creepRaiser.id), RESOURCE_ENERGY);
                    if (tryWithdraw == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.getObjectById(ticket.creepRaiser.id), {
                            visualizePathStyle: {
                                stroke: '#ffaa00'
                            }
                        });
                    }
                    if (tryWithdraw == OK || creep.carry.energy == creep.carryCapacity) {
                        utilityTickets.reportDone(creep.id);
                    }
                }
                // give stuff
            } else if (ticket.Action == "give") {
                var giveTarget = Game.getObjectById(ticket.Raiser) || Game.spawns[ticket.Raiser];
                if(!giveTarget){
                    creep.say("invalid Target");
                    return;
                }
                var tryTransfer = creep.transfer(giveTarget, RESOURCE_ENERGY);
                if (tryTransfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(giveTarget, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                } else if (tryTransfer == OK || tryTransfer == ERR_FULL) {
                    utilityTickets.reportDone(creep.id);
                }
            }
        }
    }
};

module.exports = roleHauler;