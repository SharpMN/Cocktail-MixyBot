
declare module '@awesome-cordova-plugins/bluetooth-serial' {
  import { BluetoothDevice } from '@speedengineering/capacitor-bluetooth-serial';
  import { AwesomeCordovaNativePlugin } from '@awesome-cordova-plugins/core';
  import { Observable } from 'rxjs';
  /**
   * @name Bluetooth Serial
   * @description This plugin enables serial communication over Bluetooth. It was written for communicating between Android or iOS and an Arduino (not Android to Android or iOS to iOS).
   * @usage
   * ```typescript
   * import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
   *
   * constructor(private bluetoothSerial: BluetoothSerial) { }
   *
   *
   * // Write a string
   * this.bluetoothSerial.write('hello world').then(success, failure);
   *
   * // Array of int or bytes
   * this.bluetoothSerial.write([186, 220, 222]).then(success, failure);
   *
   * // Typed Array
   * var data = new Uint8Array(4);
   * data[0] = 0x41;
   * data[1] = 0x42;
   * data[2] = 0x43;
   * data[3] = 0x44;
   * this.bluetoothSerial.write(data).then(success, failure);
   *
   * // Array Buffer
   * this.bluetoothSerial.write(data.buffer).then(success, failure);
   * ```
   */
  class BluetoothSerialOriginal extends AwesomeCordovaNativePlugin {
    /**
     * Connect to a Bluetooth device
     *
     * @param {string} macAddress_or_uuid Identifier of the remote device
     * @returns {Observable<any>} Subscribe to connect, unsubscribe to disconnect.
     */
    connect (macAddress_or_uuid: string, success?: () => void, failure?: () => void): Observable<Promise<void> | void>;
    /**
     * Connect insecurely to a Bluetooth device
     *
     * @param {string} macAddress Identifier of the remote device
     * @returns {Observable<any>} Subscribe to connect, unsubscribe to disconnect.
     */
    connectInsecure (macAddress: string, success?: () => void, failure?: () => void): Observable<Promise<void> | void>;
    /**
     * Disconnect from the connected device
     *
     * @returns {Promise<any>}
     */
    disconnect (success?: () => void, failure?: () => void): Promise<void> | void;
    /**
     * Writes data to the serial port
     *
     * @param {any} data ArrayBuffer of data
     * @returns {Promise<any>} returns a promise when data has been written
     */
    write (data: string | string[], success?: (data: string) => void, failure?: () => void): Promise<void> | void;
    /**
     * Gets the number of bytes of data available
     *
     * @returns {Promise<any>} returns a promise that contains the available bytes
     */
    available (): Promise<void> | void;
    /**
     * Reads data from the buffer
     *
     * @returns {Promise<any>} returns a promise with data from the buffer
     */
    read (): Promise<void> | void;
    /**
     * Reads data from the buffer until it reaches a delimiter
     *
     * @param {string} delimiter string that you want to search until
     * @returns {Promise<any>} returns a promise
     */
    readUntil (delimiter: string): Promise<void> | void;
    /**
     * Subscribe to be notified when data is received
     *
     * @param {string} delimiter the string you want to watch for
     * @returns {Observable<any>} returns an observable.
     */
    subscribe (delimiter: string, success?: (data: string) => void, failure?: () => void): Observable<Promise<void> | void>;
    /**
     * Subscribe to be notified when data is received
     *
     * @returns {Observable<Promise<void> | void>} returns an observable.
     */
    unsubscribe (success?: (data: string) => void, failure?: () => void): Observable<Promise<void> | void>;
    /**
     * Subscribe to be notified when data is received
     *
     * @returns {Observable<any>} returns an observable
     */
    subscribeRawData (success?: (data: string | ArrayBuffer) => void, failure?: (data: string) => void): Observable<Promise<void> | void>;
    /**
     * Clears data in buffer
     *
     * @returns {Promise<any>} returns a promise when completed
     */
    clear (): Promise<void> | void;
    /**
     * Lists bonded devices
     *
     * @returns {Promise<any>} returns a promise
     */
    list (success?: (e: BluetoothDevice[]) => void, failure?: () => void): Promise<void> | void;
    /**
     * Reports if bluetooth is enabled
     *
     * @returns {Promise<any>} returns a promise
     */
    isEnabled (success?: () => void, failure?: () => void): Promise<boolean> | boolean;
    /**
     * Reports the connection status
     *
     * @returns {Promise<any>} returns a promise
     */
    isConnected (success?: () => void, failure?: () => void): Promise<void> | void;
    /**
     * Reads the RSSI from the connected peripheral
     *
     * @returns {Promise<any>} returns a promise
     */
    readRSSI (): Promise<void> | void;
    /**
     * Show the Bluetooth settings on the device
     *
     * @returns {Promise<any>} returns a promise
     */
    showBluetoothSettings (): Promise<void> | void;
    /**
     * Enable Bluetooth on the device
     *
     * @returns {Promise<any>} returns a promise
     */
    enable (): Promise<void> | void;
    /**
     * Discover unpaired devices
     *
     * @returns {Promise<any>} returns a promise
     */
    discoverUnpaired (success?: (e: BluetoothDevice[]) => void, failure?: () => void): Promise<void> | void;
    /**
     * Subscribe to be notified on Bluetooth device discovery. Discovery process must be initiated with the `discoverUnpaired` function.
     *
     * @returns {Observable<any>} Returns an observable
     */
    setDeviceDiscoveredListener (): Observable<Promise<void> | void>;
    /**
     * Sets the human readable device name that is broadcasted to other devices
     *
     * @param {string} newName Desired name of device
     */
    setName (newName: string): void;
    /**
     * Makes the device discoverable by other devices
     *
     * @param {number} discoverableDuration Desired number of seconds device should be discoverable for
     */
    setDiscoverable (discoverableDuration: number): void;
  }

  export const BluetoothSerial: BluetoothSerialOriginal;
}
