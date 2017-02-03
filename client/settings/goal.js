Template.goal.events({

  'click .delete': function() {

  	Meteor.call('deleteGoal', this._id);

  }

});
