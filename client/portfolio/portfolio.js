Template.portfolio.helpers({

    positions: function() {
        return Positions.find({}, { sort: { type: 1 } });
    }

});
