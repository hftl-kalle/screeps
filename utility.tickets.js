var utilityTickets = {
    addTicket: function (ticketRaiser, ticketAction, ticketWorker) {
        if (Memory.Tickets[ticketRaiser]) return false;
        var ticket = new this.ticket(ticketRaiser, ticketAction, ticketWorker);
        Memory.Tickets[ticketRaiser] = ticket;
        return ticket;
    },
    getRaisedTicket: function (ticketRaiser) {
        return Memory.Tickets[ticketRaiser];
    },
    checkValidity: function () {
        for (var key in Memory.Tickets) {
            if (!Game.getObjectById(key) && !Game.spawns[key]) {
                delete Memory.Tickets[key];
                continue;
            }
            if (Memory.Tickets[key].Worker && !Game.getObjectById(Memory.Tickets[key].Worker)) Memory.Tickets[key].Worker = null;
        }
    },
    getCurrentTicket: function (ticketWorker) {
        //for (var key in Memory.Tickets) {
        //    if (Memory.Tickets[key].Worker == ticketWorker) return Memory.Tickets[key];
        //}
        return this.requestTicket(ticketWorker);
    },
    requestTicket: function (ticketWorker) {
        var bestTicket = null;
        var currentBestNr = null;
        var ticketAction = null;
        var worker = Game.getObjectById(ticketWorker);
        if (worker.carry.energy == 0) ticketAction = "take";
        if (worker.carryCapacity == worker.carry.energy) ticketAction = "give";
        for (var key in Memory.Tickets) {
            if (ticketAction && Memory.Tickets[key].Action != ticketAction) continue;
            if (Memory.Tickets[key].Worker || ticketAction && Memory.Tickets[key].Action != ticketAction) continue;
            var raiser = Game.getObjectById(key) || Game.spawns[key];
            var timeDiff = Game.time - Memory.Tickets[key].Time;

            var xs = worker.pos.x - raiser.pos.x,
                ys = worker.pos.y - raiser.pos.y;
            xs *= xs;
            ys *= ys;
            var moveCost = Math.sqrt(xs + ys);
            var cost = moveCost - timeDiff;
            var energyDiff = worker.carryCapacity - worker.carry.energy;
            if (bestTicket == null || currentBestNr > cost) {
                bestTicket = Memory.Tickets[key];
                currentBestNr = cost;
                continue;
            }
        }
        if (bestTicket) bestTicket.Worker = ticketWorker;
        return bestTicket;
    },
    reportDone: function (ticketWorker) {
        for (var key in Memory.Tickets) {
            if (Memory.Tickets[key].Worker == ticketWorker) {
                delete Memory.Tickets[key];
                return true;
            }
        }
        return false;
    },
    removeTicket: function (ticketRaiser) {
        if (Memory.Tickets[ticketRaiser]) {
            delete Memory.Tickets[ticketRaiser];
            return true;
        } else {
            return false;
        }
    },
    ticket: function (ticketRaiser, ticketAction, ticketWorker) {
        this.Raiser = ticketRaiser;
        this.Action = ticketAction;
        this.Time = Game.time;
        this.Worker = ticketWorker ? ticketWorker : null;
    }
};

module.exports = utilityTickets;