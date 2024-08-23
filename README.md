# Solana Blink Analytics

A simple SDK for seamlessly integrating Blinksights analytics into Solana Blinks.

## Usage

Before you start, make sure you have a Blinksights account and API key. You can create an account and API key at [blinksights.xyz](https://blinksights.xyz).

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
The URL of the Solana Blink will be passed in the request URL. You need to pass the URL to the `trackRenderV1` method to identify the Solana Blink.
```typescript
const payload: ActionGetResponse = {
    // ... Your Get Response
};

client.trackRenderV1(request.url, payload);
```

### Track an interaction event in your `POST` request handler
The wallet will make a `POST` request with the payer's wallet address in the request body. You can access the request body using `request.json()` and then pass the payer's public key to the `trackActionV1` method. The headers contain other useful information, such as the Solana Blink URL. You can access the headers using `request.headers` and then pass the Solana Blink URL to the `trackActionV1` method.
```typescript
// The payer's public key will be in the request body
const body = await request.json();

client.trackActionV1(request.headers, body.account, request.url);
```

### Track conversions
If you want to track the conversions of your Solana Blink, you need to include a Memo instruction in the transactions so that we can search for the transactions on-chain and check its confirmation status. To do this, you can call the getActionIdentityInstructionV1 method along with the headers and the payer's public key. This function will return a transaction instruction that you can include in your transaction as follows:
```typescript
// Call getActionIdentityInstructionV1 in your POST request handler
const blinksightsActionIdentityInstruction = client.getActionIdentityInstructionV1(request.headers, account);

// Add the instruction to your transaction
const messageV0 = new TransactionMessage({
    payerKey: accountPubKey,
    recentBlockhash: blockhash,
    instructions: [
        //.. Your instructions
        blinksightsActionIdentityInstruction,
    ],
}).compileToV0Message(addressLookupTableAccounts);
```

## Key Features
- Track Solana Blink Views
- Track Solana Blink Interactions
- Track Solana Blink Conversions
