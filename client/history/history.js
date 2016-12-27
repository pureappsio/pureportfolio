Template.history.helpers({
    
    snapshots: function() {
        return Snapshots.find({category: 'global', type: 'global'});
    }

});

Template.history.onRendered( function() {
    
    // Prepare data
    Meteor.call('getSnapshots', {category: 'global', type: 'global'}, function(err, data) {

        var dates = [];
        var values = [];

        for (i in data) {
            dates.push(data[i].date);
            values.push(parseInt((data[i].value).toFixed(0)));
        }

        Session.set('dates', dates);
        Session.set('values', values);

    });

});

Template.history.historyChart = function() {

    return {
        title: {
            text: 'Portfolio History',
            x: -20 //center
        },
        xAxis: {
            categories: Session.get('dates')
        },
        yAxis: {
            title: {
                text: 'Value'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '€'
        },
        series: [{
            name: 'Portfolio Value (€)',
            data: Session.get('values')
        }]
    };
};