# Blinksights SDK

A simple SDK for seamlessly integrating blinksights analytics into your blinks.

## Usage

### Install the blinksights sdk
```
npm install blinksights-sdk
```
### Create a new Blinksights client
```
const client = new BlinksightsClient('<Bearer Token>', '<API URL>');
```

### Track a render event
```
const payload: ActionGetResponse = {
    // ... Your Get Response
};

client.trackRender(request.url, payload);
```

### Track an interaction event
```
client.trackAction(request.headers, userPublicKey, request.url);
```

## Key Features
- Track Blink views
- Track Blink interactions
