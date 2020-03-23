<template>
  <div>
    <q-select
      :dark="dark"
      :dense="dense"
      :standout="standout"
      :filled="filled"
      v-model="search"
      :label="label"
      :hint="hint"
      :disable="disable"
      :readonly="readonly"
      stack-label
      use-input
      :dropdown-icon="icon"
      behavior="menu"
      hide-selected
      fill-input
      :loading="loading"
      input-debounce="0"
      :option-value="optionValue"
      :option-label="optionLabel"
      popup-content-class="list-options"
      :class="`ControlForm q-pb-none ${label.length === 0 ? 'withOutLabel' : ''}`"
      :options="options"
      @filter="filterFn"
      @input="selected"
      :rules="rules"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            Sin resultados
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>

<style lang="stylus">
@import '../../css/app.styl';

.list-options {
  border-radius: 0px;
}

.withOutLabel .q-field__inner .q-field__control .q-field__control-container {
  padding-top: 0px;
}
</style>

<script>
export default {
  name: 'SelectionInput',
  data() {
    return {
      search: this.searchParent,
      options: this.optionsMenu,
      loading: false,
    };
  },
  props: {
    optionsMenu: {
      type: Array,
      default: () => [],
    },
    optionValue: {
      type: String,
      default: '',
    },
    optionLabel: {
      type: String,
      default: '',
    },
    callToAction: {
      type: Function,
      default: () => {},
    },
    searchParent: {
      type: Object,
      default: () => {},
    },
    dark: {
      type: Boolean,
      default: false,
    },
    dense: {
      type: Boolean,
      default: false,
    },
    disable: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    standout: {
      type: Boolean,
      default: false,
    },
    filled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    hint: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    filterFn(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }
      this.loading = true;
      update(() => {
        const needle = val.toLowerCase();
        const totalOpts = this.optionsMenu.filter(v => v.name.toLowerCase().indexOf(needle) > -1);
        this.options = totalOpts.length > 5 ? totalOpts.slice(0, 5) : totalOpts;
        this.loading = false;
      });
    },
    selected(item) {
      this.$emit('input', item);
      this.callToAction(item);
    },
  },
};
</script>
