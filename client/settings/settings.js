Template.settings.events({

    'click #add-goal': function() {

        goal = {
            type: $('#type :selected').val(),
            feature: $('#feature :selected').val(),
            value: $('#value').val()
        }

        Meteor.call('addGoal', goal);

    },
    'click #update': function() {
        
        Meteor.call('updatePortfolio');
    },
     'click #snap': function() {
        
        Meteor.call('takeSnapshot');
    }

});

Template.settings.helpers({

    goals: function() {
        return Goals.find({});
    }

});
