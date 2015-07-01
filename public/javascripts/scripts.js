function initialize_gmaps() {
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

    var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Fullstack Academy</h1>'+
      '<div id="bodyContent">'+
      '<p>Where the magic happens</p>'+
      '<p>Attribution: 25th floor <a href="http://www.fullstackacademy.com">'+
      'Fullstack Academy</a> '+
      '(last visited December 25, 0).</p>'+
      '</div>'+
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });


    // Add the marker to the map
    var marker = new google.maps.Marker({
        position: myLatlng,
        title:"Hello World!"
    });
    // Add the marker to the map by calling setMap()
    marker.setMap(map);

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map,marker);
    });

    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center); 
    });

}

$(document).ready(function() {
    initialize_gmaps();
});

$(document).ready(function() {
    $('#navbutton').click(function(){
        $('#bs-example-navbar-collapse-1').toggleClass("in");
    });
});




