if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.hello.helpers({
    result: function () {
      var json = Session.get('resultJson');
      var retultHtml = json.building_name;
      return retultHtml;
    }
  });

  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    },
    'click #fetchButton' : function () {
      console.log("Recent tweets from stream!");
      $('#fetchButton').attr('disabled','true').val('loading...');
      id = $('#id').val();
      Meteor.call('fetchFromService', id, function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
        } else {
          console.log("respJson: ", respJson[0]);
          Session.set('resultJson', respJson[0]);
        }
        $('#fetchButton').removeAttr('disabled').val('Fetch');
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    fetchFromService: function(id) {
      var url = "http://52.192.77.6:3000/floors/24.json";
      //synchronous GET
      var result = Meteor.http.get(url, {timeout:30000});
      if(result.statusCode==200) {
        var respJson = JSON.parse(result.content);
        console.log("response received.");
        return respJson;
      } else {
        console.log("Response issue: ", result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
      }
    }
  });
}
