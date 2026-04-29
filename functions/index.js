const axios = require('axios');
const fetch = require('node-fetch');

const process = require("node:process");

// Source - https://stackoverflow.com/a/18650828
// Posted by anon, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-28, License - CC BY-SA 4.0

function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

function lmu() {
  console.info(process.memoryUsage());
}

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
    // let res;
    let response;
    // const useAxios = false
    const useAxios = true;
    if (useAxios) {
      // res = await axios.get(url, {
      // const res1 = await axios.get(url, {
      let res1 = await axios.get(url, {
      //response = await axios.get(url, {
      timeout: 30000,
      validateStatus: function (status) {
        // return stats >= 200 && status < 300;
        return status >= 200 && status < 300;
      },
      //maxContentLength: mxCLength,
      //maxBodyLength: mxBodyLen,
      onDownloadProgress: function ({loaded, total, progress, bytes, estimated, rate, download = true}) {
        /*console.info(`Loaded: ${loaded}
Total: ${total}
Prog: ${progress}
Bytes: ${bytes}
Estimated: ${estimated}
Rate: ${rate}
Download: ${download}`);*/
        console.info(`Loaded: ${loaded} (${formatBytes(loaded)})
Total: ${total} (${formatBytes(total)})
Prog: ${progress}
Bytes: ${bytes} (${formatBytes(bytes)})
Estimated: ${estimated}
Rate: ${rate}
Download: ${download}`);
       // console.log(
        console.info(process.memoryUsage());
      },
      signal: new AbortController().signal,
      decompress: false,
      responseType: "stream",
    });
      //const a11 = res1.headers.get("content-type");
      /*res = {
        // headers: res1.headers
        // headers: res1.header
        headers: res1.headers,
        
      };*/
      /*res = {
        // headers: res1.headers
        // headers: res1.header
        headers: res1.headers,
        status: res1.status,
        text: async () => {
          
          // return res1.data;
          return res1.data;
        },
        json: async () => {
          return JSON.parse(res1.data);
        },
      };
      console.log(res1.data);*/
      // res = res1;
      //let chunks = [];
      let chunks = [];
      res1.data.on("data", chunk => {
      //response.data.on("data", chunk => {
        chunks.push(chunk);
        // res1.data = {};
        //console.log(typeof(res1.data));
      });
      await new Promise((res) => {
        // res
        // res1.on("end", () => {
        res1.data.on("end", () => {
        //response.data.on("end", () => {
          console.log("ENDED");
          res();
        });
      });
      
      //response = res1;
      //res1 = null;
      // response = chunks.join("");
      // respones = {
      /*response = {
        status: res1.status,
        data: chunks.join(""),
        headers: res1.headers,
      };*/
      /*response = {
        status: response.status + 1 - 1,
        data: chunks.join(""),
        headers: {
          "content-type": `${response.headers.get("content-type")}`,
        },
      };*/
      response = {
        status: res1.status + 1 - 1,
        data: chunks.join(""),
        headers: {
          "content-type": `${res1.headers.get("content-type")}`,
          get: function(id) {
            return this[id];
          },
        },
      };
      res1 = null;
      //chunks = null;
      chunks.length = 0;
      
    } else {
      // res = await fetch(url);
      response = await fetch(url);
    }
      // const response = res;
    //} else {
    //  res = await fetch(url);
    //}
    //const data = await response.json();
    // const contentType = response.headers.get("content-type")
    const contentType = response.headers.get("content-type");
    // let data;
    // let outData = 
    // let outBody = {};
    let outBody = {
      contentType: contentType,
      statusCode: response.status,
      
    };
    lmu();
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

    // lm();
    lmu();
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
    /*if (contentType && contentType.includes("application/json")) {
      outBody.isJSON = true;
      // outBody.data = await response.json();
      if (useAxios) {
        outBody.data = response.data;
        response = null;
      } else {
        outBody.data = await response.json();
        response = null;
      }
    } else {
      outBody.isJSON = false;
      // outBody.data = await response.text();
      if (useAxios) {
        outBody.data = response.data;
        response = null;
      } else {
        outBody.data = await response.text();
        response = null;
      }
    }*/
    if (contentType && contentType.includes("application/json")) outBody.isJSON = true;
    //global.gc();
    lmu();
    if (useAxios) {

      outBody.data = response.data;
    } else {
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
