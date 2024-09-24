const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No URL specified' })
    };
  }

  try {
    const response = await fetch(url);
    
    // Get the content type of the response
    const contentType = response.headers.get("content-type");
    
    let data;
    
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();  // Parse as JSON
      return {
        statusCode: 200,
        body: JSON.stringify(data)  // Return as JSON
      };
    } else if (contentType && contentType.includes("image")) {
      const buffer = await response.buffer();  // Get image data as a buffer
      const base64Image = buffer.toString('base64');  // Convert to base64
      return {
        statusCode: 200,
        headers: {
          "Content-Type": contentType,
          "Content-Length": buffer.length
        },
        body: base64Image  // Return base64 image data directly
      };
    } else {
      data = await response.text();  // Get as text for other types
      return {
        statusCode: 200,
        body: data  // Return as plain text
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching the URL.', details: error.message || error })
    };
  }
};


/*const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No URL specified' })
    };
  }

  try {
    const response = await fetch(url);
    //const data = await response.json();
    const contentType = response.headers.get("content-type")
    let data;

    if (contentType && contentType.includes("application/json")) {
      data = await response.json();  // Parse as JSON if the response is JSON
    } else {
      data = await response.text();  // Otherwise, return as plain text (e.g., HTML)
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching the URL.', details: error.message || error })
      //body: JSON.stringify({ error: 'Error fetching the URL.' })
    };
  }
};*/
