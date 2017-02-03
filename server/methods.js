Meteor.methods({

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

        return Snapshots.find(query).fetch();

    },
    takeSnapshot: function() {

        console.log('Taking snapshot');

        // Take snapshot of each category
        var portfolio = Meteor.call('getPortfolioArray');

        for (i = 0; i < portfolio.length; i++) {
            snapshot = portfolio[i];
            snapshot.category = 'global';
            snapshot.date = new Date();
            Snapshots.insert(snapshot);
        }

        // Take global snapshot
        var globalSnapshot = Meteor.call('getPortfolioTotal');
        globalSnapshot.date = new Date();
        globalSnapshot.category = 'global';
        globalSnapshot.type = 'global';
        Snapshots.insert(globalSnapshot);

    },
    updatePortfolio: function() {

        // Get all stocks
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

        }

    },
    getPortfolioTotal: function() {

        // Get portfolio
        var portfolio = Meteor.call('getPortfolio');

        // Total
        var total = {
            value: 0,
            yield: 0,
            income: 0
        }

        // Calculate value & income
        for (type in portfolio) {
            total.value += portfolio[type].value;
            total.income += portfolio[type].income;
        }

        // Yield
        total.yield = total.income / total.value * 100;

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
