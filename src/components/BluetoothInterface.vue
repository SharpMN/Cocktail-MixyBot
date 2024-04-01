<template>
  <div class="flex flex-col gap-4 pb-4" v-bind="$attrs">
    <div class="flex flex-col gap-4 px-4 pt-4">
      <div
        class="flex items-center gap-2 text-white rounded"
        :class="{
          'bg-green-600 max-w-fit': device.id != '',
          'bg-red-600': !bluetooth_enabled,
          'bg-orange-600 max-w-fit': connecting,
          'max-w-fit': initializing,
        }"
      >
        <q-spinner class="m-1" v-if="initializing || connecting" />
        <q-icon
          v-else
          class="p-1 text-white rounded"
          :name="ionBluetooth"
          :class="{
            'bg-red-600': !bluetooth_enabled,
            'bg-green-600': bluetooth_enabled,
          }"
        />
        <div class="pr-2" v-if="!initializing && !connecting">
          <span v-if="device.id != ''">
            Connected to {{ device.name || device.address }}
          </span>
          <span class="text-sm" v-else-if="!location_access">
            Please grant location access to continue.
          </span>
          <span class="text-sm" v-else-if="!bluetooth_enabled">
            Please turn on your device bluetooth and refresh.
          </span>
        </div>
      </div>
      <q-btn
        rounded
        unelevated
        color="secondary"
        label="Refresh"
        @click="init"
        v-if="!bluetooth_enabled && !initializing"
      />
      <!-- <q-btn
        rounded
        unelevated
        v-if="device.id != ''"
        color="negative"
        label="Disconnect"
        :loading="disconnecting"
        :disable="!bluetooth_enabled"
        @click="disconnect(device.address, device)"
      /> -->
      <q-btn
        v-if="bluetooth_enabled"
        rounded
        unelevated
        color="success"
        :label="
          scanning
            ? 'Scanning...'
            : devices.length
            ? 'Rescan Devices'
            : 'Scan Devices'
        "
        :loading="scanning"
        :disable="!bluetooth_enabled || connecting"
        @click="scan"
      />
    </div>
    <q-list separator v-if="devices.length && !scanning && device.id == ''">
      <q-item
        v-ripple
        clickable
        :key="dev.id"
        :button="true"
        :detail="false"
        :disable="connecting"
        @click="connect(dev.address, dev)"
        v-for="dev in devices"
      >
        <q-item-section top avatar>
          <q-avatar color="primary" text-color="white" :icon="ionBluetooth" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ dev.name }}</q-item-label>
          <q-item-label caption lines="2">{{ dev.address }}</q-item-label>
        </q-item-section>
        <q-item-section side v-if="connecting && selectedId == dev.id">
          <q-spinner caption>5 min ago</q-spinner>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
  <slot
    :props="{ disconnect: () => disconnect(device.address, device) }"
  ></slot>
</template>

<script setup lang="ts">
import { BluetoothDevice } from '@speedengineering/capacitor-bluetooth-serial';
import { BluetoothSerial as BTS } from '@awesome-cordova-plugins/bluetooth-serial';
import { onMounted, ref } from 'vue';
import { toast } from 'src/options/helpers';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from 'quasar';
import { ionBluetooth } from '@quasar/extras/ionicons-v5';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';
import { Preferences } from '@capacitor/preferences';

const error = ref('');
const device = ref<BluetoothDevice>({
  name: '',
  id: '',
  address: '',
  class: 0,
  uuid: '',
  rssi: 0,
});
const devices = ref<BluetoothDevice[]>([]);
const scanning = ref(false);
const selectedId = ref('');
const connecting = ref(false);
const initializing = ref(false);
const disconnecting = ref(false);
const location_access = ref(false);
const bluetooth_enabled = ref(false);

const emit = defineEmits([
  'disconnecting',
  'initializing',
  'disconnected',
  'initialized',
  'connecting',
  'connected',
  'scanning',
  'error',
]);

const init = async () => {
  emit('initializing', true);
  initializing.value = true;

  if (Platform.is.capacitor) {
    await SplashScreen.hide();
    Platform.is.android && StatusBar.setBackgroundColor({ color: '#ffffff' });
    const lp = await locationPerms();

    if (!lp) {
      return;
    }
  }

  BTS.isEnabled(
    async () => {
      const { value } = await Preferences.get({ key: 'device' });
      if (value) {
        const device: BluetoothDevice = JSON.parse(value);
        connect(device.address, device);
      } else {
        BTS.list((e) => {
          devices.value = e;
        });
      }
      initializing.value = false;
      bluetooth_enabled.value = true;
      emit('initialized', bluetooth_enabled.value);
    },
    () => {
      bluetooth_enabled.value = false;
      initializing.value = false;
      error.value = 'Bluetooth is not enabled';
      emit('error', error.value);
      toast(error.value);
    }
  );
};

const locationPerms = async () => {
  const msg = () => toast('Bluetooth requires location access to work.');

  location_access.value = true;

  try {
    const { location } = await Geolocation.checkPermissions();
    location_access.value = location === 'granted';

    if (location === 'denied') {
      msg();
      return false;
    }

    if (!location_access.value) {
      const { location } = await Geolocation.requestPermissions({
        permissions: ['location'],
      });

      location_access.value = location === 'granted';
      if (!location_access.value) {
        msg();
        return false;
      }
    }
  } catch (err) {
    error.value = (err as Error).message;
    emit('error', error.value);
    toast('Unable to get location permission: ' + error.value);
    return false;
  }
  return true;
};

const scan = async () => {
  scanning.value = true;
  emit('scanning', true);

  if (device.value.id !== '') {
    disconnect(device.value.id, device.value, false);
  } else {
    emit('disconnected', device.value);
  }

  Preferences.remove({ key: 'device' });
  BTS.discoverUnpaired(
    (list) => {
      devices.value = list;
      scanning.value = false;
    },
    () => {
      scanning.value = false;
      error.value = 'Error scanning devices';
      emit('error', error.value);
      toast(error.value);
    }
  );
};

const connect = async (address: string, dev: BluetoothDevice) => {
  connecting.value = true;
  selectedId.value = dev.id;
  emit('connecting', true);

  return BTS.connect(
    address,
    () => {
      device.value = dev;
      emit('connected', dev);
      device.value = dev;
      connecting.value = false;
    },
    () => {
      error.value = `Unable to connect to ${dev.name}`;
      emit('error', error.value);
      toast(error.value);
      disconnect(device.value.id, device.value, false);
      Preferences.remove({ key: 'device' });
      connecting.value = false;
    }
  ).subscribe();
};

const disconnect = async (
  address: string,
  dev: BluetoothDevice,
  refill = true
) => {
  disconnecting.value = true;
  emit('disconnecting', true);

  device.value = {
    name: '',
    id: '',
    address: '',
    class: 0,
    uuid: '',
    rssi: 0,
  };
  emit('disconnected', device.value);
  // BTS.unsubscribe();
  BTS.disconnect(
    () => {
      refill &&
        BTS.list((list) => {
          devices.value = list;
          disconnecting.value = false;
        });
    },
    () => {
      if (refill) {
        error.value = `Unable to disconnect from ${dev.name}`;
        emit('error', error.value);
        toast(error.value);
      }
      disconnecting.value = false;
    }
  );
};

onMounted(init);
</script>
