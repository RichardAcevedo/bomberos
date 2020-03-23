<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">RANGOS</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && ranks && ranks.length"
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
      v-else-if="ranks && ranks.length"
      :key="reRenderTable"
      :information="ranks"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-ranks"></div>
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
    <q-dialog v-model="alterRanks">
      <q-card style="width: 400px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Rango</div>
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
              v-model="rankData.name"
              class="ControlForm"
              label="Nombre"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese un nombre',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <q-select
              filled
              :disable="gettingInfo"
              v-model="rankData.category"
              class="ControlForm"
              label="Categoria"
              :options="categories"
              option-value="id"
              option-label="name"
              stack-label
              lazy-rules
              :rules="[]"
            />
            <q-input
              filled
              autogrow
              :disable="gettingInfo"
              v-model="rankData.description"
              class="ControlForm"
              label="Descripción"
              stack-label
              lazy-rules
              :rules="[]"
            />
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
  WARNING_NOTIFICATION,
  getPossibleRoutes,
  getColumnsForTable,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import rankModel from '../commons/models/rank';
import { getError } from '../utils/helpers';
import { titles, staticColumns } from '../data/titlesBanks/ranks';

export default {
  name: 'Ranks',
  components: {
    TableView,
    InteractionOptions,
  },
  data() {
    return {
      alterRanks: false,
      reRenderTable: 0,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
      isCreate: null,
      gettingInfo: false,
      loadingAlter: false,
      loadingState: true,
      rankData: {
        name: null,
        category: null,
        description: null,
      },
      withCategories: false,
    };
  },
  mixins: [
    NotificationMixin,
  ],
  methods: {
    openCreateNew() {
      if (this.withCategories) {
        this.isCreate = true;
        this.reset();
        this.alterRanks = true;
      } else {
        const msg = 'No hay categorias disponibles';
        this.createNotification({ message: msg, timeout: 8000, ...WARNING_NOTIFICATION });
      }
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterRanks = true;
      this.gettingInfo = true;
      const rank = await this.$store.dispatch('ranks/getForId', this.selected[0].id);
      this.rankData = rank;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await rankModel.getApiFormat(this.rankData);
          await this.$store.dispatch('ranks/store', dataFormat);
          const msg = 'Registro exitoso';
          this.getData();
          this.alterRanks = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await rankModel.getApiFormat(this.rankData);
          await this.$store.dispatch('ranks/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          this.getData();
          this.alterRanks = false;
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
          caption: `ID: ${item.id}`,
          side: item.category,
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
      await this.$store.dispatch('ranks/remove', infoDelete);
    },
    reset() {
      this.rankData = {
        name: null,
        category: this.categories ? this.categories[0] : null,
        description: null,
      };
    },
    async getData() {
      await this.$store.dispatch('ranks/get');
      await this.$store.dispatch('rankCategories/get');
      this.withCategories = this.categories.length > 0;
      this.loadingState = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    ranks() {
      return this.$store.getters['ranks/list'];
    },
    categories() {
      return this.$store.getters['rankCategories/list'];
    },
    columns() {
      return getColumnsForTable(this.ranks, titles, staticColumns);
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
