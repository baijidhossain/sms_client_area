
self.addEventListener('message', function(event) {

  console.log(event.data);

  if (event.data && event.data.authToken) {
    const authToken = event.data.authToken;
    console.log('Received authToken in service worker:', authToken);

    //set interval to fetch the API every 5 seconds
    setInterval(function() {
      fetchApiWithBearerToken(authToken);
    }, 5000);
  }
});

// Define a function to fetch the API with the Bearer token
function fetchApiWithBearerToken(authToken) {
  // Replace 'your_api_url_here' with your actual API endpoint URL
  const apiUrl = 'https://ipbxapi.mdriaz.com/threads/latest?startId=161';

  // Create a request with the Bearer token in the headers
  const request = new Request(apiUrl, {
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });

// Fetch the API
fetch(request)
    .then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        console.error('API request failed:', response.statusText);
      }
    })
    .then(function(data) {
      console.log('API response:', data);
    })
    .catch(function(error) {
      console.error('API request failed:', error);
    });
}