Template.stats.onRendered(function() {

    // Prepare data
    Meteor.call('getDividendGraphData', "stock", "sector", function(err, data) {

        var ctx = document.getElementById("sector-allocation");

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });

    });

    Meteor.call('getDividendGraphData', "stock", "currency", function(err, data) {

        var ctx = document.getElementById("currency-allocation");

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });

    });

    Meteor.call('getDividendGraphData', "p2p", "name", function(err, data) {

        var ctx = document.getElementById("p2p-platform");

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });

    });

    Meteor.call('getDividendGraphData', "p2p", "currency", function(err, data) {

        var ctx = document.getElementById("p2p-currency");

        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: {}
        });

    });

});
