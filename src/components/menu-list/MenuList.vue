<template>
  <q-list class="app-menu">
    <q-item-label header>
      <q-img
        src="statics/logo-large.png"
      />
    </q-item-label>
    <q-separator/>
    <q-item :to="ROUTES.personal.alterOwnCurriculum" clickable>
      <q-item-section avatar>
        <!-- <q-icon name="account_circle" /> -->
        <q-avatar :size="'md'">
          <q-img v-if="user.avatar" :src="user.avatar"/>
          <q-img v-else :src="require('../../assets/default-profile.png')"/>
        </q-avatar>
      </q-item-section>
      <q-item-section>Hoja de vida personal</q-item-section>
    </q-item>
    <q-separator/>
    <q-expansion-item
      group="menu"
      expand-separator
      :key="index"
      v-for="(item, index) in menu"
      :icon="item.icon"
      :label="item.label"
      :default-opened="index === 0"
    >
      <q-item
        dense
        :inset-level="1"
        clickable
        :key="i"
        v-for="(sub, i) in item.options"
        :to="sub.link">
        <q-item-section>{{ sub.name }}</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<style lang="stylus">
</style>

<script>
import { ROUTES, LS_USER_INFO } from '../../commons/constants';

export default {
  name: 'MenuList',
  data() {
    return {
      ROUTES,
    };
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  props: {
    menu: {
      type: Array,
      default: () => [],
    },
  },
};
</script>
