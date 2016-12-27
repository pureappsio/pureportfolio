Meteor.startup(function() {

    // Refresh currencies
    // Meteor.call('updateCurrencies');
    // Meteor.call('updatePortfolio');
    // Meteor.call('takeSnapshot');

    process.env.MAIL_URL = Meteor.settings.MAIL_URL;

    // Cron
    SyncedCron.start();

});
