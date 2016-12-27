SyncedCron.config({
  log: false
});

SyncedCron.add({
  name: 'Update portfolio',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 1 day');
  },
  job: function() {
  	Meteor.call('updateCurrencies');
    Meteor.call('updatePortfolio');
    Meteor.call('takeSnapshot');
  }
});