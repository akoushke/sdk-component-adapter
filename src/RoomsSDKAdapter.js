import {concat, from, fromEvent} from 'rxjs';
import {finalize, flatMap, publish, refCount} from 'rxjs/operators';
import {RoomsAdapter} from '@webex/component-adapter-interfaces';

export const ROOM_UPDATED_EVENT = 'updated';

/**
 * The `RoomsSDKAdapter` is an implementation of the `RoomsAdapter` interface.
 * This adapter utilizes the Webex JS SDK to fetch data about a room.
 *
 * @export
 * @class RoomsSDKAdapter
 * @extends {RoomsAdapter}
 */
export default class RoomsSDKAdapter extends RoomsAdapter {
  constructor(datasource) {
    super(datasource);

    this.getRoomObservables = {};
  }

  /**
   * Runs setup logic for the SDK rooms plugin.
   */
  async connect() {
    await this.datasource.rooms.listen();
  }

  /**
   * Runs teardown logic for th SDK rooms plugin.
   */
  async disconnect() {
    this.datasource.rooms.off(ROOM_UPDATED_EVENT);
    this.datasource.rooms.stopListening();
    await this.datasource.internal.mercury.disconnect();
  }

  /**
   * Returns room data in the shape required by adapter interface.
   *
   * @private
   * @param {string} ID  ID of the room for which to fetch data
   * @returns {Room}
   * @memberof RoomsSDKAdapter
   */
  async fetchRoom(ID) {
    const {id, title, type} = await this.datasource.rooms.get(ID);

    return {
      ID: id,
      title,
      type,
    };
  }

  /**
   * Returns an observable that emits room data of the given ID.
   *
   * @param {string} ID  ID of room to get
   * @returns {Observable.<Room>}
   * @memberof RoomsSDKAdapter
   */
  getRoom(ID) {
    if (!(ID in this.getRoomObservables)) {
      const room$ = from(this.fetchRoom(ID));
      const roomUpdates$ = fromEvent(this.datasource.rooms.on, ROOM_UPDATED_EVENT).pipe(flatMap(() => room$));

      const source$ = concat(room$, roomUpdates$);

      // Convert to a multicast observable
      this.getRoomObservables[ID] = source$.pipe(
        publish(),
        refCount(),
        finalize(() => {
          delete this.getRoomObservables[ID];
        })
      );
    }

    return this.getRoomObservables[ID];
  }
}
