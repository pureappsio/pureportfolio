Template.snapshot.events({

    'click .delete': function() {
        Meteor.call('deleteSnapshot', this._id);
    }

});
