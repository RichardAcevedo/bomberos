<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Empresas"
        icon="warning"
        :to="ROUTES.preventionAndSecurity.companies"
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
      v-else-if="withInspectors && withCompanyTypes"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? companyData.name : null"
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
                  v-model="companyData.name"
                  class="ControlForm col q-mr-md"
                  label="Nombre"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre',
                    val => val && val.length <= 120 || 'Longitud maxima de 120 carácteres' ]"
                />
                <q-input
                  filled
                  v-model="companyData.address"
                  class="ControlForm col q-mr-md"
                  label="Dirección"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa una dirección',
                    val => val && val.length <= 100 || 'Longitud maxima de 100 carácteres' ]"
                />
                <q-input
                  filled
                  v-model="companyData.neighborhood"
                  class="ControlForm col"
                  label="Barrio"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un barrio',
                    val => val && val.length <= 50 || 'Longitud maxima de 50 carácteres' ]"
                />
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="companyData.phone"
                  class="ControlForm col q-mr-md"
                  type="number"
                  :min="0"
                  label="Telefono"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingrese un telefono',
                    val => val && val.length < 11 || 'Numero incorrecto']"
                />
                <q-input
                  filled
                  v-model="companyData.registerDate"
                  class="ControlForm col q-mr-md"
                  label="Fecha de Registro"
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
                          v-model="companyData.registerDate"
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
                  v-model="companyData.representative"
                  class="ControlForm col"
                  label="Nombre Representante"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa un nombre',
                    val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
                />
              </div>
              <div class="row">
                <q-select
                  filled
                  v-model="companyData.supervisor"
                  class="ControlForm col q-mr-md"
                  label="Supervisor"
                  :options="supervisors"
                  option-value="id"
                  option-label="person"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <q-select
                  filled
                  v-model="companyData.companyType"
                  class="ControlForm col"
                  label="Tipo de empresa"
                  :options="companyTypes"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div class="row q-mb-xs text-bold">
                Información adicional (Representante):
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="companyData.mobile"
                  class="ControlForm col-3 q-mr-md"
                  type="number"
                  :min="0"
                  label="Celular"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val > 0 && val.length === 10 ? true :
                    'Numero incorrecto' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.identificationCard"
                  class="ControlForm col-3"
                  label="Cedula"
                  type="number"
                  :min="0"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val > 0 && val.length === 10 ? true :
                    'Numero incorrecto' ) : true ]"
                />
              </div>
              <div class="row q-mb-xs text-bold">
                Información adicional:
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="companyData.cameraRegistration"
                  class="ControlForm col q-mr-md"
                  label="Camara de comercio"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 30 ? true :
                    'Longitud maxima de 30 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.category"
                  class="ControlForm col q-mr-md"
                  label="Categoria"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 30 ? true :
                    'Longitud maxima de 30 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.nit"
                  class="ControlForm col-2 q-mr-md"
                  type="number"
                  :min="0"
                  label="NIT"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val > 0 ? ( val.length <= 20 ? true :
                    'Longitud maxima de 20 carácteres' ) : 'Numero incorrecto' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.sn"
                  class="ControlForm col-2"
                  type="number"
                  :min="0"
                  label="SN"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val > 0 ? ( val.length <= 10 ? true :
                    'Longitud maxima de 10 carácteres' ) : 'Numero incorrecto' ) : true ]"
                />
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="companyData.quantity"
                  class="ControlForm col q-mr-md"
                  :min="0"
                  type="number"
                  label="Cantidad"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val > 0 ? ( val.length <= 20 ? true :
                    'Longitud maxima de 20 carácteres' ) : 'Numero incorrecto' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.area"
                  class="ControlForm col q-mr-md"
                  label="Área"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 20 ? true :
                    'Longitud maxima de 30 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="companyData.level"
                  class="ControlForm col"
                  label="Nivel"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 30 ? true :
                    'Longitud maxima de 30 carácteres' ) : true ]"
                />
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="companyData.observation"
                  autogrow
                  class="ControlForm col-6"
                  label="Observación"
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
    <div v-else-if="!withInspectors" class="text-center">
      <div class="empty-state normal-section empty-curriculums"></div>
      <h4 class="empty-copy"> No hay empleados/inspectores disponibles </h4>
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
    <div v-else-if="!withCompanyTypes" class="text-center">
      <div class="empty-state normal-section empty-companyTypes"></div>
      <h4 class="empty-copy"> No hay tipos de empresas disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'prevencion-y-seguridad'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR TIPOS DE EMPRESAS"
        :to="ROUTES.preventionAndSecurity.companiesTypes"
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
  LS_CREATING_COMPANIES,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import companyModel from '../commons/models/company';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterCompanies',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      companyData: {
        name: null,
        address: null,
        neighborhood: null,
        cameraRegistration: null,
        phone: null,
        registerDate: formatDate(today, 'DD/MM/YYYY'),
        representative: null,
        mobile: null,
        identificationCard: null,
        nit: null,
        observation: null,
        sn: null,
        quantity: null,
        area: null,
        category: null,
        level: null,
        supervisor: null,
        companyType: null,
      },
      loading: false,
      today,
      ROUTES,
      withInspectors: true,
      withCompanyTypes: true,
      supervisors: [],
      companyTypes: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await companyModel.getApiFormat(this.companyData);
          await this.$store.dispatch('companies/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.preventionAndSecurity.companies);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await companyModel.getApiFormat(this.companyData);
          await this.$store.dispatch('companies/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.preventionAndSecurity.companies);
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
      return this.$q.localStorage.getItem(LS_CREATING_COMPANIES);
    },
  },
  async created() {
    await Promise.all([
      this.supervisors = await this.$store.dispatch('employees/getInspectors'),
      this.companyTypes = await this.$store.dispatch('companyTypes/get'),
    ]);
    this.withInspectors = this.supervisors.length > 0;
    this.withCompanyTypes = this.companyTypes.length > 0;
    if (this.withInspectors && this.withCompanyTypes) {
      if (this.action.created) {
        this.companyData.companyType = this.companyTypes ? this.companyTypes[0] : {};
        this.companyData.supervisor = this.supervisors ? this.supervisors[0] : {};
      } else {
        const idToEdit = this.action.id;
        const company = await this.$store.dispatch('companies/getForId', idToEdit);
        this.companyData = company;
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
