<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">LOG SQL</div>
    </div>
    <q-separator />
    <div v-if="!logs">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <TableView
      v-else-if="logs && logs.length"
      :key="reRenderTable"
      :information="logs"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-logs"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
    </div>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

</style>

<script>
import TableView from '../components/table-view/TableView';
import {
  LS_USER_INFO,
  getPossibleRoutes,
  getColumnsForTable,
} from '../commons/constants';
import { titles, staticColumns } from '../data/titlesBanks/logs';

export default {
  name: 'Logs',
  components: {
    TableView,
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
    getData() {
      this.$store.dispatch('logs/get');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    logs() {
      return this.$store.getters['logs/list'];
    },
    columns() {
      return getColumnsForTable(this.logs, titles, staticColumns);
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
