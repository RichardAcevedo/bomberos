<template>
  <div>
    <q-btn-dropdown
      v-if="userInfo"
      flat
      dense
      @show="updateHour"
    >
    <template v-if="!$q.screen.lt.sm" v-slot:label>
      <div class="row items-center no-wrap">
        <q-avatar>
          <q-img v-if="userInfo.avatar" :src="userInfo.avatar"/>
          <q-img v-else :src="require('../../assets/default-profile.png')"/>
        </q-avatar>
        <div class="column text-center text-capitalize q-ml-sm">
          {{ userInfo.name }}
          <q-badge color="white" class="text-weight-bold text-tertiary column">
            {{ getNameOfType(userInfo.type) }}
          </q-badge>
        </div>
      </div>
    </template>
      <q-list >
        <div class="text-center" v-if="$q.screen.lt.sm">
          <div class="q-mt-sm">
            <q-avatar>
              <q-img v-if="userInfo.avatar" :src="userInfo.avatar"/>
              <q-img v-else :src="require('../../assets/default-profile.png')"/>
            </q-avatar>
            <div>
              {{ userInfo.name }}
            </div>
          </div>
          <q-badge
            align="middle"
            class="q-mb-sm bg-default text-bold"
            :label="getNameOfType(userInfo.type)"
          />
        </div>
        <q-separator/>
        <q-item clickable @click="signOut">
          <q-item-section no-wrap>
            <q-item-label>Cerrar sesión</q-item-label>
            <q-item-label caption>{{ currentHour }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon class="text-default" name="cancel" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<style lang="stylus">
</style>

<script>
import { date } from 'quasar';
import { LS_USER_INFO } from '../../commons/constants';

const { formatDate } = date;

export default {
  name: 'UserSection',
  data() {
    return {
      small: false,
      currentHour: formatDate(new Date(), 'hh:mm aa'),
    };
  },
  props: {
    signOut: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    userInfo() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  methods: {
    updateHour() {
      this.currentHour = formatDate(new Date(), 'hh:mm aa');
    },
    getNameOfType(type) {
      let name = null;
      if (type === 'administrador-general') {
        name = 'Administrador General';
      } else if (type === 'minuta') {
        name = 'Minuta';
      } else if (type === 'maquinista') {
        name = 'Maquinista';
      } else if (type === 'prevencion-y-seguridad') {
        name = 'Prevención y seguridad';
      } else if (type === 'extintores') {
        name = 'Extintores';
      } else if (type === 'personal') {
        name = 'Personal';
      } else if (type === 'supervisor') {
        name = 'Supervisor';
      } else if (type === 'normal') {
        name = 'Normal';
      }
      return name;
    },
  },
};
</script>
