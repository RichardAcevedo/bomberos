<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">REPORTES - TABLAS ESPECIFICAS</div>
    </div>
    <q-separator />
    <q-form @submit="generateReport">
      <div class="row">
        <div class="text-bold q-my-md q-mr-md">
          Tipo de listado:
        </div>
        <q-option-group
          v-model="show"
          class="q-my-md"
          :options="[
            {
              label: 'Autocompletable',
              value: 'autocompletable',
            },
            {
              label: 'Selección',
              value: 'seleccion',
            },
          ]"
          color="primary"
          inline
          dense
        />
      </div>
      <div class="row">
        <SelectionInput
          v-if="show === 'autocompletable'"
          :filled="true"
          v-model="specificReport"
          class="col-12 q-mb-lg"
          label="Exportar:"
          :optionsMenu="tables"
          :searchParent="specificReport"
          optionValue="id"
          optionLabel="name"
          :hint="specificReport ? ''
            : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
          :rules="[ () => specificReport || 'Por favor selecciona una tabla']"
        />
        <q-select
          v-if="show === 'seleccion'"
          filled
          v-model="specificReport"
          class="ControlForm col-12"
          label="Exportar:"
          :options="tables"
          option-value="id"
          option-label="name"
          stack-label
          lazy-rules
          :rules="[() => specificReport || 'Por favor selecciona una tabla']"
        />
      </div>
      <div class="text-center">
        <q-btn
          :label="'GENERAR REPORTE EXCEL'"
          :loading="loading"
          class="text-bold"
          color="positive"
          type="submit"
        />
      </div>
    </q-form>
  </div>
</template>

<style lang="stylus">
</style>

<script>

import {
  LS_USER_INFO,
  getPossibleRoutes,
  TABLESFORREPORT,
  ERROR_NOTIFICATION,
} from '../commons/constants';
import SelectionInput from '../components/selection-input/SelectionInput';
import NotificationMixin from '../mixins/notifications';

export default {
  name: 'SpecificReports',
  components: {
    SelectionInput,
  },
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loading: false,
      show: 'autocompletable',
      specificReport: null,
      tables: TABLESFORREPORT,
    };
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  methods: {
    async generateReport() {
      this.loading = true;
      const data = await this.$store.dispatch(`${this.specificReport.method}/get`);
      if (data.length) {
        await this.$store.dispatch(`${this.specificReport.method}/report`, this.specificReport.name);
      } else {
        const msg = `No hay registros en la sección de ${this.specificReport.name}`;
        this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
      }
      this.loading = false;
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.user) {
        next('/');
      } else {
        const validRoutes = getPossibleRoutes(vm.user.type);
        const valid = validRoutes.find(element => element === to.path);
        if (!valid) {
          next(validRoutes[0]);
        }
        next();
      }
    });
  },
};
</script>
