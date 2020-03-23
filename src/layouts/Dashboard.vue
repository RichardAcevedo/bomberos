<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="q-py-sm header">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
        />
        <SelectionInput
          class="q-ml-md"
          v-model="search"
          :optionsMenu="menuSearch"
          optionValue="link"
          optionLabel="name"
          :callToAction="redirectToSelected"
          :dark="true"
          :dense="true"
          :standout="true"
          icon="search"
        />
        <q-toolbar-title/>
        <UserSection
          :signOut="signOut"
        />
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-scroll-area class="scrollArea">
        <MenuList
          :menu="menu"
        />
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="stylus">
@import '../css/app.styl';

.header {
  background: $primary;
}

.scrollArea {
  height: 100%;
  max-width: 300px;
}
</style>

<script>
import { LS_USER_INFO, getMenu } from '../commons/constants';
import MenuList from '../components/menu-list/MenuList';
import UserSection from '../components/user-section/UserSection';
import SelectionInput from '../components/selection-input/SelectionInput';

export default {
  name: 'Dashboard',
  data() {
    return {
      search: {},
      leftDrawerOpen: false,
      menu: null,
      menuSearch: null,
    };
  },
  components: {
    MenuList,
    UserSection,
    SelectionInput,
  },
  methods: {
    signOut() {
      this.$store.dispatch('employees/cancelFingerPrint');
      this.$q.localStorage.remove(LS_USER_INFO);
      this.$router.replace('/');
    },
    redirectToSelected(item) {
      if (this.$router.history.current.path !== item.link) {
        this.$router.replace(item.link);
      }
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  created() {
    if (this.user) {
      this.menu = getMenu(this.user.type);
      this.menuSearch = this.menu.reduce((m, section) => {
        m.push(...section.options);
        return m;
      }, []);
    }
  },
};
</script>
