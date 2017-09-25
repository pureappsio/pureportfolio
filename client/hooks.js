AutoForm.hooks({

    updatePositionForm
    : {
        onSuccess: function(type, id) {

            Meteor.call('editPosition', this.currentDoc._id);

        }
    }

});