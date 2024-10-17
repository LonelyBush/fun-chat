import { RequestData } from '../interfaces/interface';
import { p } from '../base_components/tags';

type ResponseCallback = (response: RequestData) => void;
type MessageHandler = (message: string) => void;
export class Connection {
  private socket: WebSocket;

  private requestCallbacks: Map<string, ResponseCallback>;

  private responseCallbacks: Map<null, ResponseCallback>;

  private messageHandlers: Map<string | null, MessageHandler>;
  // ws://localhost:4000/

  constructor(url: string) {
    this.socket = new WebSocket(url);
    this.requestCallbacks = new Map();
    this.responseCallbacks = new Map();
    this.messageHandlers = new Map();
    this.socket.addEventListener('message', (event) => { this.handleMessage(event); });
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data;
    const handler = this.messageHandlers.get(null) || this.messageHandlers.get(message);
    if (handler) {
      handler(message);
    }
  }

  public addEventListener(event: string | null, listener: MessageHandler): void {
    this.messageHandlers.set(event, listener);
  }

  connect() {
    this.socket.addEventListener('error', () => { console.error('Please, restore connection, unable to reach server connection!'); });
    this.socket.addEventListener('open', () => {
      console.log('Connection done');
    });
    this.socket.addEventListener('message', (event) => {
      const getData = JSON.parse(event.data);
      if (this.requestCallbacks.has(getData.id)) {
        const callback = this.requestCallbacks.get(getData.id);
        if (callback) {
          callback(getData);
        }
        this.requestCallbacks.delete(getData.id);
      }
      if (this.responseCallbacks.has(null)) {
        const callBack = this.responseCallbacks.get(null);
        if (callBack) {
          callBack(getData);
        }
      }
    });
    this.socket.addEventListener('close', () => {
      const createError = p('error-response', 'Error: Connetction to server is Lost! Please reconnect as soon as possible!', 'error-mes');
      document.body.append(createError.getNode());
      setTimeout(() => {
        createError.getNode().remove();
      }, 5000);
    });
  }

  sendMessage(data: RequestData, callback: ResponseCallback) {
    const requestData: RequestData = data;
    this.requestCallbacks.set(requestData.id, callback);
    this.socket.send(JSON.stringify(requestData));
  }

  getResponseData(callBack: ResponseCallback) {
    this.responseCallbacks.set(null, callBack);
  }
}
