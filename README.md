# callback-to-promise
Simple library for turning callbacks into promises. Works both in browsers with support of `let` and promises and in NodeJS
# API

 -     callbackToPromise(function, string or object, mask array)
	Equals to callbackToPromise.wrapFunction
 -     callbackToPromise.wrapFunction(function, string or object, mask array)
	Wraps function by mask. 1, true, "then" and "resolve" mean callback for `.then()` and -1, false, "catch" and "reject" mean callback for `.catch()`.
	If first argument is string then it's replaced by `function(){return this[key].apply(this,arguments)}`, where `key` is that argument.
	If first argument is object, then function is taken from it's property, named "function" and all other properties are passed to  `callbackToPromise.mkPair()`.
**By default, maxLength is set to -1, so callback will be triggered only once!**
    Returned value is function, which takes same arguments as wrapped function with expection of callbacks and returns promise with some additional properties: 
    
         `retval`: value, returned by original function
         `pair`: pair of callback and promise generator returned by `callbackToPromise.mkPair()`
- `callbackToPromise.mkPair([{maxLength: 0}],[object,key,[rejectKey]])`  
  generates pair of callbacks and promise factory
  if arguments `object` and `key` are presented, then it sets `object[key]` with `resolveCallback`. If `rejectKey` is also presented then it sets  `object[rejectKey]` with `rejectCallback`.  
  If maxLength is greater than zero then it is the maximal size of message queue.   If maxLength is equal to -1 then callback will work **only once**
  Returns: 
```
  {resolveCallback: callback, which passess it's results to .then(),
   rejectCallback: callback, which passess it's results to .catch(), 
   mkPromise(): function, which return promises, paired with those callbacks}

```
  **Example**
```javascript
(async function(){
	let ws = new WebSocket('wss://echo.websocket.org');
	await callbackToPromise.mkPair({},ws,'onopen').mkPromise()
	ws.receive = callbackToPromise.mkPair({},ws,'onmessage').mkPromise
	ws.send('Hello world!')
	console.log(await ws.receive())
})()
```

