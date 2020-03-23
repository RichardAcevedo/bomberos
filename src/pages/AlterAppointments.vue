<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Nombramientos"
        icon="person"
        :to="ROUTES.personal.appointments"
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
      v-else-if="withEmployees && withPositions"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? appointmentData.employee.person : null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <div v-if="!action.created" class="q-mb-xs text-center text-bold q-py-xs note">
                Solo esta permitido modificar la descripción o desnombrar al empleado.
              </div>
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <div class="row">
                <q-btn
                  v-if="!action.created"
                  :disable="!appointmentData.active"
                  color="warning"
                  style="height:min-content"
                  class="text-capitalize q-mb-md q-mt-sm"
                  label="Desnombrar"
                  @click="appointmentData.active = false"
                />
                <q-input
                  v-if="!appointmentData.active"
                  filled
                  :disable="!action.created"
                  v-model="appointmentData.dateOut"
                  class="ControlForm col-3 q-ml-auto"
                  label="Fecha desnombramiento"
                  stack-label
                  readonly
                  :rules="[ val => val && val.length > 0  || 'Por favor ingresa una fecha' ]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="appointmentData.dateOut"
                          mask="DD/MM/YYYY"
                          :options="maxDateIsToday"
                          @input="() => $refs.qDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="row">
              <q-input
                filled
                v-model="appointmentData.date"
                :disable="!action.created"
                class="ControlForm col-3 q-mr-md"
                label="Fecha"
                stack-label
                readonly
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa una fecha' ]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="appointmentData.date"
                        mask="DD/MM/YYYY"
                        :options="maxDateIsToday"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-input
                filled
                v-model="appointmentData.article"
                class="ControlForm col q-mr-md"
                :readonly="!action.created"
                label="Articulo"
                stack-label
                lazy-rules
                :rules="[val => val && val.length > 0 || 'Por favor ingresa un articulo',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
              <q-input
                filled
                v-model="appointmentData.order"
                :readonly="!action.created"
                class="ControlForm col"
                label="Orden"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa una orden',
                  val => val && val.length <= 30 || 'Longitud maxima de 30 carácteres' ]"
              />
              </div>
              <div class="row">
                <q-select
                  filled
                  v-model="appointmentData.employee"
                  class="ControlForm col q-mr-md"
                  :readonly="!action.created"
                  label="Empleado"
                  :options="employees"
                  option-value="id"
                  :option-label="(item) => item === null ? '' : `${item.person} - ${item.position}`"
                  stack-label
                  lazy-rules
                  @input="updatePositions"
                  :rules="[]"
                />
                <q-select
                  v-model="appointmentData.position"
                  :readonly="!action.created"
                  class="ControlForm col"
                  filled
                  :loading="loadChangePositions"
                  :options="positions"
                  option-value="id"
                  option-label="name"
                  label="Cargo"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <!-- <q-select
                  filled
                  v-model="appointmentData.position"
                  class="ControlForm col"
                  :readonly="!action.created"
                  label="Cargo"
                  :options="positions"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                /> -->
              </div>
              <div class="row q-mb-xs text-bold">
                Información adicional:
              </div>
              <div class="row">
              <q-input
                filled
                autogrow
                v-model="appointmentData.description"
                class="ControlForm col-5 q-mr-md"
                label="Descripción"
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
    <div v-else-if="!withEmployees" class="text-center">
      <div class="empty-state normal-section empty-curriculums"></div>
      <h4 class="empty-copy"> No hay empleados disponible </h4>
      <q-btn
        v-if="user.type !== 'inspector' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR EMPLEADOS"
        :to="ROUTES.personal.curriculum"
      />
    </div>
    <div v-else-if="!withPositions" class="text-center">
      <div class="empty-state normal-section empty-positions"></div>
      <h4 class="empty-copy"> No hay posiciones disponibles </h4>
      <q-btn
        v-if="user.type !== 'inspector' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR POSICIONES"
        :to="ROUTES.personal.positions"
      />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-style: hidden;
}

.note {
  border-radius: 20px;
  background: $primary;
  color: white;
}
</style>

<script>
import { date } from 'quasar';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_APPOINTMENTS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import appointmentModel from '../commons/models/appointment';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterPromotions',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      appointmentData: {
        date: formatDate(today, 'DD/MM/YYYY'),
        article: null,
        order: null,
        active: true,
        dateOut: formatDate(today, 'DD/MM/YYYY'),
        description: null,
        employee: null,
        position: null,
      },
      loading: false,
      loadChangePositions: false,
      today,
      ROUTES,
      withEmployees: true,
      withPositions: true,
      employees: [],
      positions: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const send = JSON.parse(JSON.stringify(this.appointmentData));
      send.dateOut = this.appointmentData.active ? null : this.appointmentData.dateOut;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await appointmentModel.getApiFormat(send);
          await this.$store.dispatch('appointments/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.appointments);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await appointmentModel.getApiFormat(send);
          await this.$store.dispatch('appointments/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.appointments);
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      }
    },
    async updatePositions() {
      this.loadChangePositions = true;
      this.positions = [];
      const positionsAvailable = await this.$store.dispatch('positions/getPositionsAvailable',
        this.appointmentData.employee.id);
      this.positions = positionsAvailable;
      this.loadChangePositions = false;
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
      return this.$q.localStorage.getItem(LS_CREATING_APPOINTMENTS);
    },
  },
  async created() {
    await Promise.all([
      this.employees = await this.$store.dispatch('employees/get'),
      this.positions = await this.$store.dispatch('positions/get'),
    ]);
    if (this.action.created) {
      this.withEmployees = this.employees.length > 0;
      this.withPositions = this.positions.length > 0;
      if (this.withEmployees && this.withPositions) {
        this.appointmentData.employee = this.employees ? this.employees[0] : {};
        await this.updatePositions();
        this.appointmentData.position = this.positions ? this.positions[0] : {};
      }
    } else {
      const idToEdit = this.action.id;
      const appointment = await this.$store.dispatch('appointments/getForId', idToEdit);
      // if (appointment.employee) this.employees.unshift({ ...appointment.employee });
      this.appointmentData = appointment;
      this.appointmentData.dateOut = formatDate(today, 'DD/MM/YYYY');
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
