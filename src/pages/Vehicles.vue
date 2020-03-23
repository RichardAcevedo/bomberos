<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">VEHICULOS</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && vehicles && vehicles.length"
        :selected="selected"
        :createFunction="createNew"
        :editFunction="editRow"
        :deleteFunction="openDelete"
      />
    </div>
    <q-separator />
    <div v-if="!vehicles">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <TableView
      v-else-if="vehicles && vehicles.length"
      :key="reRenderTable"
      :information="vehicles"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-vehicles"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        v-if="user.type !== 'supervisor'"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="createNew"
      />
    </div>
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
  LS_CREATING_VEHICLES,
  getPossibleRoutes,
  getColumnsForTable,
  ROUTES,
} from '../commons/constants';
import { titles, staticColumns } from '../data/titlesBanks/vehicles';

export default {
  name: 'Vehicles',
  components: {
    TableView,
    InteractionOptions,
  },
  data() {
    return {
      reRenderTable: 0,
      loadingState: true,
      selected: [],
      visibleColumns: staticColumns,
      loadingDelete: false,
    };
  },
  methods: {
    createNew() {
      this.$q.localStorage.set(LS_CREATING_VEHICLES, { created: true });
      this.$router.replace(ROUTES.vehicles.alterVehicles);
    },
    editRow() {
      this.$q.localStorage.set(LS_CREATING_VEHICLES, { created: false, id: this.selected[0].id });
      this.$router.replace(ROUTES.vehicles.alterVehicles);
    },
    organizerDataDelete(info) {
      return info.reduce((m, item) => {
        m.push({
          principal: item.name,
          caption: item.licensePlate,
          side: item.vehicleType,
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
      await this.$store.dispatch('vehicles/remove', infoDelete);
    },
    getData() {
      this.$store.dispatch('vehicles/get');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    vehicles() {
      return this.$store.getters['vehicles/list'];
    },
    columns() {
      return getColumnsForTable(this.vehicles, titles, staticColumns);
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
    this.getData();
  },
};
</script>
