<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">CLIENTES</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && customers && customers.length"
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
      v-else-if="customers && customers.length"
      :key="reRenderTable"
      :information="customers"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-customers"></div>
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
    <q-dialog v-model="alterCustomers">
      <q-card style="width: 480px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Cliente</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <div class="row q-mb-xs text-bold">
              Información principal:
            </div>
            <q-input
              filled
              :disable="gettingInfo"
              v-model="customerData.name"
              class="ControlForm"
              label="Nombre"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese un nombre',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <div class="row">
              <q-input
                filled
                v-model="customerData.document"
                class="ControlForm col q-mr-md"
                label="Documento"
                type="number"
                :min="0"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa el documento',
                val => val && val > 0 && val.length <= 10 || 'Documento invalido']"
              />
              <q-input
                filled
                v-model="customerData.phone"
                class="ControlForm col"
                label="Telefono"
                type="number"
                :min="0"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un telefono',
                val => val &&  val > 0 && val.length <= 10 || 'Numero invalido']"
              />
            </div>
            <q-input
              filled
              :disable="gettingInfo"
              v-model="customerData.address"
              class="ControlForm"
              label="Dirección"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese una dirección',
                val => val && val.length <= 100 || 'Longitud maxima de 100 carácteres' ]"
            />
            <q-input
              filled
              v-model="customerData.date"
              class="ControlForm col-2"
              label="Fecha"
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
                      v-model="customerData.date"
                      mask="DD/MM/YYYY"
                      :options="maxDateIsToday"
                      @input="() => $refs.qDateProxy.hide()"
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
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
import TableView from '../components/table-view/TableView';
import DeleteTemplate from '../components/delete-template/DeleteTemplate';
import InteractionOptions from '../components/interaction-options/InteractionOptions';
import {
  LS_USER_INFO,
  SUCCESS_NOTIFICATION,
  ERROR_NOTIFICATION,
  getPossibleRoutes,
  getColumnsForTable,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import customerModel from '../commons/models/customer';
import { getError } from '../utils/helpers';
import { titles, staticColumns } from '../data/titlesBanks/customers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Customers',
  components: {
    TableView,
    InteractionOptions,
  },
  data() {
    return {
      loadingState: true,
      alterCustomers: false,
      reRenderTable: 0,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
      isCreate: null,
      gettingInfo: false,
      loadingAlter: false,
      customerData: {
        name: null,
        document: null,
        address: null,
        phone: null,
        date: formatDate(today, 'DD/MM/YYYY'),
      },
    };
  },
  mixins: [
    NotificationMixin,
  ],
  methods: {
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterCustomers = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterCustomers = true;
      this.gettingInfo = true;
      const customer = await this.$store.dispatch('customers/getForId', this.selected[0].id);
      this.customerData = customer;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await customerModel.getApiFormat(this.customerData);
          await this.$store.dispatch('customers/store', dataFormat);
          const msg = 'Registro exitoso';
          this.getData();
          this.alterCustomers = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await customerModel.getApiFormat(this.customerData);
          await this.$store.dispatch('customers/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          this.getData();
          this.alterCustomers = false;
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
          principal: item.name,
          caption: item.document,
          side: item.phone,
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
      await this.$store.dispatch('customers/remove', infoDelete);
    },
    reset() {
      this.customerData = {
        name: null,
        document: null,
        address: null,
        phone: null,
        date: formatDate(today, 'DD/MM/YYYY'),
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
    async getData() {
      await this.$store.dispatch('customers/get');
      this.loadingState = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    customers() {
      return this.$store.getters['customers/list'];
    },
    columns() {
      return getColumnsForTable(this.customers, titles, staticColumns);
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
