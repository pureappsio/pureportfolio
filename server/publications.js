Meteor.publish("userPositions", function () {
	return Positions.find({});
});

Meteor.publish("userGoals", function () {
	return Goals.find({});
});

Meteor.publish("userSnapshots", function () {
	return Snapshots.find({});
});

Meteor.publish("userPlatforms", function () {
	return Platforms.find({});
});

Meteor.publish("userMetas", function () {
	return Metas.find({});
});

Meteor.publish("allUsers", function () {
	return Meteor.users.find({});
});