Router.configure({
  layoutTemplate: 'layout'
});

// Routes
Router.route('/dashboard', {name: 'dashboard'});
Router.route('/history', {name: 'history'});
Router.route('/', {name: 'home', data: function() { this.render('dashboard') }});

