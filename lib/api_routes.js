Router.route("/api/portfolio", { where: "server" }).get(function() {

    // Get data
    if (this.params.query.option) {
        if (this.params.query.option == 'array') {
            data = Meteor.call('getPortfolioArray');
        } else {
            data = Meteor.call('getPortfolio');
        }
    } else {
        data = Meteor.call('getPortfolio');
    }

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));

});

Router.route("/api/positions", { where: "server" }).get(function() {

    // Get data
    if (this.params.query.type) {

        data = Meteor.call('getPositions', { type: this.params.query.type });

    } else {

        data = Meteor.call('getPositions', {});

    }

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));

});

Router.route("/api/total", { where: "server" }).get(function() {

    // Get data
    data = Meteor.call('getPortfolioTotal');

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));

});
