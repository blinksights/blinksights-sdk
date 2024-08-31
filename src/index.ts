import axios, { AxiosInstance } from 'axios';
import { ActionGetResponse, LinkedAction } from '@solana/actions';
import { Keypair, TransactionInstruction, PublicKey } from '@solana/web3.js';
import { API_URL } from './constants';
import { createHash } from 'crypto';

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
        Authorization: `Bearer ${apiKey}`,
      },
    });
  }

  /**
   * Create an ActionGetResponse object
   * @param url The URL from the request
   * @param action The blink action object
   * @returns The blink action object with the links updated to include the action identifier
   */
  public async createActionGetResponseV1(url: string, action: ActionGetResponse) {
    try {
      const actionIdentifier = this.createActionIdentifier(url);
      const identityParam = `actionId=${actionIdentifier}`;
      const seperator = url.includes('?') ? '&' : '?';

      await this.axios.post('/api/v2/track-render', {
        url,
        action,
        actionIdentifier,
      });

      if (action.links && action.links.actions.length > 0) {
        const links: LinkedAction[] = action.links.actions.map((link) => ({
          ...link,
          href: `${link.href}${seperator}${identityParam}`,
        }));

        return { ...action, links: { actions: links } };
      }
      return action;
    } catch (error: any) {
      console.error(`An error occurred in createActionGetResponseV1, returning original action.: ${error}`);
      return action;
    }
  }

  /**
   * !!! DEPRECATED - please use createActionGetResponseV1 instead !!!
   * Track a render event
   * @param url The URL of the blink being rendered
   * @param action The blink action object\
   */
  public async trackRenderV1(url: string, action: ActionGetResponse) {
    try {
      await this.axios.post('/api/v1/track-render', {
        url,
        action,
      });
    } catch (error) {
      console.error(`An error occurred in trackRenderV1: ${error}`);
    }
  }

  /**
   * !!! DEPRECATED - please use trackActionV2 instead !!!
   * Track an action event
   * @param headers The request headers
   * @param payerPubKey The payer's public key
   * @param requestUrl The request URL
   */
  public async trackActionV1(headers: Headers, payerPubKey: string, requestUrl: string) {
    try {
      const referrer = headers.get('referer'); // Url of the originial blink

      await this.axios.post('/api/v1/track-action', {
        payerPubKey,
        requestUrl,
        blinkUrl: referrer,
      });
    } catch (error) {
      console.error(`An error occurred in trackActionV1: ${error}`);
    }
  }

  /**
   * Track an action event
   * @param headers The request headers
   * @param payerPubKey The payer's public key
   * @param requestUrl The request URL
   */
  public async trackActionV2(payerPubKey: string, requestUrl: string) {
    try {
      await this.axios.post('/api/v2/track-action', {
        payerPubKey,
        requestUrl,
      });
    } catch (error) {
      console.error(`An error occurred in trackActionV2: ${error}`);
    }
  }

  /**
   * * * !!! DEPRECATED - please use getActionIdentityInstructionV2 instead !!!
   * Get the action identity instruction for tracking the transaction status.
   * @param url The URL of the blink
   * @returns TransactionInstruction
   */
  public async getActionIdentityInstructionV1(headers: Headers, payerPubKey: string) {
    try {
      const identityKeypair = Keypair.generate();
      const timestamp = Date.now();
      const memo = `BlinksightsAction|V1|${timestamp}`;
      const referrer = headers.get('referer'); // Url of the originial blink

      await this.axios.post('api/v1/track-transaction', {
        memo,
        actionIdentityKey: identityKeypair.publicKey.toString(),
        blinkUrl: referrer,
        payerPubKey,
      });

      return new TransactionInstruction({
        keys: [{ pubkey: new PublicKey(payerPubKey), isSigner: true, isWritable: true }],
        data: Buffer.from(`BlinksightsAction|V1|${timestamp}`, 'utf-8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      });
    } catch (error) {
      console.error(`An error occurred in getActionIdentityInstructionV1: ${error}`);
    }
  }

  /**
   * Get the action identity instruction for tracking the transaction status.
   * @param url The URL of the blink
   * @returns TransactionInstruction
   */
  public async getActionIdentityInstructionV2(payerPubKey: string, requestUrl: string) {
    try {
      const timestamp = Date.now();
      const memo = `BlinksightsAction|V2|${timestamp}`;

      await this.axios.post('api/v2/track-transaction', {
        memo,
        payerPubKey,
        requestUrl,
      });

      return new TransactionInstruction({
        keys: [{ pubkey: new PublicKey(payerPubKey), isSigner: true, isWritable: true }],
        data: Buffer.from(`BlinksightsAction|V2|${timestamp}`, 'utf-8'),
        programId: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
      });
    } catch (error) {
      console.error(`An error occurred in getActionIdentityInstructionV2: ${error}`);
    }
  }

  /**
   * Create a blink id for the given url and orgId.
   * @param url
   * @param orgId
   * @returns blink id
   */
  private createActionIdentifier(url: string) {
    return createHash('sha256').update(url).digest('hex');
  }
}
