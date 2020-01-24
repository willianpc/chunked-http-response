# Reading chunks from an HTTP Response

This is a basic example showing how to consume an HTTP data in chunks, from a server previously prepared for sending chunks as well.

## Explanation

1. The server must flush chunks of data and set the HTTP Header response option ``Transfer-Encoding`` to ``chunked``
1. When the server is done with all the data, it should end the response communication
1. The Javascript client side should use `addEventListener('progress', () => {})`. This event will read the chunks
1. The progress event object gives you the current fetched data, which means, ALL the data fetched so far, not only the last chunk
1. The progress event tells you the size of the current fetched data, so you can use this in comparison to the previous data length to extract the latest chunk data only
1. In the Express web server, whenever you send data with `response.write`, Express will automatically set the ``Transfer-Encoding`` header to ``chunked``

### How the server response looks like

```javascript
app.get('/chunk', (req, res) => {
  // Change to the desired content type
  res.setHeader('Content-Type', 'text/plain');
  
  // The code below is used to emulate a response delay
  let counter = 0;
  const MAX = 300;

  let id = setInterval(() => {
    counter += 1;
    if (counter > MAX) {
      clearInterval(id);
      // End the HTTP response
      res.end();
    } else {
      const data = `CHUNK ${counter};`;
      // Sending the chunk. Express will then set the Transfer-Encoding for you
      res.write(data);
    }
  }, 30);
});
```

### How the client request looks like

After initializing XMLHttpRequest, add the `progress` listener:

```javascript
xhr.addEventListener('progress', ev => {
  const request = ev.target;
  // Gets only the new chunk
  const chunk = request.response.substr(loaded, ev.loaded);
  // Fetches the chunk into a div in the page. Replace by whatever you wanna do
  log.innerHTML += chunk + '<br>';
  loaded = ev.loaded;
});
```

The code is available in the repository. Just install the dependencies and run the code:

      $ npm i
      $ npm start

This will start a server in your localhost under port 9090.
