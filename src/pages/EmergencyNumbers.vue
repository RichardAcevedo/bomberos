<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">TELEFONOS DE EMERGENCIA</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && emergencyNumbers && emergencyNumbers.length"
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
      v-else-if="emergencyNumbers && emergencyNumbers.length"
      :key="reRenderTable"
      :information="emergencyNumbers"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-emergencyNumbers"></div>
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
    <q-dialog v-model="alterEmergencyNumbers">
      <q-card style="width: 480px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Telefono de emergencia</div>
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
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.phone"
                class="ControlForm col q-mr-md"
                type="number"
                :min="0"
                label="Telefono"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un telefono',
                  val => val && val.length <= 10 || 'Numero incorrecto']"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.entity"
                class="ControlForm col"
                label="Entidad"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese una entidad',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
            </div>
            <div class="row q-mb-xs text-bold">
              Información Adicional:
            </div>
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.address"
                class="ControlForm col q-mr-md"
                label="Dirección"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 100 ? true :
                  'Longitud maxima de 100 carácteres' ) : true ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.neighborhood"
                class="ControlForm"
                label="Barrio"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 50 ? true :
                  'Longitud maxima de 50 carácteres' ) : true ]"
              />
            </div>
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.otherNumber"
                class="ControlForm col q-mr-md"
                type="number"
                :min="0"
                label="Otro telefono"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 10 && val > 0 ? true :
                  'Numero incorrecto' ) : true ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="emergencyNumberData.extension"
                class="ControlForm col"
                type="number"
                :min="0"
                label="Extension"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 5 && val > 0 ? true :
                  'Extension incorrecta' ) : true]"
              />
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
import emergencyNumberModel from '../commons/models/emergencyNumber';
import { getError } from '../utils/helpers';
import { titles, staticColumns } from '../data/titlesBanks/emergencyNumbers';

export default {
  name: 'EmergencyNumbers',
  components: {
    TableView,
    InteractionOptions,
  },
  data() {
    return {
      loadingState: true,
      alterEmergencyNumbers: false,
      reRenderTable: 0,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
      isCreate: null,
      gettingInfo: false,
      loadingAlter: false,
      emergencyNumberData: {
        phone: null,
        entity: null,
        address: null,
        neighborhood: null,
        otherNumber: null,
        extension: null,
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
      this.alterEmergencyNumbers = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterEmergencyNumbers = true;
      this.gettingInfo = true;
      const emergencyNumber = await this.$store.dispatch('emergencyNumbers/getForId', this.selected[0].id);
      this.emergencyNumberData = emergencyNumber;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await emergencyNumberModel.getApiFormat(this.emergencyNumberData);
          await this.$store.dispatch('emergencyNumbers/store', dataFormat);
          const msg = 'Registro exitoso';
          this.getData();
          this.alterEmergencyNumbers = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await emergencyNumberModel.getApiFormat(this.emergencyNumberData);
          await this.$store.dispatch('emergencyNumbers/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          this.getData();
          this.alterEmergencyNumbers = false;
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
          principal: item.phone,
          caption: item.extension,
          side: item.entity,
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
      await this.$store.dispatch('emergencyNumbers/remove', infoDelete);
    },
    reset() {
      this.emergencyNumberData = {
        phone: null,
        entity: null,
        address: null,
        neighborhood: null,
        otherNumber: null,
        extension: null,
      };
    },
    async getData() {
      await this.$store.dispatch('emergencyNumbers/get');
      this.loadingState = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    emergencyNumbers() {
      return this.$store.getters['emergencyNumbers/list'];
    },
    columns() {
      return getColumnsForTable(this.emergencyNumbers, titles, staticColumns);
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
