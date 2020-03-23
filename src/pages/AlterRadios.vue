<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Radios"
        icon="assignment"
        :to="ROUTES.vehicles.radios"
      />
      <q-breadcrumbs-el
        :label="action.created ? 'Crear' : 'Modificar'"
        :icon="action.created ? 'attach_file' : 'edit'"
      />
    </q-breadcrumbs>
    <div v-if="loadingState">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <q-list
      bordered class="rounded-borders"
      v-else-if="withVehicles"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? radioData.serial : null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <div class="row">
              <q-input
                filled
                v-model="radioData.serial"
                class="ControlForm col-3 q-mr-md"
                label="Serial"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un serial',
                    val => val && val.length <= 20 || 'Longitud maxima de 20 carácteres' ]"
              />
              <q-input
                filled
                v-model="radioData.mark"
                class="ControlForm col-3 q-mr-md"
                label="Marca"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa una marca',
                    val => val && val.length <= 20 || 'Longitud maxima de 20 carácteres' ]"
              />
              <q-select
                filled
                v-model="radioData.state"
                class="ControlForm col-2 q-mr-md"
                :options="['Nuevo', 'Optimo', 'Deficiente', 'Inservible']"
                label="Estado"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 ||
                'Por favor selecciona un estado']"
              />
              <q-select
                filled
                v-model="radioData.signal"
                class="ControlForm col"
                :options="['Digital', 'Analogo']"
                label="Señal"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 ||
                'Por favor selecciona una señal']"
              />
              </div>
              <div class="row">
                <q-select
                  filled
                  v-model="radioData.type"
                  class="ControlForm col-3 q-mr-md"
                  :options="['Portatil', 'Movil', 'de Base']"
                  label="Tipo"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 ||
                  'Por favor selecciona un tipo']"
                />
                <q-select
                  filled
                  v-model="radioData.vehicle"
                  class="ControlForm col"
                  label="Vehiculo"
                  :options="vehicles"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <q-btn
                :label="action.created ? 'GUARDAR' : 'ACTUALIZAR DATOS'"
                :loading="loading"
                class="full-width"
                type="submit"
                color="positive"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
    <div v-else-if="!withVehicles" class="text-center">
      <div class="empty-state normal-section empty-vehicles"></div>
      <h4 class="empty-copy"> No hay vehiculos disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'maquinista'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR RANGOS"
        :to="ROUTES.vehicles.vehicles"
      />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-style: hidden;
}
</style>

<script>
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_RADIOS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import radioModel from '../commons/models/radio';
import { getError } from '../utils/helpers';

export default {
  name: 'AlterPromotions',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      radioData: {
        serial: null,
        mark: null,
        state: 'Nuevo',
        signal: 'Digital',
        type: 'Portatil',
        vehicle: null,
      },
      loading: false,
      ROUTES,
      withVehicles: true,
      vehicles: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await radioModel.getApiFormat(this.radioData);
          await this.$store.dispatch('radios/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.vehicles.radios);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await radioModel.getApiFormat(this.radioData);
          await this.$store.dispatch('radios/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.vehicles.radios);
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      }
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_RADIOS);
    },
  },
  async created() {
    await Promise.all([
      this.vehicles = await this.$store.dispatch('vehicles/get'),
    ]);
    this.withVehicles = this.vehicles.length > 0;
    if (this.withVehicles) {
      if (this.action.created) {
        this.radioData.vehicle = this.vehicles ? this.vehicles[0] : {};
      } else {
        const idToEdit = this.action.id;
        const radio = await this.$store.dispatch('radios/getForId', idToEdit);
        this.radioData = radio;
      }
    }
    this.loadingState = false;
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
