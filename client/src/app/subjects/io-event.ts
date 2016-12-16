import {IoEventInfo, initialEvent, ReceivedEvent} from "./interfaces-and-initial";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

export class ioEvent {
  private clientSocket: any;
  private _lastEvent: BehaviorSubject<ReceivedEvent> = new BehaviorSubject<ReceivedEvent>(initialEvent);
  private _onUpdate: Function;
  private updateData(newData) {
    this._lastEvent.next(newData);
    this.event.count++; /** we will be using "count" has a way of knowing if it has been triggered. */
    if (this._onUpdate) this._onUpdate(newData); /** a way for us to extend properly */
  }

  constructor(public event: IoEventInfo) {
    this.event = event;
  }

  public event$ = this._lastEvent.asObservable();
  public get hasTriggered() { return this.event.count > 0; }
  public get isUnique() {return this.event.once === true; }
  public get name() {return this.event.name; }

  /** */
  public get onUpdate() {return this._onUpdate;}

  /** hook() is an alias to `socket.on()` or `socket.once()` depending on the provided `IoEventInfo` */
  public hook(clientSocket) :void {
    this.clientSocket = clientSocket;
    if (this.event.once) {
      this.event.count = 0;
      this.clientSocket.once(this.event.name, (data) => this.updateData(data));
    }
    else this.clientSocket.on(this.event.name, (data) => this.updateData(data));

    /** This is where magic happens. The callback for every ioEvent is a `SubjectBehavior.next()` call
     * so we can safely `.subscribe()` to the public `event$` prop that each ioEvent has */
  }

  /** unhook is an alias for "off", and since we only have one real callback attached to the Emitter
   * we don't need to pass a `fn` argument */
  public unhook() :void {
    if (this.event.once) return;
    this.clientSocket.off(this.event.name);
  }

  /** a reference to the subscription .getValue() */
  public get lastEvent() {return this._lastEvent.getValue(); }

  /** ioEvent.onUpdate will be called with `newData` if it's truthy */
  public set onUpdate(fn: Function) {
    this._onUpdate = fn;
  }
}
