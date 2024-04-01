<template>
  <q-btn
    flat
    class="flex items-center px-4 py-2 font-medium tracking-wide text-center transition-colors duration-300 transform rounded-lg focus:outline-none"
    :class="[
      alignment,
      currentColor,
      {
        '!bg-gray-200': disabled,
        'focus:ring focus:ring-opacity-80': !disabled,
      },
    ]"
  >
    <q-spinner
      :color="color === 'white' ? 'dark' : 'white'"
      v-if="loading"
    ></q-spinner>
    <template v-else>
      <slot name="icon">
        <q-icon class="mr-1" :name="icon" v-if="icon" />
      </slot>
      <slot name="label">{{ label }}</slot>
      <slot />
      <slot name="icon-right">
        <q-icon class="ml-1" :name="iconRight" v-if="iconRight" />
      </slot>
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: String,
  },
  align: {
    type: String,
    default: 'center',
  },
  label: String,
  color: String,
  loading: Boolean,
  disabled: Boolean,
  iconRight: [String],
});

const alignment = computed(
  () =>
    ({
      center: 'justify-center',
      left: 'justify-start',
      right: 'justify-end',
      justify: 'justify-around',
    }[props.align])
);

const currentColor = computed(
  () =>
    ({
      secondary:
        'bg-secondary hover:bg-secondary text-white focus:ring-secondary',
      tertiary: 'bg-tertiary hover:bg-tertiary text-white focus:ring-tertiary',
      primary: 'bg-primary hover:bg-primary text-white focus:ring-primary',
      success: 'bg-success hover:bg-success text-white focus:ring-success',
      danger: 'bg-danger hover:bg-danger text-white focus:ring-danger',
      medium: 'bg-medium hover:bg-medium text-white focus:ring-medium',
      light: 'bg-light hover:bg-light text-light focus:ring-light',
      dark: 'bg-dark hover:bg-dark text-white focus:ring-dark',
    }[props.color || 'primary'])
);
</script>
