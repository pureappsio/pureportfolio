Template.registerHelper("truncate", function (number) {
    return number.toFixed(0);
});

Template.registerHelper("truncateTwo", function (number) {
    return number.toFixed(2);
});

Template.registerHelper("truncateString", function (string) {

    var maxLength = 30;
    if (string.length > (maxLength + 3)) {
      return string.substring(0, maxLength) + '...';
    }
    else {
      return string;
    }
    
});

Template.registerHelper("formatDate", function (date) {
    return moment(date).format('MMMM Do YYYY, h:mm:ss a');
});

Template.registerHelper("formatDateShort", function (date) {
    return moment(date).format('MMMM Do YYYY');
});

Template.registerHelper("formatStatus", function (status) {
    if (status == 'open') {return 'OPEN'};
    if (status == 'pending') {return 'PENDING'};
    if (status == 'closed') {return 'CLOSED'};
    if (status == 'spam') {return 'SPAM'};
});

Template.registerHelper("statusLabel", function (status) {
    if (status == 'open') {return 'success'};
    if (status == 'pending') {return 'info'};
    if (status == 'closed') {return 'default'};
    if (status == 'spam') {return 'danger'};
});

Template.registerHelper("langEN", function () {
    if (Session.get('language')) {
      if (Session.get('language') == 'en') {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return true;
    }
});

Template.registerHelper("isAdmin", function () {
  if (Meteor.user()) {
  	if (Meteor.user().emails[0].address == 'marcolivier.schwartz@gmail.com') {
      return true;
	}
	else {
	  return false;
	}
  } 
  else {
	  return false;
	}
  
});