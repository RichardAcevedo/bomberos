<template>
  <div>
    <q-table
      class="q-my-md"
      :data="information"
      :columns="columns"
      :row-key="columns[0].name"
      :filter="search"
      no-data-label="Aún no hay registros en la tabla."
      no-results-label="No hay registros compatibles con la busqueda."
      :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
      :visible-columns="visibleCol"
      @selection="emitSelectedFake"
    >
      <template v-slot:body-cell-oldValues="props">
        <q-td :props="props">
          <div>
            <q-badge label="JSON" />
          </div>
          <div class="my-table-oldValues">
            {{ props.row.oldValues }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-newValues="props">
        <q-td :props="props">
          <div>
            <q-badge label="JSON" />
          </div>
          <div class="my-table-newValues">
            {{ props.row.newValues }}
          </div>
        </q-td>
      </template>

      <template v-slot:top-right="props">
        <q-select
          v-model="visibleCol"
          class="q-mr-md"
          multiple
          outlined
          dense
          options-dense
          display-value="Columnas"
          emit-value
          map-options
          :options="columns"
          option-value="name"
          style="min-width: 150px"
        >
          <template v-slot:prepend>
            <q-icon name="visibility" />
          </template>
        </q-select>
      </template>
      <template v-slot:top-left="props">
        <q-input
          v-model="search"
          class="q-ml-md"
          outlined
          dense
          debounce="300"
          placeholder="Buscar.."
        >
          <q-icon slot="append" name="search" />
        </q-input>
      </template>
    </q-table>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-table {
  color: $tertiary;
}

.q-table th {
  font-weight: 700;
  opacity: 1;
}

.my-table-oldValues {
  font-size: 0.96em;
  font-style: italic;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}

.my-table-newValues {
  font-size: 0.85em;
  font-style: italic;
  white-space: normal;
  color: #555;
  margin-top: 4px;
}
</style>

<script>

export default {
  name: 'TableView',
  data() {
    return {
      search: '',
      selected: [],
      selectedFake: [],
      visibleCol: this.visibleColumns,
    };
  },
  methods: {
    emitSelectedFake(details) {
      if (details.added && details.rows.length > 1) {
        this.selectedFake = details.rows;
      } else if (!details.added && details.rows.length > 1) {
        this.selectedFake = [];
      } else if (details.added) {
        this.selectedFake.push(details.rows[0]);
      } else if (!details.added) {
        this.selectedFake = this.selectedFake.filter(e => e.id !== details.rows[0].id);
      }
      this.$emit('selection', this.selectedFake);
    },
    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} Fila${this.selected.length > 1 ? 's' : ''} seleccionada${this.selected.length > 1 ? 's' : ''}`;
    },
  },
  props: {
    information: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    visibleColumns: {
      type: Array,
      default: () => [],
    },
    selection: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
