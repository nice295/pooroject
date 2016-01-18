if (Meteor.isClient) {
  Session.setDefault("building", "R3");
  Session.setDefault("floor", "27");
  Session.setDefault("url", "http://52.192.77.6:3000/floors/24  .json"); // R3 27th

  Meteor.call('fetchFromService', Session.get('url'), function(err, respJson) {
    if(err) {
      window.alert("Error: " + err.reason);
      console.log("error occured on receiving data on server. ", err );
    } else {
      console.log("respJson: ", respJson[0]);
      Session.set('resultJson', respJson[0]);
    }
    $('#fetchButton').removeAttr('disabled').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh');
  });      

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
          $("#result-cells").append('<span class="label label-success">IDLE</span>');
        }
        else {
          $("#result-cells").append('<span class="label label-default">BUSY</span>');         
        }
      } 
    }
  });

  Template.build_tap.events({
    'click #select-building' : function () {
      var clickElement = event.target;
      console.log("select-building", clickElement.value);
      //Session.set("building", clickElement.value)
    },
    'change #select-floor' : function () {
      var changeElement = event.target;
      console.log("select-floor", changeElement.value);
      Session.set("floor", changeElement.value);

      if (Session.get("building") == "R3") {
        if (Session.get("floor") == "27") {
          Session.set("url", "http://52.192.77.6:3000/floors/24.json");
        }
        else if (Session.get("floor") == "26") {
          Session.set("url", "http://52.192.77.6:3000/floors/25.json");
        }
        else if (Session.get("floor") == "25") {
          Session.set("url", "http://52.192.77.6:3000/floors/23.json");
        }
        else if (Session.get("floor") == "24") {
          Session.set("url", "http://52.192.77.6:3000/floors/22.json");
        }
        else if (Session.get("floor") == "21") {
          Session.set("url", "http://52.192.77.6:3000/floors/21.json");
        }
        else if (Session.get("floor") == "20") {
          Session.set("url", "http://52.192.77.6:3000/floors/20.json");
        }  
        else if (Session.get("floor") == "19") {
          Session.set("url", "http://52.192.77.6:3000/floors/19.json");
        }
        else if (Session.get("floor") == "18") {
          Session.set("url", "http://52.192.77.6:3000/floors/18.json");
        }
        else if (Session.get("floor") == "17")
          Session.set("url", "http://52.192.77.6:3000/floors/17.json");
        else if (Session.get("floor") == "16")
          Session.set("url", "http://52.192.77.6:3000/floors/16.json");
        else if (Session.get("floor") == "15")
          Session.set("url", "http://52.192.77.6:3000/floors/15.json");
        else if (Session.get("floor") == "14")
          Session.set("url", "http://52.192.77.6:3000/floors/14.json");
        else if (Session.get("floor") == "12")
          Session.set("url", "http://52.192.77.6:3000/floors/13.json");
        else if (Session.get("floor") == "11")
          Session.set("url", "http://52.192.77.6:3000/floors/12.json");
      }
      else {

      }
      console.log("url", Session.get('url'));

      Meteor.call('fetchFromService', Session.get('url'), function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
        } else {
          console.log("respJson: ", respJson[0]);
          Session.set('resultJson', respJson[0]);
        }
        $('#fetchButton').removeAttr('disabled').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Refresh');
      });
    }
  });

  Template.footer.events({
    'click #fetchButton' : function () {
      $('#fetchButton').attr('disabled','true').html('<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span> Loading...');

      Meteor.call('fetchFromService', Session.get('url'), function(err, respJson) {
        if(err) {
          window.alert("Error: " + err.reason);
          console.log("error occured on receiving data on server. ", err );
        } else {
          console.log("respJson: ", respJson[0]);
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
    fetchFromService: function(url) {
      console.log('url', url);

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
