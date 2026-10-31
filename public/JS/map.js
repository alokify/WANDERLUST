
     {/* let mapToken = mapToken; */}
     mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
     
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v11', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 1  // starting zoom
    });

    // console.log(coordinates);


    const marker = new mapboxgl.Marker( {color: "red"} )
    .setLngLat(listing.geometry.coordinates) // Listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML(
        `<h6>${listing.title}</h6><p>${listing.location}</p>`
    )
    )
    .addTo(map);