Router.configure({
    layoutTemplate: 'layout'
});

// Routes
Router.route('/dashboard', { name: 'dashboard' });
Router.route('/portfolio', { name: 'portfolio' });
Router.route('/history', { name: 'history' });
Router.route('/settings', { name: 'settings' });
Router.route('/stats', { name: 'stats' });

Router.route('/positions/:id/edit', {
    name: 'positionEdit',
    data: function() {

        return Positions.findOne(this.params.id);

    }
});

Router.route('/', function() {

    if (!Meteor.userId()) {

        this.render('login');

    } else {

        this.render('dashboard');

    }

});


Router.route('/login', {
    name: 'login'
});

Router.route('/platforms', {
    name: 'platforms'
});

Router.route('/snapshots', {
    name: 'snapshots'
});

Router.route('/signup', {
    name: 'signup'
});
