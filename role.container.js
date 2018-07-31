var utilityTickets = require('utility.tickets');

var roleContainer = {

    run: function (container) {
        if (container.store[RESOURCE_ENERGY] > 0) {
            utilityTickets.addTicket(container.id,"take");
        }else utilityTickets.removeTicket(container.id);
    }
};

module.exports = roleContainer 