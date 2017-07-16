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

    if (this.params.query.platforms) {

        for (i in data) {

            if (data[i].platformId) {

                var platform = Platforms.findOne(data[i].platformId);
                data[i].platform = platform;

            }

        }

    }

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));

});

Router.route("/api/snapshots", { where: "server" }).get(function() {

    // Get data
    data = Snapshots.find({}).fetch();

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify({ snapshots: data }));

});

Router.route("/api/report", { where: "server" }).get(function() {

    // Get data
    report = Meteor.call('getReport', this.params.query);

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(report));

});


Router.route("/api/total", { where: "server" }).get(function() {

    // Get data
    data = Meteor.call('getPortfolioTotal');

    // Send response
    this.response.setHeader('Content-Type', 'application/json');
    this.response.end(JSON.stringify(data));

});
