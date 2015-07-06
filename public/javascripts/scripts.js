// initialize new google maps LatLng object
var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
// set the map options hash
var mapOptions = {
    center: myLatlng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};
// get the maps div's HTML obj
var map_canvas_obj = document.getElementById("map-canvas");
// initialize a new Google Map with the options
var map = new google.maps.Map(map_canvas_obj, mapOptions);

var restaurantIcon = "../images/restaurant.png";
var hotelIcon = "../images/hotel.png";
var thingIcon = "../images/thing.png";

var currentDay = 1;
var markers = {1: []};
var days = 1;

$(document).ready(function() {
    initialize_gmaps();
    $('#navbutton').click(function(){
      $('#bs-example-navbar-collapse-1').toggleClass("in");
    });


    //adds item and marker
    $('#addhotel').click(function() {
      var hotelName = $('#selecthotel').val();
      if (duplicate(hotelName)) {
        $('.current #hotellist').append(itineraryChild(hotelName));
        //Add pointer to map
        all_hotels.forEach(function(hotel) {
          if (hotel.name === hotelName) {
            var coords = hotel.place[0].location;

            var hotelContent = '<div>'+
              '<h1 id="firstHeading" class="firstHeading">'+hotel.name+'</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address:</b> '+hotel.place[0].address+', '+hotel.place[0].city+', '+hotel.place[0].state+'</p>'+
              '<p><b>Phone:</b> '+hotel.place[0].phone+'</p>'+
              '<p><b>Rating:</b> '+hotel.num_stars+' stars</p>'+
              '<p><b>Amenities:</b> '+hotel.amenities+'</p>'+
              '</div>'+
              '</div>';

            setMarker(coords, hotelName, hotelIcon, hotelContent);
          }
        })
      }
      else alert("You've already added that item to this day!");
    });

    $('#addthing').click(function() {
      var thingName = $('#selectthing').val();
      if (duplicate(thingName)) {
        $('.current #thinglist').append(itineraryChild(thingName));

        all_things.forEach(function(thing) {
          if (thing.name === thingName) {
            var coords = thing.place[0].location;

            var thingContent = '<div>'+
              '<h1 id="firstHeading" class="firstHeading">'+thing.name+'</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address:</b> '+thing.place[0].address+', '+thing.place[0].city+', '+thing.place[0].state+'</p>'+
              '<p><b>Phone:</b> '+thing.place[0].phone+'</p>'+
              '<p><b>Ages:</b> '+thing.age_range+'</p>'+
              '</div>'+
              '</div>';

            setMarker(coords, thingName, thingIcon, thingContent);
          }
        })
      }
      else alert("You've already added that item to this day!");
    });

    $('#addrestaurant').click(function() {
      var restaurantName = $('#selectrestaurant').val();
      if (duplicate(restaurantName)) {
        $('.current #restaurantlist').append(itineraryChild(restaurantName));

        all_restaurants.forEach(function(restaurant) {
          if (restaurant.name === restaurantName) {
            var coords = restaurant.place[0].location;
            var money = "";
            for (var i = 0; i < restaurant.price; i++) {
              money += '$';
            }

            var restaurantContent = '<div>'+
              '<h1 id="firstHeading" class="firstHeading">'+restaurant.name+'</h1>'+
              '<div id="bodyContent">'+
              '<p><b>Address:</b> '+restaurant.place[0].address+', '+restaurant.place[0].city+', '+restaurant.place[0].state+'</p>'+
              '<p><b>Phone:</b> '+restaurant.place[0].phone+'</p>'+
              '<p><b>Cuisine:</b> '+restaurant.cuisine+'</p>'+
              '<p><b>Price:</b> '+money+'</p>'+
              '</div>'+
              '</div>';

            setMarker(coords, restaurantName, restaurantIcon, restaurantContent);
          }
        })
      }
      else alert("You've already added that item to this day!");
    });


    //removes item and marker
    $('#itinerary').on('click', '#hotellist .btn-danger', function() {
      removeMarker($(this));
      $('.current #hotellist').find('[name="'+$(this).attr('id')+'"]').remove();
    });

    $('#itinerary').on('click', '#thinglist .btn-danger', function() {
      removeMarker($(this));
      $('.current #thinglist').find('[name="'+$(this).attr('id')+'"]').remove();
    });

    $('#itinerary').on('click', '#restaurantlist .btn-danger', function() {
      removeMarker($(this));
      $('.current #restaurantlist').find('[name="'+$(this).attr('id')+'"]').remove();
    });


    //add new button tabs for days
    $('#add-day').click(function() {
      days++;
      markers[days] = [];

      var newDay = '<div class="panel-body bottom-panel hidden" id="day'+ days +'">'+
      '<h4> My Hotels:</h4>'+
      '<ul class="fullwidth" id="hotellist">'+
      '</ul>'+
      '<h4>My Things To Do:</h4>'+
      '<ul class="fullwidth" id="thinglist">'+
      '</ul>'+
      '<h4>My Restaurants:</h4>'+
      '<ul class="fullwidth" id="restaurantlist">'+
      '</ul></div>';

      var daybutton = '<li class="daypage" id="'+days+'"><a href="#">'+days+' <span class="sr-only">(current)</span></a></li>'
      $(daybutton).insertBefore($(this), $('.pagination'));
      $("#itinerary").append(newDay);
    });

    //switch days
    $('.pagination').on('click','.daypage', function() {
      switchDay(this);
    });

    //remove days
    $('.panel-title').on('click', '.btn-danger', function() {
      if (days === 1) {
        var day1 = '<h4> My Hotels:</h4>'
        +'<ul class="fullwidth" id="hotellist">'
        +'</ul>'
        +'<h4>My Things To Do:</h4>'
        +'<ul class="fullwidth" id="thinglist">'
        +'</ul>'
        +'<h4>My Restaurants:</h4>'
        +'<ul class="fullwidth" id="restaurantlist">'
        +'</ul>';

        $('#day1').html(day1);
        markers['1'].forEach(function(marker){
          marker.setMap(null);
        })
        markers['1'] = [];
        resetMarkers();
      }
      else {
        $('.pagination').find('[id="'+currentDay+'"]').remove();
        $('.current').remove();
        
        delete markers[currentDay];
        var count = 0;
        var newMarkers = {};
        for (var key in markers) {
          count++;
          newMarkers[count] = markers[key];
        }
        markers = newMarkers;
        for (var i = parseInt(currentDay)+1; i <= days; i++) {
          var daybtn = '<a href="#">'+(i-1)+' <span class="sr-only">(current)</span></a>';
          $('#'+i).attr("id", i-1).html(daybtn);
          $('#day'+i).attr("id", "day"+(i-1));
        };
        days--;
        switchDay($('#1'));
      }
    })
});


