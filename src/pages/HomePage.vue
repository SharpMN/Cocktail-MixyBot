<template>
  <q-page>
    <BluetoothInterface @connected="onConnected" @disconnected="onDisconnected">
      <template #default="{ props }">
        <ExploreContainer name="Actions" v-if="connected">
          <div class="grid grid-cols-3 gap-2">
            <q-btn
              rounded
              no-caps
              unelevated
              padding="xs"
              align="left"
              class="h-28 !px-1 flex items-center justify-center"
              :class="[
                {
                  'wrap text-white text-sm': !!action.value && connected,
                },
                action.class,
              ]"
              :key="i"
              :loading="sending && command === action.value"
              :disable="(!action.value && !action.bind) || !connected"
              @click="
                action.bind
                  ? action.bind(props)
                  : sendAction(String(action.value))
              "
              v-for="(action, i) in actions"
            >
              <div class="flex flex-col items-center justify-center gap-2">
                <q-icon size="md" :name="action.icon" />
                <q-item-label>
                  {{ action.name }}
                </q-item-label>
              </div>
            </q-btn>
          </div>
        </ExploreContainer>
        <div class="w-full q-pa-md" v-if="progress > 0">
          <q-linear-progress
            size="25px"
            color="primary"
            :value="progress / 100"
          >
            <div class="flex absolute-full flex-center">
              <q-badge
                color="white"
                text-color="accent"
                :label="progress + '%'"
              /></div
          ></q-linear-progress>
        </div>
      </template>
    </BluetoothInterface>
  </q-page>
</template>

<script setup lang="ts">
import BluetoothInterface from 'src/components/BluetoothInterface.vue';
import ExploreContainer from 'src/components/ExploreContainer.vue';
import {
  ionBeer,
  ionRefreshCircle,
  ionWater,
  ionWine,
  ionAirplane,
  ionBoat,
  ionPaw,
  ionFlashOff,
  ionCafe,
} from '@quasar/extras/ionicons-v5';
import { MainAction } from 'src/interfaces';
import { ref } from 'vue';
import { BluetoothDevice } from '@speedengineering/capacitor-bluetooth-serial';
import { BluetoothSerial as BTS } from '@awesome-cordova-plugins/bluetooth-serial';
import { eventsMap, toast } from 'src/options/helpers';
import { Haptics } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';

const error = ref('');
const status = ref('');
const sending = ref<boolean>(false);
const command = ref<number>();
const progress = ref<number>(0);
const connected = ref<BluetoothDevice | null>(null);

const actions: Array<MainAction> = [
  {
    name: 'Setup',
    value: 104,
    icon: ionRefreshCircle,
    class: '!bg-purple-600 !hover:bg-purple-500 !focus:ring-purple-300',
  },
  {
    name: 'Cleanup',
    value: 176,
    icon: ionWater,
    class: '!bg-orange-600 !hover:bg-orange-500 !focus:ring-orange-300',
  },
  {
    name: 'Cosmopolitan',
    value: 48,
    icon: ionWine,
    class: '!bg-fuchsia-600 !hover:bg-fuchsia-500 !focus:ring-fuchsia-300',
  },
  {
    name: 'Vodka Cranberry',
    value: 24,
    icon: ionBeer,
    class: '!bg-pink-600 !hover:bg-pink-500 !focus:ring-pink-300',
  },
  {
    name: 'Vodka Sidecar',
    value: 122,
    icon: ionCafe,
    class: '!bg-teal-600 !hover:bg-teal-500 !focus:ring-teal-300',
  },
  {
    name: 'Seabreeze',
    value: 16,
    icon: ionBoat,
    class: '!bg-purple-600 !hover:bg-purple-500 !focus:ring-purple-300',
  },
  {
    name: 'GreyHound',
    value: 56,
    icon: ionPaw,
    class: '!bg-blue-600 !hover:bg-blue-500 !focus:ring-blue-300',
  },
  {
    name: 'Cape Codder',
    value: 90,
    icon: ionAirplane,
    class: '!bg-emerald-600 !hover:bg-emerald-500 !focus:ring-emerald-300',
  },
  {
    name: 'Disconnect',
    bind: (cb) => cb.disconnect && cb.disconnect(),
    icon: ionFlashOff,
    class: '!bg-red-600 !hover:bg-red-500 !focus:ring-red-300 text-white',
  },
];

const arrayBufferToString = (
  buffer: ArrayBuffer,
  encoding = 'UTF-8'
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const blob = new Blob([buffer], { type: 'text/plain' });
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (evt.target) {
        resolve(evt.target.result as string);
      } else {
        reject(new Error('Could not convert array to string!'));
      }
    };
    reader.readAsText(blob, encoding);
  });
};

const onConnected = async (device: BluetoothDevice) => {
  connected.value = device;
  await Haptics.vibrate();

  await Preferences.set({
    key: 'device',
    value: JSON.stringify(device),
  });

  BTS.subscribeRawData(
    (data) => {
      if (data instanceof ArrayBuffer) {
        arrayBufferToString(data, 'UTF-8').then((e) => {
          status.value = e;
          const map = e.split(':');
          if (map.length >= 2) {
            const [method, param] = map as ['message' | 'duration', never];
            if (['message', 'duration'].includes(method)) {
              eventsMap[method](param, (data: string | number): void => {
                if (method === 'duration' && typeof data === 'number') {
                  progress.value = data < 100 ? data : 0;
                }
              });
            }
          }
        });
      } else {
        console.log(data);
      }
    },
    (error) => {
      console.log(error);
    }
  ).subscribe((data) => {
    console.log(data);
  });
};

const onDisconnected = async () => {
  connected.value = null;
  await Preferences.remove({ key: 'device' });
};

const sendAction = async (value: string): Promise<void> => {
  if (!connected.value) {
    return;
  }
  command.value = Number(value);
  sending.value = true;

  BTS.write(
    value,
    () => {
      sending.value = false;
      delete command.value;
    },
    () => {
      sending.value = false;
      delete command.value;
      error.value = 'Unable to send command';
      toast(error.value);
    }
  );
};
</script>
