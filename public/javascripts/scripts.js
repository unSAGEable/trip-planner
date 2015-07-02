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

google.maps.event.addDomListener(window, "resize", function() {
  var center = map.getCenter();
  google.maps.event.trigger(map, "resize");
  map.setCenter(center); 
});

// function initialize_gmaps() {

//     var contentString = '<div id="content">'+
//       '<div id="siteNotice">'+
//       '</div>'+
//       '<h1 id="firstHeading" class="firstHeading">Fullstack Academy</h1>'+
//       '<div id="bodyContent">'+
//       '<p>Where the magic happens</p>'+
//       '<p>Attribution: 25th floor <a href="http://www.fullstackacademy.com">'+
//       'Fullstack Academy</a> '+
//       '(last visited December 25, 0).</p>'+
//       '</div>'+
//       '</div>';

//     var infowindow = new google.maps.InfoWindow({
//       content: contentString
//     });


//     // Add the marker to the map
//     // var marker = new google.maps.Marker({
//     //     position: myLatlng,
//     //     title:"Hello World!"
//     // });
//     // // Add the marker to the map by calling setMap()
//     // marker.setMap(map);

//     // google.maps.event.addListener(marker, 'click', function() {
//     //     infowindow.open(map,marker);
//     // });


// }
var currentDay = 1;
var markers = {};
var days = 1;

$(document).ready(function() {
    // initialize_gmaps();
    $('#navbutton').click(function(){
      $('#bs-example-navbar-collapse-1').toggleClass("in");
    });


    //adds item and marker
    $('#addhotel').click(function() {
      var hotelName = $('#selecthotel').val();
      $('.current #hotellist').append(itineraryChild(hotelName));
      //Add pointer to map
      all_hotels.forEach(function(hotel) {
        if (hotel.name === hotelName) {
          var coords = hotel.place[0].location;
          setMarker(coords, hotelName);
        }
      })
    });

    $('#addthing').click(function() {
      var thingName = $('#selectthing').val();
      $('.current #thinglist').append(itineraryChild(thingName));

      all_things.forEach(function(thing) {
        if (thing.name === thingName) {
          var coords = thing.place[0].location;
          setMarker(coords, thingName);
        }
      })
    });

    $('#addrestaurant').click(function() {
      var restaurantName = $('#selectrestaurant').val();
      $('.current #restaurantlist').append(itineraryChild(restaurantName));

      all_restaurants.forEach(function(restaurant) {
        if (restaurant.name === restaurantName) {
          var coords = restaurant.place[0].location;
          setMarker(coords, restaurantName);
        }
      })
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
      currentDay = $(this).attr("id");
      $('.panel-title').html("Day "+ currentDay +' <button type="button" class="btn btn-xs btn-default btn-danger" id="removeDay'+currentDay+'"><span class="glyphicon glyphicon-remove">');
      
      var id = "#day"+currentDay;

      $(this).siblings().removeClass("active");
      $(this).addClass('active');
      $('#itinerary').children().addClass("hidden");
      $('#itinerary').children().removeClass("current");
      $(id).addClass("current");
      $(id).removeClass("hidden");

      for(var key in markers){
        if(key !== currentDay){
          markers[key].forEach(function(marker){
            marker.setVisible(false);
          });
        };
      };
      
      if (markers[currentDay]) {
        markers[currentDay].forEach(function(marker){
          marker.setVisible(true);
        });
      }

    });

    //remove days
    $('.panel-title').on('click', '.btn-danger', function() {
      $('.pagination').find('[id="'+currentDay+'"]').remove();
    })

});


//Functions
function itineraryChild(value) {
  return '<li name="'+value.replace(/\s/g,"")+'"><div class="col-lg-11" style="padding-right:0px">'
    +value+'</div><div class="col-lg-1" style="padding-left:0px">'
    +'<button type="button" class="btn btn-xs btn-default btn-danger" id="'+value.replace(/\s/g,"")+'">'
    +'<span class="glyphicon glyphicon-remove"></span></button></div><br></li>';
}

function setMarker(coords, name) {
  var coordsLatlng = new google.maps.LatLng(coords[0], coords[1]);
      var coordsMarker = new google.maps.Marker({
          position: coordsLatlng,
          title: name
      });
      coordsMarker.setMap(map);
      if (currentDay in markers)
        markers[currentDay].push(coordsMarker);
      else markers[currentDay] = [coordsMarker];
      setBounds(markers[currentDay]);
};

function setBounds(markersArray) {
   var bounds = new google.maps.LatLngBounds();
   for (var i=0; i < markersArray.length; i++) {
       bounds.extend(markersArray[i].getPosition());
   }
   map.fitBounds(bounds);
}

function removeMarker(element){
    markers[currentDay].forEach(function(marker, index){
      if(marker.title.replace(/\s/g,"") === element.attr('id')){
        marker.setMap(null);
        markers[currentDay].splice(index, 1);
      }
    })
  if(markers[currentDay].length !== 0) setBounds(markers[currentDay]);
}




