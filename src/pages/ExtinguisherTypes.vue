<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">TIPOS DE EXTINTORES</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && extinguisherTypes && extinguisherTypes.length"
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
      v-else-if="extinguisherTypes && extinguisherTypes.length"
      :key="reRenderTable"
      :information="extinguisherTypes"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-extinguisherTypes"></div>
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
    <q-dialog v-model="alterExtinguisherTypes">
      <q-card style="width: 480px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Tipo de extintor</div>
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
              v-model="extinguisherTypeData.name"
              class="ControlForm"
              label="Nombre del extintor"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese un tipo',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="extinguisherTypeData.unity"
                class="ControlForm col q-mr-md"
                label="Por unidad"
                :min="0"
                type="number"
                stack-label
                lazy-rules
                :rules="[ val => val && val >= 0 || 'Numero invalido' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="extinguisherTypeData.quantity"
                class="ControlForm col"
                :min="0"
                type="number"
                label="Cantidad"
                stack-label
                lazy-rules
                :rules="[ val => val && val >= 0 || 'Numero invalido' ]"
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
import extinguisherTypeModel from '../commons/models/extinguisherType';
import { getError } from '../utils/helpers';
import { titles, staticColumns } from '../data/titlesBanks/extinguisherTypes';

export default {
  name: 'ExtinguisherTypes',
  components: {
    TableView,
    InteractionOptions,
  },
  data() {
    return {
      loadingState: true,
      alterExtinguisherTypes: false,
      reRenderTable: 0,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
      isCreate: null,
      gettingInfo: false,
      loadingAlter: false,
      extinguisherTypeData: {
        name: null,
        unity: 0,
        quantity: 0,
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
      this.alterExtinguisherTypes = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterExtinguisherTypes = true;
      this.gettingInfo = true;
      const extinguisherType = await this.$store.dispatch('extinguisherTypes/getForId', this.selected[0].id);
      this.extinguisherTypeData = extinguisherType;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await extinguisherTypeModel.getApiFormat(this.extinguisherTypeData);
          await this.$store.dispatch('extinguisherTypes/store', dataFormat);
          const msg = 'Registro exitoso';
          this.getData();
          this.alterExtinguisherTypes = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await extinguisherTypeModel.getApiFormat(this.extinguisherTypeData);
          await this.$store.dispatch('extinguisherTypes/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          this.getData();
          this.alterExtinguisherTypes = false;
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
          caption: `por unidad: ${item.unity}`,
          side: item.quantity,
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
      await this.$store.dispatch('extinguisherTypes/remove', infoDelete);
    },
    reset() {
      this.extinguisherTypeData = {
        name: null,
        unity: 0,
        quantity: 0,
      };
    },
    async getData() {
      await this.$store.dispatch('extinguisherTypes/get');
      this.loadingState = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    extinguisherTypes() {
      return this.$store.getters['extinguisherTypes/list'];
    },
    columns() {
      return getColumnsForTable(this.extinguisherTypes, titles, staticColumns);
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
