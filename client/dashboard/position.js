Template.position.events({

  'click .delete': function() {

  	Meteor.call('deletePosition', this._id);

  }

});

Template.position.helpers({

  income: function() {
    return (this.value * this.positionYield / 100 / 12).toFixed(0);
  },
  convertedValue: function() {
    if (this.currency == 'EUR') {
      return (this.value).toFixed(0);
    }
    else {
      return (this.value / Metas.findOne({type: this.currency}).value).toFixed(0);
    }
  }

});
