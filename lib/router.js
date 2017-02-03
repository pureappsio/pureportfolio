Router.configure({
  layoutTemplate: 'layout'
});

// Routes
Router.route('/dashboard', {name: 'dashboard'});
Router.route('/portfolio', {name: 'portfolio'});
Router.route('/history', {name: 'history'});
Router.route('/settings', {name: 'settings'});
Router.route('/', {name: 'home', data: function() { this.render('dashboard') }});

