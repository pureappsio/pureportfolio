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
        } else if (type == 'website') {

            var position = {
                name: $('#name').val(),
                income: $('#income').val(),
                userId: Meteor.user()._id,
                type: type,
                currency: $('#currency :selected').val()
            }

        } else {
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

    positionTotal: function(type) {

        return Session.get('types')[type].value.toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

    },
    positionGoal: function(type) {

        if (Goals.findOne({ type: type, feature: 'value' })) {
            var current = Session.get('types')[type].value;
            var goal = Goals.findOne({ type: type, feature: 'value' }).value;

            return (current / goal * 100).toFixed(0);
        }

    },
    isValueGoal: function() {

        if (Goals.findOne({ type: 'global', feature: 'value' })) {
            return true;
        }

    },
    valueGoal: function() {

        return (Session.get('total').value / Goals.findOne({ type: 'global', feature: 'value' }).value * 100).toFixed(0);

    },
    incomeGoal: function() {

        return (Session.get('total').passiveIncome / Goals.findOne({ type: 'global', feature: 'income' }).value * 100).toFixed(0);

    },
    isIncomeGoal: function() {

        if (Goals.findOne({ type: 'global', feature: 'income' })) {
            return true;
        }

    },
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
        return (Session.get('total').passiveIncome / 12).toFixed(0).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    },
    yield: function() {
        return Session.get('total').passiveYield.toFixed(2);
    },
    types: function() {
        return Session.get('types');
    }

});

Template.dashboard.onRendered(function() {

    Meteor.call('getPortfolioTotal', function(err, data) {

        Session.set('total', data);

    });

    Meteor.call('getPortfolio', function(err, data) {

        console.log(data);

        Session.set('types', data);

    });

});
