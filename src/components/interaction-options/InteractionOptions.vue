<template>
  <div class="col row">
    <q-btn
      color="positive"
      icon-right="add"
      style="height:min-content"
      class="text-capitalize q-ml-md"
      label="AÑADIR"
      @click="createFunction"
    />
    <div v-if="selected.length" class="q-ml-auto">
      <q-btn
        v-if="selected.length === 1"
        color="info"
        icon-right="edit"
        style="height:min-content"
        @click="editFunction"
      />
      <q-btn
        v-if="selected.length >= 1"
        color="red"
        icon-right="delete"
        style="height:min-content"
        class="q-ml-sm"
        @click="deleteFunction"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InteractionOptions',
  props: {
    selected: {
      type: Array,
      default: () => [],
    },
    createFunction: {
      type: Function,
      default: () => {},
    },
    editFunction: {
      type: Function,
      default: () => {},
    },
    deleteFunction: {
      type: Function,
      default: () => {},
    },
  },
};
</script>
