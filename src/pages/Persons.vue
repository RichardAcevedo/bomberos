<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">PERSONAS</div>
      <InteractionOptions
        v-if="user.type !== 'supervisor' && persons && persons.length"
        :selected="selected"
        :createFunction="createNew"
        :editFunction="editRow"
        :deleteFunction="openDelete"
      />
    </div>
    <q-separator />
    <div v-if="!persons">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <TableView
      v-else-if="persons && persons.length"
      :key="reRenderTable"
      :information="persons"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-persons"></div>
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
  LS_CREATING_PERSONS,
  getPossibleRoutes,
  getColumnsForTable,
  ROUTES,
  ERROR_NOTIFICATION,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import { titles, staticColumns } from '../data/titlesBanks/persons';

export default {
  name: 'Persons',
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
      currentEmployee: null,
    };
  },
  mixins: [
    NotificationMixin,
  ],
  methods: {
    createNew() {
      this.$q.localStorage.set(LS_CREATING_PERSONS, { created: true });
      this.$router.replace(ROUTES.personal.alterPersons);
    },
    editRow() {
      this.$q.localStorage.set(LS_CREATING_PERSONS, { created: false, id: this.selected[0].id });
      this.$router.replace(ROUTES.personal.alterPersons);
    },
    organizerDataDelete(info) {
      return info.reduce((m, item) => {
        m.push({
          principal: item.name,
          caption: item.document,
          side: item.profession,
        });
        return m;
      }, []);
    },
    openDelete() {
      const validDelete = this.selected.find(item => item.id === this.currentEmployee.person.id);
      if (!validDelete) {
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
      } else {
        const msg = 'No se puede eliminar la informacion del usuario logueado';
        this.createNotification({ message: msg, timeout: 3000, ...ERROR_NOTIFICATION });
      }
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('persons/remove', infoDelete);
    },
    getData() {
      this.$store.dispatch('persons/get');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    persons() {
      return this.$store.getters['persons/list'];
    },
    columns() {
      return getColumnsForTable(this.persons, titles, staticColumns);
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
    this.currentEmployee = await this.$store.dispatch('employees/getForId', this.user.id);
    this.getData();
  },
};
</script>
