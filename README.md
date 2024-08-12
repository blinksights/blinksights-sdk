# Blinksights SDK

A simple SDK for seamlessly integrating blinksights analytics into your blinks.

## Usage

### Install the blinksights sdk
```
npm install blinksights-sdk
```
### Import the blinksights sdk
```
import { BlinksightsClient } from 'blinksights-sdk';
```
### Create a new Blinksights client
```
const client = new BlinksightsClient('YOUR ACCESS TOKEN');
```

### Track a render event
The url of the blink will be in the request url. You need to pass the url to the `trackRender` method in order to identify the blink.
```
const payload: ActionGetResponse = {
    // ... Your Get Response
};

client.trackRender(request.url, payload);
```

### Track an interaction event
The wallet will make a Post request with the payer's wallet address in the request body. You can access the request body using `request.json()` and then pass the payer's public key to the `trackAction` method. The headers contain other useful information such as the blink url. You can access the headers using `request.headers` and then pass the blink url to the `trackAction` method.
```
// The payer's public key will be in the request body
const body = await request.json();

client.trackAction(request.headers, body.account, request.url);
```

## Key Features
- Track Blink views
- Track Blink interactions
