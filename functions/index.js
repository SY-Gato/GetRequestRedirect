const axios = require('axios');
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const url = event.queryStringParameters.url;
  const other = event.queryStringParameters.replacenl;//new URL(event.url).searchParams.has("replacenl");
  const ip = event.headers["x-forwarded-for"];
  console.log(other);
  console.log(ip);
  if (other == null) {
    console.log("Not Replacing Newline Characters.");
  }

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'No URL specified' })
    };
  }

  try {
    // const mxCLength: 99999;
    const mxCLength = 99999;
    const mxBodyLen = 99999;
    
    // const response = await fetch(url);
    // const response = await fetch(
    // const res = await axios.get(
    // const res = await axios.get(url, {
    let res;
    const useAxios = false
    if (useAxios) {
      res = await axios.get(url, {
      timeout: 30000,
      validateStatus: function (status) {
        return stats >= 200 && status < 300;
      },
      //maxContentLength: mxCLength,
      //maxBodyLength: mxBodyLen,
      onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
        console.info(`Loaded: ${loaded}
Total: ${total}
Prog: ${progress}
Bytes: ${bytes}
Estimated: ${estimated}
Rate: ${rate}
Download: ${download}`);
      },
      signal: new AbortController().signal,
    });
    } else {
      res = await fetch(url);
    }
      const response = res;
    //} else {
    //  res = await fetch(url);
    //}
    //const data = await response.json();
    const contentType = response.headers.get("content-type")
    // let data;
    // let outData = 
    // let outBody = {};
    let outBody = {
      contentType: contentType,
      statusCode: response.status,
      
    };
    //} else {
    //  res = await fetch(url);
    //}

    /*if (contentType && contentType.includes("application/json")) {
      // data = await response.json(); // Parse as JSON if the response is JSON
      outBody.data = await response.json();
      outBody.isJSON = true;
    } else {
      // data = await response.text();  // Otherwise, return as plain text (e.g., HTML)
      
    }*/

    // const mainTypes = ["application/json", "text/plain", "text/html"
    // const mainTypes = ["application/json", "text/plain", "text/html";
    const mainTypes = ["application/json", "text/plain", "text/html"];

    outBody.isJSON = false;
    
    //if (contentType) {
      /*const ctype = mainTypes.find((type1) => contentType.includes(type1));
      if (ctype) {
        switch (ctype) {
          case "application/json":
            outBody.isJSON = true;
            outBody.data = await response.json();
            break;
          case "text/plain":
            outBody.plainText = true;
            outBody.data = await response.text();
            break;
          case "text/html":
            
        }
      }*/
      /*if (contentType.includes("application/json")) {
        outBody.isJSON = true;
        outBody.data = await response.json();
      }
    }*/
    // outBody.data = await response
    // if (contentType &&.contentType.includes("application/json")) {
    if (contentType && contentType.includes("application/json")) {
      outBody.isJSON = true;
      outBody.data = await response.json();
    } else {
      outBody.isJSON = false;
      outBody.data = await response.text();
    }

    

    /*return {
      statusCode: 200,
      body: JSON.stringify(data)
    }; */
    // return { statusCode
    return {
      statusCode: 200,
      // data: JSON.stringify(outBody)
      body: JSON.stringify(outBody)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching the URL.', details: error.message || error })
      //body: JSON.stringify({ error: 'Error fetching the URL.' })
    };
  }
};
