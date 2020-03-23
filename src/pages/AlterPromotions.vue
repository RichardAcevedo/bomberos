<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Ascensos"
        icon="person"
        :to="ROUTES.personal.promotions"
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
      v-else-if="withEmployees && withRanks"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? promotionData.codeMinutes : null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <q-toggle
                v-model="promotionData.active"
                class="q-mb-sm"
                color="primary"
                label="Activo"
              />
              <div class="row">
                <q-input
                  v-if="!promotionData.active"
                  filled
                  v-model="promotionData.dateDeactivation"
                  class="ControlForm col-3 q-mr-md"
                  label="Fecha desactivación"
                  stack-label
                  readonly
                  :rules="[]"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="promotionData.dateDeactivation"
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
                v-model="promotionData.codeMinutes"
                class="ControlForm col-3 q-mr-md"
                label="Codigo Acta"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un codigo',
                  val => val && val.length <= 40 || 'Longitud maxima de 40 carácteres' ]"
              />
              <q-input
                filled
                v-model="promotionData.dateMinutes"
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
                        v-model="promotionData.dateMinutes"
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
                v-model="promotionData.codeResolution"
                class="ControlForm col-3 q-mr-md"
                label="Codigo Resolución"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un codigo',
                  val => val && val.length <= 40 || 'Longitud maxima de 40 carácteres' ]"
              />
              <q-input
                filled
                v-model="promotionData.dateResolution"
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
                        v-model="promotionData.dateResolution"
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
                  v-model="promotionData.employee"
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
                <q-select
                  filled
                  v-model="promotionData.rank"
                  class="ControlForm col"
                  label="Rango"
                  :options="ranks"
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
                  v-model="promotionData.description"
                  class="ControlForm col q-mr-md"
                  label="Descripción"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <div class="col-5">
                  <div
                    v-if="!action.created && promotionData.pathFile"
                    class="q-mb-md"
                  >
                    <div class="row q-mb-xs">
                      Descargar archivo actual:
                    </div>
                    <a
                      :href="`${NATIVE_URL}/files/ascensos/${promotionData.pathFile}`"
                    >
                      <q-btn
                        color="positive"
                        icon-right="cloud_download"
                        class="full-width"
                        align="between"
                      >
                        <div class="ellipsis">
                          {{ promotionData.pathFile.substr(12) }}
                        </div>
                      </q-btn>
                    </a>
                  </div>
                  <div
                    v-if="!promotionData.pathFile"
                    class="row q-mb-xs"
                  >
                    Subir archivo de soporte:
                  </div>
                  <div
                    v-if="promotionData.pathFile"
                    class="row q-mb-xs"
                  >
                    Cambiar archivo de soporte:
                  </div>
                  <div class="row q-mb-md">
                    <q-uploader
                      class="col"
                      @added="handleFileUpload"
                      hide-upload-btn
                      accept=".pdf, .dot, .doc, .docx, .odt, .xls,
                        .xlsx, .ods, .ppt, .pptx, image/*"
                    />
                  </div>
                </div>
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
    <div v-else-if="!withRanks" class="text-center">
      <div class="empty-state normal-section empty-ranks"></div>
      <h4 class="empty-copy"> No hay rangos disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR RANGOS"
        :to="ROUTES.personal.ranks"
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
  LS_CREATING_PROMOTIONS,
  LS_USER_INFO,
  getPossibleRoutes,
  NATIVE_URL,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import promotionModel from '../commons/models/promotion';
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
      promotionData: {
        dateMinutes: formatDate(today, 'DD/MM/YYYY'),
        dateResolution: formatDate(today, 'DD/MM/YYYY'),
        codeMinutes: null,
        codeResolution: null,
        description: null,
        active: true,
        dateDeactivation: formatDate(today, 'DD/MM/YYYY'),
        employee: null,
        rank: null,
        pathFile: null,
        file: null,
      },
      loading: false,
      today,
      ROUTES,
      withEmployees: true,
      withRanks: true,
      employees: [],
      ranks: [],
      NATIVE_URL,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await promotionModel.getApiFormat(this.promotionData);
          await this.$store.dispatch('promotions/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.promotions);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await promotionModel.getApiFormat(this.promotionData);
          await this.$store.dispatch('promotions/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.promotions);
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
    handleFileUpload(files) {
      const specific = files[0];
      this.promotionData.file = specific;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_PROMOTIONS);
    },
  },
  async created() {
    await Promise.all([
      this.employees = await this.$store.dispatch('employees/get'),
      this.ranks = await this.$store.dispatch('ranks/get'),
    ]);
    this.withEmployees = this.employees.length > 0;
    this.withRanks = this.ranks.length > 0;
    if (this.withEmployees && this.withRanks) {
      if (this.action.created) {
        this.promotionData.rank = this.ranks ? this.ranks[0] : {};
        this.promotionData.employee = this.employees ? this.employees[0] : {};
      } else {
        const idToEdit = this.action.id;
        const promotion = await this.$store.dispatch('promotions/getForId', idToEdit);
        this.promotionData = promotion;
        this.promotionData.dateDeactivation = promotion.dateDeactivation
          ? promotion.dateDeactivation : formatDate(today, 'DD/MM/YYYY');
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
