# Blinksights SDK

A simple SDK for seamlessly integrating Blinksights analytics into your Blinks.

## Usage

### Install the Blinksights SDK
```
npm install blinksights-sdk
```
### Import the Blinksights SDK
```typescript
import { BlinksightsClient } from 'blinksights-sdk';
```
### Create a new Blinksights client
```typescript
const client = new BlinksightsClient('YOUR ACCESS TOKEN');
```

### Track a render event in your `GET` request handler
The URL of the Blink will be passed in the request URL. You need to pass the URL to the `trackRender` method to identify the Blink.
```typescript
const payload: ActionGetResponse = {
    // ... Your Get Response
};

client.trackRender(request.url, payload);
```

### Track an interaction event in your `POST` request handler
The wallet will make a `POST` request with the payer's wallet address in the request body. You can access the request body using `request.json()` and then pass the payer's public key to the `trackAction` method. The headers contain other useful information, such as the Blink URL. You can access the headers using `request.headers` and then pass the Blink URL to the `trackAction` method.
```typescript
// The payer's public key will be in the request body
const body = await request.json();

client.trackAction(request.headers, body.account, request.url);
```

## Key Features
- Track Blink views
- Track Blink interactions
