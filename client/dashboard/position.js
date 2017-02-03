Template.position.events({

    'click .delete': function() {

        Meteor.call('deletePosition', this._id);

    },
    'click .update': function() {

        if (this.type == 'stock') {
            Meteor.call('updateStockPosition', this._id, parseInt($('#' + this._id).val()));
        } else {
            Meteor.call('updatePosition', this._id, parseInt($('#' + this._id).val()));

        }

    }

});

Template.position.helpers({

    isStock: function() {

        if (this.type == 'stock') {
            return true;
        } else {
            return false;
        }

    },
    income: function() {
        return (this.value * this.positionYield / 100 / 12).toFixed(0);
    },
    convertedValue: function() {
        // if (this.currency == 'EUR') {
        return (this.value).toFixed(0);
        // }
        // else {
        //   return (this.value / Metas.findOne({type: this.currency}).value).toFixed(0);
        // }
    }

});
