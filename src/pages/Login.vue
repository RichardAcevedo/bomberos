<template>
  <div class="background-login">
    <div class="containter-login q-pa-lg  text-center">
      <div class="column">
        <div class="title-login q-mx-auto text-bold">
          INICIO DE SESION
        </div>
        <q-img
          class="q-mt-lg q-mb-md q-mx-auto"
          src="statics/user.png"
          style="width: 170px"
        />
      </div>
      <q-form
        @submit="login"
        class="q-mx-md"
      >
        <q-input
          filled
          class="ControlForm"
          v-model="userData.code"
          label="Código"
          stack-label
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Por favor ingresa tu codigo']"
        />
        <div class="row">
          <q-input
            class="ControlForm col"
            filled
            v-model="userData.password"
            :type="isPwd ? 'password' : 'text'"
            label="Constraseña"
            stack-label
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Por favor ingresa tu contraseña']"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            flat
            round
            class="q-ml-sm q-mt-sm"
            color="positive"
            icon="fingerprint"
            @click="toolbar = true"
          />
        </div>
        <q-select
          filled
          stack-label
          class="ControlForm"
          v-model="userData.type"
          :options="options"
          option-value="id"
          option-label="name"
          label="Tipo"
        />
        <div class="q-mt-lg">
          <q-btn
            unelevated
            :loading="loading"
            label="Ingresar"
            class="text-weight-bold button-login"
            type="submit"
          />
        </div>
      </q-form>
    </div>
    <q-dialog v-model="toolbar" @hide="cancelLoginFingerPrint">
        <q-card style="width: 350px; max-width: 80vw;">
          <q-toolbar class="q-mt-sm">
            <q-avatar color="positive" text-color="white" icon="fingerprint" />

            <q-toolbar-title>
              <span class="text-weight-bold">Acceso rapido</span>
            </q-toolbar-title>

            <q-btn
              flat
              @click="cancelLoginFingerPrint"
              round
              dense
              icon="close"
              v-close-popup
            />
          </q-toolbar>
          <q-form
            @submit="loginFingerPrint"
            class="q-mx-md"
          >
            <q-card-section class="row text-center">
              <span class="col-8 q-ml-auto q-mr-auto q-mb-md">
                Escribe el codigo, coloca el dedo en el huellero y espera..
              </span>
              <q-input
                filled
                class="col-12 ControlForm"
                v-model="userData.code"
                label="Código"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || $t('login.codeError')]"
              />
              <center class="col-12">
                <q-avatar text-color="positive" size="150px" icon="fingerprint" />
              </center>
            </q-card-section>

            <q-card-actions align="center" class="q-mb-xs">
              <q-btn
                color="negative"
                flat
                label="Cancelar"
                @click="cancelLoginFingerPrint"
                v-close-popup
              />
              <q-btn
                color="positive"
                type="submit"
                flat
                label="Ingresar"
                :loading="loadingFingerPrint"
              />
            </q-card-actions>
          </q-form>
        </q-card>
      </q-dialog>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';
  .background-login {
    // background: $primary;
     background-image:
      linear-gradient(
        rgba(0,0,0,0.4),
        rgba(0,0,0,0.4)
      ),
      url('~assets/background-login.jpg');
    background-position: center bottom;
    height: 100vh;
    min-height: 320px;
    align-items: center;
    display: flex;
    justify-content: center;
  }

  .containter-login {
    justify-content: center;
    background: white;
    width: 390px;
    border-radius: 10px;
    -webkit-box-shadow: 0px 0px 35px -11px rgba(112,53,48,1);
    -moz-box-shadow: 0px 0px 35px -11px rgba(112,53,48,1);
    box-shadow: 0px 0px 35px -11px rgba(112,53,48,1);
  }

  .title-login {
    width: max-content;
    padding-bottom: 8px;
    border-bottom: 1.5px solid $primary;
  }

  .button-login {
    background: #09D261;
    color: white;
  }

  .color-text-notify {
    color: $primary;
  }
</style>

<script>
import { LS_USER_INFO, ERROR_NOTIFICATION, getMenu } from '../commons/constants';
import userModel from '../commons/models/user';
import NotificationMixin from '../mixins/notifications';

export default {
  name: 'Login',
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      toolbar: false,
      loading: false,
      loadingFingerPrint: false,
      userData: {
        code: '',
        password: '',
        type: null,
      },
      options: null,
      isPwd: true,
    };
  },
  methods: {
    showNotif() {
      this.$q.notify({
        message: 'Por favor coloque el dedo sobre el huellero',
        icon: 'fingerprint',
        position: 'top',
      });
    },
    async login() {
      this.loading = true;
      try {
        const sendData = await userModel.getApiFormat(this.userData);
        const response = await this.$store.dispatch('auth/login', sendData);
        const getData = await userModel.getViewFormat(response.data);
        this.$q.localStorage.set(LS_USER_INFO, getData);
        const menu = getMenu(getData.type);
        const firstOption = menu[0].options[0].link;
        this.$router.replace(firstOption);
        this.loading = false;
      } catch (error) {
        const { data } = error.response;
        this.createNotification({ message: data, ...ERROR_NOTIFICATION });
        this.loading = false;
      }
    },
    async loginFingerPrint() {
      this.loadingFingerPrint = true;
      try {
        const sendData = await userModel.getFingerPrintFormat(this.userData.code);
        const response = await this.$store.dispatch('auth/loginFingerPrint', sendData);
        const getData = await userModel.getViewFormat(response.data);
        this.$q.localStorage.set(LS_USER_INFO, getData);
        const menu = getMenu(getData.type);
        const firstOption = menu[0].options[0].link;
        this.$router.replace(firstOption);
        this.loadingFingerPrint = false;
      } catch (error) {
        const { data } = error.response;
        this.createNotification({ message: data, ...ERROR_NOTIFICATION });
        this.loadingFingerPrint = false;
      }
    },
    cancelLoginFingerPrint() {
      this.$store.dispatch('employees/cancelFingerPrint');
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  async created() {
    this.options = await this.$store.dispatch('ui/getUserTypes');
    this.userData.type = this.options ? this.options[0] : null;
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.user) {
        const menu = getMenu(vm.user.type);
        const firstOption = menu[0].options[0].link;
        next(firstOption);
        // vm.$router.go(-1);
      }
      next();
    });
  },
};
</script>
