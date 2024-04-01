<template>
  <q-layout>
    <q-header elevated>
      <q-toolbar class="bg-white text-primary">
        <q-toolbar-title class="flex items-center gap-2">
          <q-avatar size="sm">
            <q-img src="~/app/resources/icon.png" />
          </q-avatar>
          {{ $route.meta.title || 'Home' }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <q-footer bordered class="absolute bottom-0 bg-white text-primary">
      <q-tabs
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
      >
        <q-route-tab no-caps name="tab1" to="/tabs/actions" :icon="ionApps">
          <q-item-label>Actions</q-item-label>
        </q-route-tab>

        <q-route-tab
          no-caps
          name="tab2"
          to="/tabs/help"
          :icon="ionInformationCircle"
        >
          <q-item-label>Help</q-item-label>
        </q-route-tab>
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import { ionApps, ionInformationCircle } from '@quasar/extras/ionicons-v5';
import { Platform } from 'quasar';
import { onBeforeMount } from 'vue';

onBeforeMount(() => {
  Platform.is.android &&
    NavigationBar.setColor({ color: '#e44756', darkButtons: false });
});
</script>
