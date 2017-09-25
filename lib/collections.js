import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

// Required AutoForm setup
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.debug = true;

// Collections
Positions = new Mongo.Collection('positions');
Platforms = new Mongo.Collection('platforms');
Goals = new Mongo.Collection('goals');
Snapshots = new Mongo.Collection('snapshots');
Metas = new Mongo.Collection('metas');

// Shemas
const Schemas = {};

Schemas.Platforms = new SimpleSchema({

    name: {
        type: String,
        label: "Name"
    },
    link: {
        type: String,
        label: "Link"
    }

});

Platforms.attachSchema(Schemas.Platforms);

Schemas.Positions = new SimpleSchema({

    name: {
        optional: true,
        type: String,
        label: "Name"
    },
    value: {
        optional: true,
        type: Number,
        label: "Value"
    },
    positionYield: {
        optional: true,
        type: Number,
        label: "Yield"
    },
    userId: {
        type: String,
        label: "User ID"
    },
    platformId: {
        optional: true,
        type: String,
        label: "Platform",
        autoform: {
            options: function() {
                return Platforms.find({}).map(function(platform) {
                    return {
                        label: platform.name,
                        value: platform._id
                    };
                });
            },
        }
    },
    type: {
        type: String,
        label: "Type",
        autoform: {
            options: function() {
                return [{
                    label: 'Peer-to-Peer Lending',
                    value: 'p2p'
                }, {
                    label: 'Real Estate',
                    value: 'realestate'
                }, {
                    label: 'Profitable Website',
                    value: 'website'
                }, {
                    label: 'Cash',
                    value: 'cash'
                }, {
                    label: 'Stocks',
                    value: 'stock'
                }];
            }
        }
    },
    currency: {
        optional: true,
        type: String,
        label: "Currency",
        autoform: {
            options: function() {
                return [{
                    label: 'EUR',
                    value: 'EUR'
                }, {
                    label: 'USD',
                    value: 'USD'
                }];
            }
        }
    },
    country: {
        optional: true,
        type: String,
        label: "Country",
        autoform: {
            options: function() {
                return [{
                    label: 'Latvia',
                    value: 'LV'
                }, {
                    label: 'Spain',
                    value: 'ES'
                }, {
                    label: 'United Kingdom',
                    value: 'UK'
                }, {
                    label: 'Estonia',
                    value: 'EE'
                },
                {
                    label: 'Italy',
                    value: 'IT'
                }];
            }
        }
    },
    city: {
        optional: true,
        type: String,
        label: "City"
    },
    size: {
        optional: true,
        type: Number,
        label: "Size (sqm)"
    },
    sector: {
        optional: true,
        type: String,
        label: "Sector"
    },
    industry: {
        optional: true,
        type: String,
        label: "Industry"
    },
    ticker: {
        optional: true,
        type: String,
        label: "Ticker"
    },
    qty: {
        optional: true,
        type: Number,
        label: "Number"
    },
    field: {
        optional: true,
        type: String,
        label: "Field"
    }
});

Positions.attachSchema(Schemas.Positions);
