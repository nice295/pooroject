if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.result.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });

  Template.result.helpers({
    result: function () {
      var json = Session.get('resultJson');
      var retultHtml = json.building_name;
      return retultHtml;
    },
    summary: function () {
      var json = Session.get('resultJson');
      return json.desc + " (" + json.cells.length + " 칸)"; 
    },
    resultCells: function () {
      var json = Session.get('resultJson');
      $("#result-cells").empty();
      for (i=0 ; i < json.cells.length; i++) {
        if (json.cells[i].occupied == 1) {
          $("#result-cells").append('<span class="label label-default">IDLE</span>');
        }
        else {
          $("#result-cells").append('<span class="label label-default">BUSY</span>');         
        }
      } 
    }
  });

  Template.footer.events({
    'click #fetchButton' : function () {
      console.log("Recent tweets from stream!");
      //$('#fetchButton').attr('disabled','true').text('Loading...');
      $('#fetchButton').attr('disabled','true').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Loading...');
      id = $('#id').val();
      Meteor.call('fetchFromService', id, function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
        } else {
          console.log("respJson: ", respJson[0]);
          console.log("occupied: ", respJson[0].cells[0].occupied);
          Session.set('resultJson', respJson[0]);
        }
        //$('#fetchButton').removeAttr('disabled').text('REFRESH');
        $('#fetchButton').removeAttr('disabled').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh');
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
