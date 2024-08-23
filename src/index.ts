import axios, {AxiosInstance} from 'axios';
import { ActionGetResponse } from '@solana/actions';
import { Keypair, TransactionInstruction, PublicKey } from '@solana/web3.js';
import { API_URL } from './constants';

export class BlinksightsClient {
    private axios: AxiosInstance;

    /**
     * Create a new Blinksights client
     * @param apiKey The API key
     */
    constructor(apiKey: string) {
        this.axios = axios.create({
            baseURL: API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
    }

    /**
     * Track a render event
     * @param url The URL of the blink being rendered
     * @param action The blink action object\
     */
    public async trackRenderV1(url: string, action: ActionGetResponse){

        this.axios.post('/api/v1/track-render', {
            "url": url,
            "action": action
        });
    }

    /**
     * Track an action event
     * @param headers The request headers
     * @param payerPubKey The payer's public key
     * @param requestUrl The request URL
     */
    public async trackActionV1(headers: Headers, payerPubKey: string, requestUrl: string){  
        const referrer = headers.get('referer'); // Url of the originial blink

        this.axios.post('/api/v1/track-action', {
            "payerPubKey": payerPubKey,
            "requestUrl": requestUrl,
            "blinkUrl": referrer
        });
    }

     /**
     * Get the action identity instruction for tracking the transaction status.
     * @param url The URL of the blink
     * @returns TransactionInstruction
     */
     public getActionIdentityInstructionV1(headers: Headers, payerPubKey: string){
        const identityKeypair = Keypair.generate();
        const timestamp = Date.now();
        const memo = `BlinksightsAction|V1|${timestamp}`;
        const referrer = headers.get('referer'); // Url of the originial blink

        this.axios.post('api/v1/track-transaction',{
            "memo": memo,
            "actionIdentityKey": identityKeypair.publicKey.toString(),
            "blinkUrl": referrer,
            "payerPubKey": payerPubKey
        })

        return new TransactionInstruction({
            keys: [{pubkey: new PublicKey(payerPubKey), isSigner: true, isWritable: true}],
            data: Buffer.from(`BlinksightsAction|V1|${timestamp}`, "utf-8"),
            programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr")
        });

    }
}

