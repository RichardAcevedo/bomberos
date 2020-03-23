<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Extintores"
        icon="fireplace"
        :to="ROUTES.extinguishers.extinguishers"
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
      v-else-if="withCustomers && withExtinguisherTypes && withCompanies"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? extinguisherData.date : null"
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
                  v-model="extinguisherData.date"
                  class="ControlForm col q-mr-md"
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
                          v-model="extinguisherData.date"
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
                  v-model="extinguisherData.capacity"
                  class="ControlForm col-3 q-mr-md"
                  label="Capacidad"
                  mask="# lb"
                  fill-mask="0"
                  reverse-fill-mask
                  :min="0"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa una capacidad',
                    val => val && val.length <= 20 || 'Longitud maxima de 20 carácteres' ]"
                />
                <q-field
                  label="Tarifa"
                  filled
                  stack-label
                  class="ControlForm col"
                  lazy-rules
                  :rules="[]"
                >
                  <money
                    v-model="extinguisherData.rate"
                    :precision="0"
                    type="text"
                    class="inputMoney"
                    maxLength="14"
                    prefix="$ "
                    suffix=" COP"
                  />
                </q-field>
              </div>
              <div class="row">
                <q-select
                  filled
                  v-model="extinguisherData.customer"
                  class="ControlForm col q-mr-md"
                  label="Cliente"
                  :options="customers"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <q-select
                  filled
                  v-model="extinguisherData.extinguisherType"
                  class="ControlForm col q-mr-md"
                  label="Tipo de extintor"
                  :options="extinguisherTypes"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <q-select
                  filled
                  v-model="extinguisherData.company"
                  class="ControlForm col"
                  label="Empresa"
                  :options="companies"
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
                  v-model="extinguisherData.serviceNote"
                  autogrow
                  class="ControlForm col-6"
                  label="Nota de servicio"
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
    <div v-else-if="!withCustomers" class="text-center">
      <div class="empty-state normal-section empty-customers"></div>
      <h4 class="empty-copy"> No hay clientes disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'extintores'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR CLIENTES"
        :to="ROUTES.extinguishers.customers"
      />
    </div>
    <div v-else-if="!withExtinguisherTypes" class="text-center">
      <div class="empty-state normal-section empty-extinguisherTypes"></div>
      <h4 class="empty-copy"> No hay tipos de extintores disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'extintores'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR TIPOS DE EXTINTORES"
        :to="ROUTES.extinguishers.extinguisherTypes"
      />
    </div>
    <div v-else-if="!withCompanies" class="text-center">
      <div class="empty-state normal-section empty-companies"></div>
      <h4 class="empty-copy"> No hay empresas disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'prevencion-y-seguridad'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR EMPRESAS"
        :to="ROUTES.preventionAndSecurity.companies"
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
import { Money } from 'v-money';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_EXTINGUISHERS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import extinguisherModel from '../commons/models/extinguisher';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterExtinguishers',
  mixins: [
    NotificationMixin,
  ],
  components: {
    Money,
  },
  data() {
    return {
      loadingState: true,
      extinguisherData: {
        date: formatDate(today, 'DD/MM/YYYY'),
        capacity: null,
        rate: '',
        serviceNote: null,
        customer: null,
        extinguisherType: null,
        extinguisher: null,
      },
      loading: false,
      moneyFormatForDirective: {
        decimal: '.',
        thousands: ',',
        prefix: '$ ',
        suffix: ' #',
        precision: 2,
        masked: false, /* doesn't work with directive */
      },
      today,
      ROUTES,
      withCustomers: true,
      withExtinguisherTypes: true,
      withCompanies: true,
      customers: [],
      extinguisherTypes: [],
      companies: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await extinguisherModel.getApiFormat(this.extinguisherData);
          await this.$store.dispatch('extinguishers/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.extinguishers.extinguishers);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await extinguisherModel.getApiFormat(this.extinguisherData);
          await this.$store.dispatch('extinguishers/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.extinguishers.extinguishers);
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
      return this.$q.localStorage.getItem(LS_CREATING_EXTINGUISHERS);
    },
  },
  async created() {
    await Promise.all([
      this.customers = await this.$store.dispatch('customers/get'),
      this.extinguisherTypes = await this.$store.dispatch('extinguisherTypes/get'),
      this.companies = await this.$store.dispatch('companies/get'),
    ]);
    this.withCustomers = this.customers.length > 0;
    this.withExtinguisherTypes = this.extinguisherTypes.length > 0;
    this.withCompanies = this.companies.length > 0;
    if (this.withCustomers && this.withExtinguisherTypes && this.withCompanies) {
      if (this.action.created) {
        this.extinguisherData.extinguisherType = this.extinguisherTypes
          ? this.extinguisherTypes[0] : {};
        this.extinguisherData.customer = this.customers ? this.customers[0] : {};
        this.extinguisherData.company = this.companies ? this.companies[0] : {};
      } else {
        const idToEdit = this.action.id;
        const extinguisher = await this.$store.dispatch('extinguishers/getForId', idToEdit);
        this.extinguisherData = extinguisher;
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
