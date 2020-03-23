<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Sanciones"
        icon="person"
        :to="ROUTES.personal.sanctions"
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
      v-else-if="withEmployees"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? sanctionData.order : null"
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
                v-model="sanctionData.date"
                class="ControlForm col-2 q-mr-md"
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
                        v-model="sanctionData.date"
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
                v-model="sanctionData.sanctionType"
                class="ControlForm col-3 q-mr-md"
                label="Tipo sanción"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un tipo',
                  val => val && val.length <= 100 || 'Longitud maxima de 100 carácteres' ]"
              />
              <q-input
                filled
                v-model="sanctionData.order"
                class="ControlForm col-3 q-mr-md"
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
                  v-model="sanctionData.employee"
                  class="ControlForm col q-mr-md"
                  label="Empleado"
                  :options="employees"
                  option-value="id"
                  :option-label="(item) => item === null ? ''
                    : `${item.person} - ${item.position}`"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div class="row q-mb-xs text-bold">
                Información adicional:
              </div>
              <div class="row">
              <q-input
                filled
                autogrow
                v-model="sanctionData.description"
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
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-curriculums"></div>
      <h4 class="empty-copy"> No hay empleados disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR EMPLEADOS"
        :to="ROUTES.personal.curriculum"
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
  LS_CREATING_SANCTIONS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import sanctionModel from '../commons/models/sanction';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterSanctions',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      sanctionData: {
        date: formatDate(today, 'DD/MM/YYYY'),
        sanctionType: null,
        orden: null,
        description: null,
        employee: null,
      },
      loading: false,
      today,
      ROUTES,
      withEmployees: true,
      employees: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await sanctionModel.getApiFormat(this.sanctionData);
          await this.$store.dispatch('sanctions/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.sanctions);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await sanctionModel.getApiFormat(this.sanctionData);
          await this.$store.dispatch('sanctions/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.sanctions);
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
      return this.$q.localStorage.getItem(LS_CREATING_SANCTIONS);
    },
  },
  async created() {
    this.employees = await this.$store.dispatch('employees/get');
    this.withEmployees = this.employees.length > 0;
    if (this.withEmployees) {
      if (this.action.created) {
        this.sanctionData.employee = this.employees ? this.employees[0] : {};
      } else {
        const idToEdit = this.action.id;
        const sanction = await this.$store.dispatch('sanctions/getForId', idToEdit);
        this.sanctionData = sanction;
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
