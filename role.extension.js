var utilityTickets = require('utility.tickets');

var roleExtension = {

    /** @param {Creep} creep **/
    run: function (extension) {

        if (extension.energy < extension.energyCapacity) {
            utilityTickets.addTicket(extension.id,"give");
        } else if (extension.energy == extension.energyCapacity) {
            utilityTickets.removeTicket(extension.id);
        }
    }
};

module.exports = roleExtension;