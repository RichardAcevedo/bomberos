<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Vehiculos"
        icon="assignment"
        :to="ROUTES.vehicles.vehicles"
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
      v-else-if="withVehicleTypes"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? vehicleData.name : null"
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
                v-model="vehicleData.name"
                class="ControlForm col q-mr-md"
                label="Nombre"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
              <q-input
                filled
                v-model="vehicleData.mark"
                class="ControlForm col q-mr-md"
                label="Marca"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa una marca']"
              />
              <q-input
                filled
                v-model="vehicleData.model"
                class="ControlForm col"
                label="Modelo"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un modelo']"
              />
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="vehicleData.licensePlate"
                  class="ControlForm col-4 q-mr-md"
                  label="Placa"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa una placa']"
                />
                <q-select
                  filled
                  v-model="vehicleData.vehicleType"
                  class="ControlForm col-5 q-mr-md"
                  label="Tipo de vehiculo"
                  :options="vehicleTypes"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div class="row q-mb-xs">
                <q-select
                  v-model="vehicleData.elements"
                  class="ControlForm col"
                  filled
                  use-chips
                  multiple
                  :options="elements"
                  option-value="id"
                  :option-label="(item) => item === null ? ''
                    : `${item.name} - ${item.inventoryCode}`"
                  label="Elementos"
                  stack-label
                  lazy-rules
                  :hint="elements && elements.length ?
                  'Selecciona los elementos que poseera el vehiculo'
                    : 'No hay elementos disponibles'"
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
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-vehicleTypes"></div>
      <h4 class="empty-copy"> No hay tipos de vehiculos disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'maquinista'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR TIPOS DE VEHICULOS"
        :to="ROUTES.vehicles.vehicleTypes"
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
import { date } from 'quasar';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_VEHICLES,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import vehicleModel from '../commons/models/vehicle';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterVehicles',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      vehicleData: {
        name: null,
        mark: null,
        model: null,
        licensePlate: null,
        vehicleType: null,
        elements: null,
      },
      loading: false,
      today,
      ROUTES,
      withVehicleTypes: true,
      vehicleTypes: [],
      elements: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await vehicleModel.getApiFormat(this.vehicleData);
          await this.$store.dispatch('vehicles/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.vehicles.vehicles);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await vehicleModel.getApiFormat(this.vehicleData);
          await this.$store.dispatch('vehicles/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.vehicles.vehicles);
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      }
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
    minDateIsToday(dates) {
      return dates >= formatDate(today, 'YYYY/MM/DD');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_VEHICLES);
    },
  },
  async created() {
    this.vehicleTypes = await this.$store.dispatch('vehicleTypes/get');
    this.withVehicleTypes = this.vehicleTypes.length > 0;
    if (this.withVehicleTypes) {
      this.elements = await this.$store.dispatch('elements/getElementsWithoutVehicle');
      if (this.action.created) {
        this.vehicleData.vehicleType = this.vehicleTypes ? this.vehicleTypes[0] : {};
      } else {
        const idToEdit = this.action.id;
        const vehicle = await this.$store.dispatch('vehicles/getForId', idToEdit);
        if (vehicle.elements) this.elements.unshift(...vehicle.elements);
        this.vehicleData = vehicle;
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
