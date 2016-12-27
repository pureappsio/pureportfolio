// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userPositions');
    Meteor.subscribe('userSnapshots');
    Meteor.subscribe('userMetas');
    Meteor.subscribe('allUsers');
});