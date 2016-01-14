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
      return Session.get('recentTweets')[0].get("building_name");
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
      userName = $('#userName').val();
      Meteor.call('fetchFromService', userName, function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
        } else {
          console.log("respJson: ", respJson);
          //window.alert(respJson.length + ' tweets received.');
          Session.set("recentTweets",respJson);
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
    fetchFromService: function(userName) {
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
