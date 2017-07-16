// Tracker
Tracker.autorun(function() {
    Meteor.subscribe('userPositions');
    Meteor.subscribe('userPlatforms');
    Meteor.subscribe('userGoals');
    Meteor.subscribe('userSnapshots');
    Meteor.subscribe('userMetas');
    Meteor.subscribe('allUsers');
});