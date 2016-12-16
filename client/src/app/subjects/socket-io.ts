import {ioEvent} from "./io-event";
import {SocketState, initialState} from "./interfaces-and-initial";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import * as io from 'socket.io-client';

const SOCKET_URL = "http://localhost:5000";

export class IO {
  /** this will be set as a reference to io.Socket */
  private socket: any;

  /** events will be used to push which events we should be listening to */
  private events: ioEvent[] = [];

  private _socketState: BehaviorSubject<SocketState> = new BehaviorSubject<SocketState>(initialState);
  public event$ = this._socketState.asObservable();

  /** this prop will pretty much control the "is connected" or not.
   * it also controls whether or not we should issue this.socket.disconnect() */
  private _connected: boolean = false;

  constructor() {}

  /** a reference to the subscription .getValue() */
  public get socketState() {return this._socketState.getValue(); }

  /** an alias for Socket.emit() */
  public emit(eventName: string, data: Object) {
    console.log(this.connected)
    if (this.connected) {
      this.socket.emit(eventName, data);
    }
  }

  /** check if Event exists so we don't pollute the events list with dupes
   * EVEN if it's a `once` event, as one change will trigger all listeners */
  public eventExists(ioEvent :ioEvent) :boolean {
    return this.events.some(_ioEvent => {
      return !_ioEvent.hasTriggered && _ioEvent.isUnique && _ioEvent.name === ioEvent.name ||
        !_ioEvent.isUnique && _ioEvent.name === ioEvent.name;
    });
  }

  /** pushes an ioEvent to be heard */
  public listenToEvent(ioEvent: ioEvent) :void {
    if (!this.eventExists(ioEvent)) this.events.push(ioEvent);
  }

  /**
   * Makes a new connection to the @SOCKET_URL const and sets up a `on connect` by default
   * which will in turn update the @this._socketState Subject with the GameEvent containing
   * the received data as an argument (as well as the event-name)
   * @param nickname {String}     used on first connect emit
   * @param forceNew {Boolean}
   */
  public connect(address?: string, forceNew?:boolean) :void {
    if (this.connected && !forceNew) return;
    else if (this.connected && forceNew) this.connected = false;

    this.socket = io(address || SOCKET_URL);
    this.socket.on('connect', () => {
      this.connected = true;
      this.socket.emit('hello',{world: 'rimshot'});

      this._socketState.next({connected: true, id: this.socket.id || 1 });
      this.events.forEach(ioEvent => {
        /** this is where we hook our previously new()ed ioEvents to the socket.
         * This is so we can have one listener per event. as opposed to one event
         * to all listeners (that would kinda defeat the "io" part of "SocketIO")
         * */
        ioEvent.hook(this.socket);
      });

      this.socket.on('disconnect', () => {
        this.connected = false;
      })
    });
  };

  /**
   * If anyone makes a this.connect = false; the connection to the socket.io should be closed
   * and another default error set.
   * @param value
   * @returns {boolean}
   */
  public get connected() {return this._connected; }
  public set connected(value: boolean) {
    if (value === false && this.connected) {
      this.socket.disconnect();
      this._socketState.next({connected: false});
    }
    this._connected = value;
  };
  public set socketState(v) {return;}
}
