/**
 * Created by Mosh Mage on 12/16/2016.
 */
export interface IoEventInfo { name: string, count?: number; once?: boolean}
export interface ReceivedEvent { name: string, data?: any; }
export interface SocketState { connected: boolean, id?: string; }

export const initialEvent: ReceivedEvent = {name: "", data: {}};
export const initialState: SocketState = {connected: false};
