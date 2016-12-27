Meteor.publish("userPositions", function () {
	return Positions.find({});
});

Meteor.publish("userSnapshots", function () {
	return Snapshots.find({});
});

Meteor.publish("userMetas", function () {
	return Metas.find({});
});

Meteor.publish("allUsers", function () {
	return Meteor.users.find({});
});