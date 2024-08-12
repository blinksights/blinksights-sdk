import axios, {AxiosInstance} from 'axios';

export class BlinksightsClient {
    private axios: AxiosInstance;

    /**
     * Create a new Blinksights client
     * @param apiKey The API key
     */
    constructor(apiKey: string) {
        this.axios = axios.create({
            baseURL: 'http://localhost:4000/', // TODO: update this to the correct URL
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
    public async trackRender(url: string, action: object){
        

        this.axios.post('/api/v1/track-render', {
            "url": url,
            "action": action
        });
    }

    /**
     * Track an action event
     * @param headers The request headers
     * @param pubKey The user's public key
     * @param referer The referer URL
     * @param requestUrl The request URL
     */
    public async trackAction(headers: Headers, pubKey: string | null, requestUrl: string | null){     
        const params = requestUrl !== null ? requestUrl.split('?') : null;

        this.axios.post('/api/v1/track-action', {
            "referer": headers.get('referer'),
            "pubKey": pubKey,
            "params": params !== null ? params[1] : null,
            "requestUrl": params !== null ? params[0] : null
        });
    }
}

