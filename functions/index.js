const axios = require('axios');
const fetch = require('node-fetch');

const process = require("node:process");

// My piping

// Source - https://stackoverflow.com/a/18650828
// Posted by anon, modified by community. See post 'Timeline' for change history
// Retrieved 2026-04-28, License - CC BY-SA 4.0

function formatBytes(a,b=2){if(!+a)return"0 Bytes";const c=0>b?0:b,d=Math.floor(Math.log(a)/Math.log(1024));return`${parseFloat((a/Math.pow(1024,d)).toFixed(c))} ${["Bytes","KiB","MiB","GiB","TiB","PiB","EiB","ZiB","YiB"][d]}`}

function lmuOLD() {
  console.info(process.memoryUsage());
}
let lmu_var;
function lmu() {
  lmu_var = process.memoryUsage();
  lmu_var["rss"] = formatBytes(lmu_var["rss"]);
  lmu_var["heapTotal"] = formatBytes(lmu_var["heapTotal"]);
  lmu_var["heapUsed"] = formatBytes(lmu_var["heapUsed"]);
  lmu_var["external"] = formatBytes(lmu_var["external"]);
  lmu_var["arrayBuffers"] = formatBytes(lmu_var["arrayBuffers"]);
  console.info(lmu_var);
  lmu_var = undefined;
  
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
    lmu();
    const mxCLength = 99999;
    const mxBodyLen = 99999;
    // let response;
    // const useAxios = false
    // const outDt = await axios.get(url, {
    let outDt = await axios.get(url, {
      timeout: 30000,
      validateStatus: function (status) {
        // return stats >= 200 && status < 300;
        return status >= 200 && status < 300;
      },
      signal: new AbortController().signal,
      decompress: false,
      responseType: "stream",
    });
    console.log(typeof(outDt.data));
    // console.log(outDt.data instanceof Stream);
    console.log(outDt.data instanceof ReadableStream);
    console.log(outDt.data instanceof WritableStream);
    lmu();
    /*await new Promise((res) => {
      outDt.data.on("end", () => {res();});
    });*/
    /*await new Promise((thisRes) => {
      outDt.data.on("end", () => {
        // res();
        thisRes();
      });
    });*/
    lmu();


    let outBody = {
      data: "hi",
    };

    let newReadAble = new ReadableStream(outDt.data);
  
    /*return {
      statusCode: 200,
      // data: JSON.stringify(outBody)
      body: JSON.stringify(outBody)
    };*/
    //re
    // return new Response(outDt.data);
    /*return {
      statusCode: 200,
      body: outDt.data
    };*/
    /*return {
      statusCode: 200,
      // body: JSON.stringify(outDt.data),
    };*/
    /*let res_1 = new Response(outDt.data, {
      status: 200,
      headers: {
        // "content-type": outDt.headers.get("content-type"),
        "content-type": `${outDt.headers.get("content-type")}`,
      },
    });
    return res_1;*/
    /*return {
      statusCode: 200,
      body: outDt.data.getReader(),
    };*/
    return {
      statusCode: 200,
      // body: new ReadableStream(outD
      body: newReadAble,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error fetching the URL.', details: error.message || error })
      //body: JSON.stringify({ error: 'Error fetching the URL.' })
    };
  }
};
