Meteor.methods({

    getReport: function(query) {

        // Get snapshot
        var date = new Date();
        var currentDate = new Date(date.setDate(0));
        var snapshots = Snapshots.find({}).fetch();
        var pastDate = new Date(date.setDate(0));

        console.log(currentDate);

        // Query ?
        if (query.year && query.month) {

            var currentDate = new Date();
            var pastDate = new Date();

            // Change according to query
            currentDate.setYear(query.year);
            pastDate.setYear(query.year);

            currentDate.setMonth(query.month, 0);
            pastDate.setMonth(query.month - 1, 0);

        } else {
            var currentDate = new Date(date.setDate(0));
            var pastDate = new Date(date.setDate(0));
        }

        var current = [];
        var past = [];

        for (i in snapshots) {

            var snapTime = new Date(snapshots[i].date);

            if (snapTime.getDate() == currentDate.getDate() && snapTime.getMonth() == currentDate.getMonth()) {
                current.push(snapshots[i]);
            }

            if (snapTime.getDate() == pastDate.getDate() && snapTime.getMonth() == pastDate.getMonth()) {
                past.push(snapshots[i]);
            }
        }

        console.log(current);

        var report = {};
        var types = ['p2p', 'stock', 'realestate', 'global'];

        for (i in current) {

            for (t in types) {

                if (types[t] == current[i].type) {

                    if (types[t] == 'global') {
                        report[types[t]] = { current: (current[i].passiveIncome / 12).toFixed(2) }
                    } else {
                        report[types[t]] = { current: (current[i].income / 12).toFixed(2) }
                    }


                }

            }

        }

        console.log(past);

        for (i in past) {

            for (t in types) {

                if (types[t] == past[i].type) {

                    if (types[t] == 'global') {
                        report[types[t]].variation = report[types[t]].current - past[i].passiveIncome / 12;
                        report[types[t]].variation_percent = report[types[t]].variation / (past[i].passiveIncome / 12) * 100;

                    } else {
                        console.log(types[t]);
                        report[types[t]].variation = report[types[t]].current - past[i].income / 12;
                        report[types[t]].variation_percent = report[types[t]].variation / (past[i].income / 12) * 100;
                    }

                    report[types[t]].variation = (report[types[t]].variation).toFixed(2);
                    report[types[t]].variation_percent = (report[types[t]].variation_percent).toFixed(2);


                }

            }

        }

        return report;

    },
    generateRandomColor: function() {

        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;

    },
    getDividendGraphData: function(type, parameter) {

        var stocks = Positions.find({ type: type }).fetch();

        console.log(stocks);

        var sectors = [];
        var colors = [];
        var totalValue = 0;
        for (i in stocks) {

            if (stocks[i][parameter]) {
                if (sectors.indexOf(stocks[i][parameter]) == -1) {
                    sectors.push(stocks[i][parameter]);
                    colors.push(Meteor.call('generateRandomColor'));
                }
                totalValue += stocks[i].value;
            }
        }

        var stocksSectors = [];

        for (i in sectors) {

            stocksSectors[i] = 0;

            for (s in stocks) {

                if (stocks[s][parameter] == sectors[i]) {

                    // Change to EUR
                    if (stocks[s].currency != 'EUR') {
                        stocks[s].value = stocks[s].value / Metas.findOne({ type: stocks[s].currency }).value
                    }

                    stocksSectors[i] += stocks[s].value;

                }

            }

            stocksSectors[i] = (stocksSectors[i] / totalValue * 100).toFixed(1);

        }

        data = {
            datasets: [{
                data: stocksSectors,
                backgroundColor: colors,
                hoverBackgroundColor: colors
            }],

            labels: sectors
        };

        return data;

    },
    getPositions: function(query) {

        // Get all positions
        var positions = Positions.find(query, { sort: { value: -1 } }).fetch();

        // Process
        for (i in positions) {

            // Change to EUR
            if (positions[i].currency != 'EUR') {
                positions[i].value = positions[i].value / Metas.findOne({ type: positions[i].currency }).value
            }

        }

        // Sort
        positions.sort(function(a, b) {
            if (a.value < b.value)
                return 1;
            if (a.value > b.value)
                return -1;
            return 0;
        });

        for (i in positions) {

            // Process
            positions[i].value = (positions[i].value).toFixed(0);
            positions[i].income = (positions[i].value * positions[i].positionYield / 100).toFixed(2);
            positions[i].monthlyIncome = (positions[i].income / 12).toFixed(2);

        }
        return positions;

    },
    deleteGoal: function(goalId) {

        return Goals.remove(goalId);

    },

    getGoal: function(query) {

        return Goals.findOne(query);

    },
    addGoal: function(goal) {

        console.log(goal);

        Goals.insert(goal);

    },
    getSnapshots: function(query) {

        return Snapshots.find(query, { sort: { date: 1 } }).fetch();

    },
    deleteSnapshot: function(snapId) {

        Snapshots.remove(snapId);

    },
    takeSnapshot: function() {

        console.log('Taking snapshot');

        // Take snapshot of each category
        var portfolio = Meteor.call('getPortfolioArray');

        console.log(portfolio);

        var snapshotDate = new Date();

        for (i = 0; i < portfolio.length; i++) {
            snapshot = portfolio[i];
            snapshot.category = 'global';
            snapshot.date = snapshotDate;
            Snapshots.insert(snapshot);
        }

        // Take global snapshot
        var globalSnapshot = Meteor.call('getPortfolioTotal');
        globalSnapshot.date = snapshotDate;
        globalSnapshot.category = 'global';
        globalSnapshot.type = 'global';
        Snapshots.insert(globalSnapshot);

    },
    updatePortfolio: function() {

        // Update all stocks
        var stocks = Positions.find({ type: 'stock' }).fetch();

        for (i in stocks) {

            console.log('Upating stock ' + stocks[i].ticker);

            // Get data 
            var answer = HTTP.get('https://dividendstocks.io/api/stocks/' + stocks[i].ticker);

            // Update
            var data = answer.data;
            Positions.update(stocks[i]._id, { $set: { positionYield: data.divYield } });
            Positions.update(stocks[i]._id, { $set: { value: data.value * stocks[i].qty } });
            Positions.update(stocks[i]._id, { $set: { name: data.name } });
            Positions.update(stocks[i]._id, { $set: { currency: data.currency } });

            Positions.update(stocks[i]._id, { $set: { sector: data.sector } });
            Positions.update(stocks[i]._id, { $set: { industry: data.industry } });
            Positions.update(stocks[i]._id, { $set: { country: data.country } });

        }

        // Update all websites
        Meteor.call('updateWebsites');

    },
    updateWebsites: function() {

        // Get data
        var answer = HTTP.get('https://metrics.schwartzindustries.com/api/average?key=glrqxPPZbXHRG9LN');
        var data = answer.data;

        // Define yield
        var websiteYield = 46;

        for (i in data.websites) {

            var website = data.websites[i];

            if (Positions.findOne({ type: 'website', name: website.name })) {

                console.log('Existing website');

                var website = Positions.findOne({ type: 'website', name: website.name });
                Positions.update(website._id, {
                    $set: {
                        income: website.total.current,
                        value: 12 * website.total.current / websiteYield * 100
                    }
                });

            } else {

                websiteData = {
                    name: website.name,
                    income: website.total.current,
                    userId: Meteor.users.findOne({})._id,
                    type: 'website',
                    currency: 'EUR',
                    positionYield: websiteYield,
                    value: 12 * website.total.current / websiteYield * 100
                }

                console.log(websiteData);

                Positions.insert(websiteData);

            }

        }

    },
    getPortfolioTotal: function() {

        // Get portfolio
        var portfolio = Meteor.call('getPortfolio');

        // Total
        var total = {
            value: 0,
            yield: 0,
            income: 0,
            passiveIncome: 0,
            passiveValue: 0
        }

        // Calculate value & income
        for (type in portfolio) {
            total.value += portfolio[type].value;
            total.income += portfolio[type].income;

            // Passive income only
            if (type == 'p2p' || type == 'stock' || type == 'realestate') {
                total.passiveValue += portfolio[type].value;
                total.passiveIncome += portfolio[type].income;
            }
        }

        // Yield
        total.yield = total.income / total.value * 100;
        total.passiveYield = total.passiveIncome / total.passiveValue * 100;

        console.log(total);

        // Make total
        return total;

    },
    getPortfolio: function() {

        // Portfolio
        var portfolio = {}
        var types = ['p2p', 'stock', 'realestate', 'website', 'cash', 'equity'];
        for (t in types) {
            portfolio[types[t]] = {
                value: 0,
                income: 0,
                yield: 0
            }
        }

        // Positions
        var positions = Positions.find({}).fetch();
        for (i in positions) {
            var value = parseFloat(positions[i].value);
            if (positions[i].currency != 'EUR') {
                value = value / Metas.findOne({ type: positions[i].currency }).value
            }
            portfolio[positions[i].type].value += value;
            portfolio[positions[i].type].income += parseFloat(value * positions[i].positionYield / 100);
        }

        // Calculate yields
        for (t in types) {
            if (portfolio[types[t]].value != 0) {
                portfolio[types[t]].yield = portfolio[types[t]].income / portfolio[types[t]].value * 100;

            } else {
                portfolio[types[t]].yield = 0;

            }
        }

        return portfolio;

    },
    getPortfolioArray: function() {

        // Portfolio
        var portfolio = [];
        var types = ['p2p', 'stock', 'realestate', 'website', 'cash', 'equity'];
        for (t in types) {
            portfolio[t] = {
                value: 0,
                income: 0,
                yield: 0,
                type: types[t]
            }
        }

        // Positions
        var positions = Positions.find({}).fetch();
        for (i in positions) {
            var value = parseFloat(positions[i].value);
            if (positions[i].currency != 'EUR') {
                value = value / Metas.findOne({ type: positions[i].currency }).value
            }
            portfolio[types.indexOf(positions[i].type)].value += value;
            portfolio[types.indexOf(positions[i].type)].income += parseFloat(value * positions[i].positionYield / 100);
        }

        // Calculate yields
        for (t in types) {
            if (portfolio[t].value != 0) {
                portfolio[t].yield = portfolio[t].income / portfolio[t].value * 100;

            } else {
                portfolio[t].yield = 0;
            }
        }

        return portfolio;

    },
    updateCurrencies: function() {

        // Request
        var data = HTTP.get('http://api.fixer.io/latest');
        console.log(JSON.parse(data.content));
        var currencyData = JSON.parse(data.content);

        var currencies = ['USD', 'GBP', 'HKD', 'SEK', 'SGD', 'CAD'];

        for (c in currencies) {

            if (Metas.findOne({ type: currencies[c] })) {

                console.log('Updating Meta');

                Metas.update({ type: currencies[c] }, { $set: { value: currencyData.rates[currencies[c]] } });

            } else {
                console.log('Creating new Meta');

                Metas.insert({ type: currencies[c], value: currencyData.rates[currencies[c]] });
            }

        }



    },
    addPosition: function(position) {

        // Insert
        console.log(position);
        var positionId = Positions.insert(position);

        // Get info
        if (position.type == 'stock' || position.type == 'reit' || position.type == 'etf') {

            // Get data 
            var answer = HTTP.get('https://dividendstocks.io/api/stocks/' + position.ticker);

            // Update
            var data = answer.data;
            Positions.update(positionId, { $set: { positionYield: data.divYield } });
            Positions.update(positionId, { $set: { value: data.value * position.qty } });
            Positions.update(positionId, { $set: { name: data.name } });
            Positions.update(positionId, { $set: { currency: data.currency } });

            Positions.update(positionId, { $set: { sector: data.sector } });
            Positions.update(positionId, { $set: { industry: data.industry } });
            Positions.update(positionId, { $set: { country: data.country } });

        }
        if (position.type == 'website') {

            // Define yield
            var websiteYield = 46;

            // Update
            Positions.update(positionId, { $set: { positionYield: websiteYield } });
            Positions.update(positionId, { $set: { value: 12 * position.income / websiteYield * 100 } });

        }

    },
    deletePosition: function(positionId) {

        // Remove
        Positions.remove(positionId);

    },
    updatePosition: function(positionId, value) {

        // Update
        Positions.update(positionId, { $set: { value: value } });

        console.log(Positions.findOne(positionId));

    },
    updateStockPosition: function(positionId, qty) {

        // Update
        Positions.update(positionId, { $set: { qty: qty } });

        // Get data 
        var position = Positions.findOne(positionId);
        var answer = HTTP.get('https://dividendstocks.io/api/stocks/' + position.ticker);

        // Update
        var data = answer.data;
        Positions.update(positionId, { $set: { positionYield: data.divYield } });
        Positions.update(positionId, { $set: { value: data.value * qty } });
        Positions.update(positionId, { $set: { name: data.name } });
        Positions.update(positionId, { $set: { currency: data.currency } });

        console.log(Positions.findOne(positionId));

    }

});
