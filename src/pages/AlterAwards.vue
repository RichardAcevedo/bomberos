<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Condecoraciones"
        icon="person"
        :to="ROUTES.personal.awards"
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
      v-else-if="withEmployees && withAwardTypes"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? awardData.codeMinutes : null"
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
                v-model="awardData.codeMinutes"
                class="ControlForm col-3 q-mr-md"
                label="Codigo Acta"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un codigo',
                val => val && val.length <= 40 || 'Longitud maxima de 40 carácteres' ]"
              />
              <q-input
                filled
                v-model="awardData.dateMinutes"
                class="ControlForm col-2 q-mr-md"
                label="Fecha Acta"
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
                        v-model="awardData.dateMinutes"
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
                v-model="awardData.codeResolution"
                class="ControlForm col-3 q-mr-md"
                label="Codigo Resolución"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un codigo',
                  val => val && val.length <= 40 || 'Longitud maxima de 40 carácteres' ]"
              />
              <q-input
                filled
                v-model="awardData.dateResolution"
                class="ControlForm col"
                label="Fecha Resolución"
                stack-label
                readonly
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa una fecha']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="awardData.dateResolution"
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
                <q-select
                  filled
                  v-model="awardData.employee"
                  class="ControlForm col q-mr-md"
                  label="Empleado"
                  :options="employees"
                  option-value="id"
                  :option-label="(item) => item === null ? '' : `${item.person} - ${item.position}`"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <q-select
                  filled
                  v-model="awardData.awardType"
                  class="ControlForm col"
                  label="Tipo Condecoración"
                  :options="awardTypes"
                  option-value="id"
                  option-label="name"
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
                v-model="awardData.description"
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
    <div v-else-if="!withAwardTypes" class="text-center">
      <div class="empty-state normal-section empty-awardTypes"></div>
      <h4 class="empty-copy"> No hay tipos de condecoraciones disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR TIPOS CONDECORACIONES"
        :to="ROUTES.personal.awardTypes"
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
  LS_CREATING_AWARDS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import awardModel from '../commons/models/award';
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
      awardData: {
        dateMinutes: formatDate(today, 'DD/MM/YYYY'),
        dateResolution: formatDate(today, 'DD/MM/YYYY'),
        codeMinutes: null,
        codeResolution: null,
        description: null,
        employee: null,
        awardType: null,
      },
      loading: false,
      today,
      ROUTES,
      withEmployees: true,
      withAwardTypes: true,
      employees: [],
      awardTypes: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await awardModel.getApiFormat(this.awardData);
          await this.$store.dispatch('awards/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.awards);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await awardModel.getApiFormat(this.awardData);
          await this.$store.dispatch('awards/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.awards);
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
      return this.$q.localStorage.getItem(LS_CREATING_AWARDS);
    },
  },
  async created() {
    await Promise.all([
      this.employees = await this.$store.dispatch('employees/get'),
      this.awardTypes = await this.$store.dispatch('awardTypes/get'),
    ]);
    this.withEmployees = this.employees.length > 0;
    this.withAwardTypes = this.awardTypes.length > 0;
    if (this.withEmployees && this.withAwardTypes) {
      if (this.action.created) {
        this.awardData.awardType = this.awardTypes ? this.awardTypes[0] : {};
        this.awardData.employee = this.employees ? this.employees[0] : {};
      } else {
        const idToEdit = this.action.id;
        const award = await this.$store.dispatch('awards/getForId', idToEdit);
        this.awardData = award;
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
