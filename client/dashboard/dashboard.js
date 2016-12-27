Template.dashboard.events({

    'change #type, click #type': function() {

        // Get type
        var type = $('#type :selected').val();

        if (type == 'stock' || type == 'etf' || type == 'reit') {
            Session.set('type', 'stock');
        } else if (type == 'website') {
            Session.set('type', 'website');
        } else {
            Session.set('type', 'generic');
        }

        console.log(Session.get('type'));

    },
    'click #add': function() {

        // Get type
        var type = $('#type :selected').val();

        if (type == 'stock' || type == 'etf' || type == 'reit') {
            var position = {
                ticker: $('#ticker').val(),
                qty: parseInt($('#qty').val()),
                userId: Meteor.user()._id,
                type: type,
                field: $('#field :selected').val()
            }
        } 
        else if (type == 'website') {

        	var position = {
                name: $('#name').val(),
                income: $('#income').val(),
                userId: Meteor.user()._id,
                type: type,
                currency: $('#currency :selected').val()
            }

        }
        else {
            var position = {
                name: $('#name').val(),
                value: parseFloat($('#value').val()),
                positionYield: parseFloat($('#yield').val()),
                userId: Meteor.user()._id,
                type: type,
                currency: $('#currency :selected').val()
            }
        }

        // Add
        Meteor.call('addPosition', position, function(err, position) {

            Meteor.call('getPortfolioTotal', function(err, data) {

                Session.set('total', data);

            });

        });

    }

});

Template.dashboard.helpers({

    isGeneric: function() {
        if (Session.get('type') == 'generic') {
            return true;
        } else {
            return false;
        }
    },
    isStock: function() {
        if (Session.get('type') == 'stock') {
            return true;
        } else {
            return false;
        }
    },
    isWebsite: function() {
        if (Session.get('type') == 'website') {
            return true;
        } else {
            return false;
        }
    },
    positions: function() {
        return Positions.find({}, { sort: { type: 1 } });
    },
    total: function() {
        return Session.get('total').value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    income: function() {
        return Session.get('total').income.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    yield: function() {
        return Session.get('total').yield.toFixed(2);
    }

});

Template.dashboard.onRendered(function() {

    Meteor.call('getPortfolioTotal', function(err, data) {

        Session.set('total', data);

    });

});