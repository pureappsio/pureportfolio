Template.history.helpers({

    snapshots: function() {
        return Snapshots.find({ category: 'global', type: 'global' });
    }

});

Template.history.onRendered(function() {

    // Prepare data
    Meteor.call('getSnapshots', { category: 'global', type: 'global' }, function(err, snaps) {

        var graphData = [];
        var graphDataIncome = [];

        for (i in snaps) {
            graphData.push({
                x: snaps[i].date,
                y: parseInt((snaps[i].value).toFixed(0))
            });

            if (snaps[i].passiveIncome) {
                graphDataIncome.push({
                    x: snaps[i].date,
                    y: parseInt((snaps[i].passiveIncome/12).toFixed(0))
                });
            }

        }

        var ctx = document.getElementById("portfolio-history");

        var data = {
            datasets: [{
                label: "Net Worth (€)",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "darkblue",
                borderColor: "darkblue",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "darkblue",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "darkblue",
                pointHoverBorderColor: "darkblue",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: graphData,
                spanGaps: false,
            }]
        }

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }]
                }
            }
        });

        var ctxIncome = document.getElementById("portfolio-income");

        console.log(graphDataIncome);

        var data = {
            datasets: [{
                label: "Monthly Passive Income (€)",
                fill: false,
                lineTension: 0.1,
                backgroundColor: "red",
                borderColor: "red",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "red",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "red",
                pointHoverBorderColor: "red",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: graphDataIncome,
                spanGaps: false,
            }]
        }

        var myLineChart = new Chart(ctxIncome, {
            type: 'line',
            data: data,
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }]
                }
            }
        });

    });

});