//Functions
function initialize_gmaps() {
  google.maps.event.addDomListener(window, "resize", function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center); 
  });
}

function itineraryChild(value) {
  return '<li name="'+value.replace(/\s/g,"")+'"><div class="col-lg-11 col-md-11 col-sm-9 col-xs-9" style="padding-right:0px">'
    +value+'</div><div class="col-lg-1 col-md-1 col-sm-3 col-xs-3" style="padding-left:0px">'
    +'<button type="button" class="btn btn-xs btn-default btn-danger" id="'+value.replace(/\s/g,"")+'">'
    +'<span class="glyphicon glyphicon-remove"></span></button></div><br></li>';
}

function setMarker(coords, name, icon, content) {
  var coordsLatlng = new google.maps.LatLng(coords[0], coords[1]);
  var coordsMarker = new google.maps.Marker({
      position: coordsLatlng,
      title: name,
      icon: icon
  });

  addInfoWindow(coordsMarker, content);

  coordsMarker.setMap(map);
  markers[currentDay].push(coordsMarker);
  setBounds(markers[currentDay]);
};

function duplicate(name) {
  return markers[currentDay].every(function(marker) {
    return marker.title !== name;
  })
}

function setBounds(markersArray) {
   var bounds = new google.maps.LatLngBounds();
   for (var i=0; i < markersArray.length; i++) {
      bounds.extend(markersArray[i].getPosition());
   }
   map.fitBounds(bounds);
}

function removeMarker(element){
  var toBeRemoved = [];

  markers[currentDay].forEach(function(marker, index){
    if(marker.title.replace(/\s/g,"") === element.attr('id')) {
      toBeRemoved.push(index);
    }
  })
  toBeRemoved.reverse().forEach(function(index) {
    markers[currentDay][index].setMap(null);
    markers[currentDay].splice(index, 1);
  })
  if (markers[currentDay].length !== 0) setBounds(markers[currentDay]);
}

function switchDay(day) {
  currentDay = parseInt($(day).attr("id"));
  $('.panel-title').html("Day "+ currentDay +' <button type="button" class="btn btn-xs btn-default btn-danger" id="removeDay'+currentDay+'"><span class="glyphicon glyphicon-remove">');
  
  var id = "#day"+currentDay;

  $(day).siblings().removeClass("active");
  $(day).addClass('active');
  $('#itinerary').children().addClass("hidden");
  $('#itinerary').children().removeClass("current");
  $(id).addClass("current");
  $(id).removeClass("hidden");

  resetMarkers();
}

function resetMarkers() {
  for (var key in markers){
    if (key !== currentDay){
      markers[key].forEach(function(marker){
        marker.setVisible(false);
      });
    };
  };
  if (markers[currentDay].length === 0)
    initialize_gmaps();
  else {
    markers[currentDay].forEach(function(marker){
      marker.setVisible(true);
    });
    setBounds(markers[currentDay]);
  }

}

var infoWindow = new google.maps.InfoWindow({
  content: null
});

function addInfoWindow(marker, message) {

  google.maps.event.addListener(marker, 'click', function () {
      infoWindow.setContent(message);
      infoWindow.open(map, marker);
  });
}

$(function() {
  $( "#draggable" ).draggable();
});

