function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  const cities = {
    "New York": { lat: 40.7128, long: -74.0060 },
    "San Francisco": { lat: 37.7749, long: -122.4194 },
    "Chicago": { lat: 41.8781, long: -87.6298 },
    "Seattle": { lat: 47.6062, long: -122.3321 },
    "Lansing": { lat: 42.7325, long: -84.5555 }
  };

  let nearestCity = null;
  let minDistance = Number.MAX_VALUE;

  for (const city in cities) {
    const cityLat = cities[city].lat;
    const cityLong = cities[city].long;
    const distance = calculateDistance(latitude, longitude, cityLat, cityLong);
    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  }
  
  // Remove spaces from the nearest city name
  const nearestCityNoSpaces = nearestCity.replace(/\s/g, '');

  // Redirect the user to the HTML page of the nearest city
  let redirect = `${nearestCityNoSpaces}.html`;
  window.location.href = redirect;
  console.log(redirect)
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("User denied the request for Geolocation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.");
      break;
  }
}
