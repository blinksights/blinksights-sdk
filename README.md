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
You can create an ActionGetResponse object using the `createActionGetResponseV1` method. By using this ActionGetResponse you will be able to track the performance of your Solana Blinks.
```typescript
const payload: ActionGetResponse = client.createActionGetResponseV1(request.url, {
    "title": "Realms DAO Platform",
    "icon": "<url-to-image>",
    "description": "Vote on DAO governance proposals #1234.",
    "label": "Vote",
    links: {
        actions: [
            {
                "label": "Vote Yes", // button text
                "href": "/api/proposal/1234/vote?choice=yes"
            },
        ],
    },
});

return new Response(JSON.stringify(payload), {
    status: 200,
    headers: ACTIONS_CORS_HEADERS,
});
```

### Track an interaction event in your `POST` request handler
The wallet will make a `POST` request with the payer's wallet address in the request body. You can access the request body using `request.json()` and then pass the payer's public key to as well as the Solana Blink URL to the `trackActionV2` method.
```typescript
// The payer's public key will be in the request body
const body = await request.json();

client.trackActionV2(account, request.url);
```

### Track conversions
If you want to track the conversions of your Solana Blink, you need to include a memo instruction in the transactions so that we can search for the transactions on-chain and check its confirmation status. To do this, you can call the `getActionIdentityInstructionV2` method along with the payer's public key and request URL. This function will return a transaction instruction that you can include in your transaction as follows:
```typescript
// Call getActionIdentityInstructionV1 in your POST request handler
const blinksightsActionIdentityInstruction = client.getActionIdentityInstructionV2(account, request.url);

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
