<template>
  <q-page>
    <ExploreContainer name="Actions" class="overflow-y-scroll max-h-[85vh]">
      <article>
        This app is a remote control for an Arduino based cocktail maker using
        HC-05 Bluetooth module
      </article>
      <br />
      <h1 class="text-xl text-bold">Platform</h1>
      <article>
        This app was built using Quasar Framework which utilizes CapacitorJs
        under the hood to enable builing native applications using just HTML,
        CSS and Javascript.
      </article>
      <br />
      <h1 class="text-xl text-bold">How is it possible?</h1>
      <article>
        The app also uses the
        <code class="text-orange-600">cordova-plugin-Bluetooth-serial</code>
        Cordova plugin to enable device communication via Bluetooth legacy
        serial mode.
      </article>
      <br />
      <h1 class="text-xl text-bold">Initialization</h1>
      <article>
        To initiate a connection, the app first checks if the phone's Bluetooth
        is currently active, if Bluetooth is active, it will attempt to connect
        to the last connected device if it was not disconnected before the app
        was closed. Where the phone's Bluetooth is not active, the user is
        prompted to activate the Bluetooth, and the process is repeated again.
      </article>
      <br />
      <h1 class="text-xl text-bold">Device Search and Listing</h1>
      <article>
        Once the app has established a connection with the phone's Bluetooth, a
        list of previously paired devices are presented to the user, where none
        of the listed devices matches the user's desired device to be connected
        to, the user can initiate a search by tapping on the
        <code class="text-orange-600">Scan Devices</code> or
        <code class="text-orange-600">Rescan Devices</code> button to get a
        fresh list of currently active devices.
      </article>
      <br />
      <h1 class="text-xl text-bold">Pairing and Connection</h1>
      <article>
        Once a user has determined the device they want to connect to from the
        device list presented from the previous step, the user can now tap on
        specific device's name to attempt a connection, where the selected
        device is supprted by the serial mode specifically the Bluetooh HC-05
        module, a connection will be establised and the Cocktail selection
        screen will be presented to the user.
      </article>
      <br />
      <h1 class="text-xl text-bold">Sending Commands</h1>
      <article>
        Now that the user is connected to the Bluetooth device, the user can now
        select a prefered Cocktail. Each Cocktail button presented to the user
        is mapped to a corresponding command (Numeric String) that has already
        been preprogrammed to be translatable by the Cocktail program running on
        the Arduino.
        <br />
        Once a Cocktail button is tapped on, the command is sent to the
        Bluetooth module for proccessing.
      </article>
      <br />
      <h1 class="text-xl text-bold">Listening for Events</h1>
      <article>
        The app expects the Bluetooth module to return two specific string
        response formats which are subsequently treated as events and handled as
        needed. The first is the
        <code class="text-orange-600 whitespace-nowrap">duration:[number]</code>
        which passes the duration for which a command will run from Arduino to
        the phone and the other is the
        <code class="text-orange-600 whitespace-nowrap">message:[string]</code>
        which will be interpreted as a notification to be shown to the user.
      </article>
    </ExploreContainer>
  </q-page>
</template>

<script setup lang="ts">
import ExploreContainer from 'src/components/ExploreContainer.vue';
</script>
