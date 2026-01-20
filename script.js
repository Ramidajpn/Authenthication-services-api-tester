// Global variable to store the token
let token = '';

// Function to request a token from the authentication service
async function requestToken() {
  // Retrieve input values from the HTML form
  const clientId = document.getElementById('clientId').value;
  const clientSecret = document.getElementById('clientSecret').value;
  const authServiceUrl = document.getElementById('authServiceUrl').value;
  const jwtTokenField = document.getElementById('jwtToken'); // Field to display the token or error
  const requestDataBtn = document.getElementById('requestDataBtn'); // Button to request data

  // Validate that the authentication service URL is provided
  if (!authServiceUrl) {
    jwtTokenField.value = 'Error: Please enter Authen Service URL';
    return;
  }

  // Validate that both Client ID and Client Secret are provided
  if (!clientId || !clientSecret) {
    jwtTokenField.value = 'Error: Please enter Client ID and Client Secret';
    return;
  }

  try {
    // Make a POST request to the authentication service to get a token
    const response = await fetch(authServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Specify JSON content type
      },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }) // Send credentials in the request body
    });

    // Check if the response is not OK (status code outside 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Parse error details from the response
      throw new Error(errorData.error || 'Failed to fetch token'); // Throw an error with the message
    }

    // Parse the response JSON to extract the token
    const data = await response.json();
    token = data.token; // Store the token in the global variable
    jwtTokenField.value = token; // Display the token in the field
    requestDataBtn.disabled = false; // Enable the "Request Data" button
  } catch (error) {
    // Handle errors by displaying the error message in the token field
    jwtTokenField.value = `Error: ${error.message}`;
    requestDataBtn.disabled = true; // Disable the "Request Data" button
  }
}

// Function to request data from a target URL using the token
async function requestData() {
  const targetUrl = document.getElementById('targetUrl').value; // Retrieve the target URL from the input field
  const resultField = document.getElementById('result'); // Field to display the result or error

  // Validate that a token is available
  if (!token) {
    resultField.value = 'Error: No token available. Please request a token first.';
    return;
  }

  // Validate that the target URL is provided
  if (!targetUrl) {
    resultField.value = 'Error: Please enter a Target URL';
    return;
  }

  try {
    // Make a GET request to the target URL with the token in the Authorization header
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
        'Content-Type': 'application/json' // Specify JSON content type
      }
    });

    // Check if the response is not OK (status code outside 200-299)
    if (!response.ok) {
      const errorData = await response.json(); // Parse error details from the response
      throw new Error(errorData.error || 'Failed to fetch data'); // Throw an error with the message
    }

    // Parse the response JSON and display it in the result field
    const data = await response.json();
    resultField.value = JSON.stringify(data, null, 2); // Format the JSON data for readability
  } catch (error) {
    // Handle errors by displaying the error message in the result field
    resultField.value = `Error: ${error.message}`;
  }
}