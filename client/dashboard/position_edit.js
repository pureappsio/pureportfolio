Template.positionEdit.helpers({

    isRe: function() {

        if (this.type == 'realestate') {
            return true;
        } else {
            return false;
        }

    },
    isStock: function() {
        if (this.type == 'stock' || this.type == 'reit' || this.type == 'etf') {
            return true;
        } else {
            return false;
        }
    }

});