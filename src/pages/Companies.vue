<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">EMPRESAS</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && companies && companies.length"
        :selected="selected"
        :createFunction="createNew"
        :editFunction="editRow"
        :deleteFunction="openDelete"
      />
    </div>
    <q-separator />
    <div v-if="!companies">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <TableView
      v-else-if="companies && companies.length"
      :key="reRenderTable"
      :information="companies"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-companies"></div>
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
  LS_CREATING_COMPANIES,
  getPossibleRoutes,
  getColumnsForTable,
  ROUTES,
} from '../commons/constants';
import { titles, staticColumns } from '../data/titlesBanks/companies';

export default {
  name: 'Companies',
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
      this.$q.localStorage.set(LS_CREATING_COMPANIES, { created: true });
      this.$router.replace(ROUTES.preventionAndSecurity.alterCompanies);
    },
    editRow() {
      this.$q.localStorage.set(LS_CREATING_COMPANIES, { created: false, id: this.selected[0].id });
      this.$router.replace(ROUTES.preventionAndSecurity.alterCompanies);
    },
    organizerDataDelete(info) {
      return info.reduce((m, item) => {
        m.push({
          principal: item.name,
          caption: item.representative,
          side: item.companyType,
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
      await this.$store.dispatch('companies/remove', infoDelete);
    },
    getData() {
      this.$store.dispatch('companies/get');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    companies() {
      return this.$store.getters['companies/list'];
    },
    columns() {
      return getColumnsForTable(this.companies, titles, staticColumns);
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
