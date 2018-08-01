var utilityTickets = require('utility.tickets');

var roleHauler = {

    /** @param {Creep} creep **/
    run: function (creep) {

        // go grab a task if you have none
        var currentTicket = utilityTickets.getCurrentTicket(creep.id);

        if (currentTicket) {
            // fetch the stuff from miners directly

            if (currentTicket.Action == "take") {
                var tryWithdraw = creep.withdraw(Game.getObjectById(currentTicket.Raiser), RESOURCE_ENERGY);
                if (tryWithdraw == ERR_NOT_IN_RANGE || tryWithdraw == ERR_INVALID_TARGET) {
                    creep.moveTo(Game.getObjectById(currentTicket.Raiser), {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                }
                if (tryWithdraw == OK || creep.carry.energy == creep.carryCapacity) {
                    utilityTickets.reportDone(creep.id);
                }
                // give stuff
            } else if (currentTicket.Action == "give") {
                var giveTarget = Game.getObjectById(currentTicket.Raiser) || Game.spawns[currentTicket.Raiser];
                if (!giveTarget) {
                    creep.say("invalid Target");
                    return;
                }
                var tryTransfer = creep.transfer(giveTarget, RESOURCE_ENERGY);
                //if (tryTransfer != ERR_NOT_IN_RANGE) console.log("TryTransfer " + tryTransfer);
                if (tryTransfer == ERR_NOT_IN_RANGE) {
                    creep.moveTo(giveTarget, {
                        visualizePathStyle: {
                            stroke: '#ffaa00'
                        }
                    });
                } else if (tryTransfer == OK || tryTransfer == ERR_FULL || tryTransfer == ERR_NOT_ENOUGH_RESOURCES) {
                    //utilityTickets.reportDone(creep.id);
                }
            }
        }
    }
};

module.exports = roleHauler;