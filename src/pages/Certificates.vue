<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">CERTIFICADOS</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && certificates && certificates.length"
        :selected="selected"
        :createFunction="openCreateNew"
        :editFunction="openUpdate"
        :deleteFunction="openDelete"
      />
    </div>
    <q-separator />
    <div v-if="loadingState">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <TableView
      v-else-if="certificates && certificates.length"
      :key="reRenderTable"
      :information="certificates"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-certificates"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        v-if="user.type !== 'supervisor'"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterCertificates">
      <q-card style="width: 500px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Certificado</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <div class="row q-mb-xs text-bold">
              Información principal:
            </div>
            <div class="row">
              <q-field
                label="Tarifa"
                filled
                stack-label
                class="ControlForm col q-mr-md"
                lazy-rules
                :rules="[]"
              >
                <money
                  v-model="certificateData.rate"
                  :precision="0"
                  type="text"
                  class="inputMoney"
                  maxLength="14"
                  prefix="$ "
                  suffix=" COP"
                />
              </q-field>
              <q-select
                filled
                :disable="gettingInfo"
                v-model="certificateData.company"
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
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="certificateData.date"
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
                        v-model="certificateData.date"
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
                :disable="gettingInfo"
                v-model="certificateData.dateOut"
                class="ControlForm col"
                label="Fecha vencimiento"
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
                        v-model="certificateData.dateOut"
                        mask="DD/MM/YYYY"
                        :options="minDateIsToday"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-separator class="q-mb-sm"/>
            <div align="center">
              <q-btn
                color="negative"
                type="reset"
                flat
                label="Cancelar"
                v-close-popup
                :disable="loadingAlter"
              />
              <q-btn
                color="positive"
                type="submit"
                flat
                label="Guardar"
                :disable="gettingInfo"
                :loading="loadingAlter"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
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
import TableView from '../components/table-view/TableView';
import DeleteTemplate from '../components/delete-template/DeleteTemplate';
import InteractionOptions from '../components/interaction-options/InteractionOptions';
import {
  LS_USER_INFO,
  SUCCESS_NOTIFICATION,
  ERROR_NOTIFICATION,
  WARNING_NOTIFICATION,
  getPossibleRoutes,
  getColumnsForTable,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import certificateModel from '../commons/models/certificate';
import { getError } from '../utils/helpers';
import { titles, staticColumns } from '../data/titlesBanks/certificates';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Certificates',
  components: {
    TableView,
    InteractionOptions,
    Money,
  },
  data() {
    return {
      alterCertificates: false,
      reRenderTable: 0,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
      isCreate: null,
      gettingInfo: false,
      loadingAlter: false,
      loadingState: true,
      today,
      certificateData: {
        rate: '',
        company: null,
        date: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
      },
      withCompanies: false,
    };
  },
  mixins: [
    NotificationMixin,
  ],
  methods: {
    openCreateNew() {
      if (this.withCompanies) {
        this.isCreate = true;
        this.reset();
        this.alterCertificates = true;
      } else {
        const msg = 'No hay empresas disponibles';
        this.createNotification({ message: msg, timeout: 8000, ...WARNING_NOTIFICATION });
      }
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterCertificates = true;
      this.gettingInfo = true;
      const certificate = await this.$store.dispatch('certificates/getForId', this.selected[0].id);
      this.certificateData = certificate;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await certificateModel.getApiFormat(this.certificateData);
          await this.$store.dispatch('certificates/store', dataFormat);
          const msg = 'Registro exitoso';
          this.getData();
          this.alterCertificates = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await certificateModel.getApiFormat(this.certificateData);
          await this.$store.dispatch('certificates/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          this.getData();
          this.alterCertificates = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      }
    },
    organizerDataDelete(info) {
      return info.reduce((m, item) => {
        m.push({
          principal: item.rate,
          caption: item.company,
          side: item.date,
        });
        return m;
      }, []);
    },
    openDelete() {
      this.$q.dialog({
        component: DeleteTemplate,
        parent: this,
        dataShow: this.organizerDataDelete(this.selected),
        dataDelete: this.selected,
        deleteFunction: this.deleteRows,
      }).onOk(() => {
        this.selected = [];
        this.reRenderTable += 1;
      }).onCancel(() => {
      }).onDismiss(() => {
        this.getData();
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('certificates/remove', infoDelete);
    },
    reset() {
      this.certificateData = {
        rate: '',
        company: this.companies ? this.companies[0] : null,
        date: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
    minDateIsToday(dates) {
      return dates >= formatDate(today, 'YYYY/MM/DD');
    },
    async getData() {
      await this.$store.dispatch('certificates/get');
      await this.$store.dispatch('companies/get');
      this.withCompanies = this.companies.length > 0;
      this.loadingState = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    certificates() {
      return this.$store.getters['certificates/list'];
    },
    companies() {
      return this.$store.getters['companies/list'];
    },
    columns() {
      return getColumnsForTable(this.certificates, titles, staticColumns);
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
  async created() {
    await this.getData();
  },
};
</script>
