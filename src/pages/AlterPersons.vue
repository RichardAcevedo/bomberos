<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Personas"
        icon="person"
        :to="ROUTES.personal.persons"
      />
      <q-breadcrumbs-el
        :label="action.created ? 'Crear' : 'Modificar'"
        :icon="action.created ? 'attach_file' : 'edit'"
      />
    </q-breadcrumbs>
    <div v-if="loadingState">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <q-list
      bordered class="rounded-borders"
      v-else
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? personData.name : null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <input
                type="file"
                style="display: none"
                ref="fileInput"
                accept="image/*"
                @change="onFilePicked"
              />
              <div class="row q-mb-xs">
                <span class="text-bold">Foto de perfil</span>
                <span class="q-mx-xs">(Opcional)</span>
                <span class="text-bold">:</span>
              </div>
              <div class="text-center q-my-md">
                <q-img
                  class="image-profile"
                  v-if="personData.photo"
                  :src="personData.photo"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">
                    <q-btn
                      flat
                      color="white"
                      class="full-width"
                      icon="camera_alt"
                      @click="onPickFile"
                    />
                  </div>
                </q-img>
                <q-img
                  class="image-profile"
                  v-else
                  :src="require('../assets/default-profile.png')"
                >
                  <div class="absolute-bottom text-subtitle1 text-center">
                    <q-btn
                      flat
                      color="white"
                      class="full-width"
                      icon="camera_alt"
                      @click="onPickFile"
                    />
                  </div>
                </q-img>
              </div>
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <q-toggle
                v-model="personData.live"
                class="q-mb-sm"
                color="primary"
                label="Vivo"
              />
              <div class="row">
              <q-input
                filled
                v-model="personData.name"
                class="ControlForm col-4 q-mr-md"
                label="Nombre"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa el nombre',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
              <q-input
                filled
                v-model="personData.phone"
                class="ControlForm col q-mr-md"
                label="Tel. Fijo"
                type="number"
                :min="0"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un telefono',
                val => val &&  val > 0 && val.length <= 10 || 'Numero invalido']"
              />
              <q-input
                filled
                v-model="personData.document"
                class="ControlForm col-3 q-mr-md"
                label="Documento"
                type="number"
                :min="0"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa el documento',
                val => val && val > 0 && val.length <= 10 || 'Documento invalido']"
              />
              <q-input
                filled
                v-model="personData.birthDate"
                class="ControlForm col-2"
                label="Nacimiento"
                stack-label
                readonly
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa una fecha']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="personData.birthDate"
                        mask="DD/MM/YYYY"
                        :options="maxDateIsToday"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              </div>
              <div class="row">
              <q-input
                filled
                v-model="personData.email"
                class="ControlForm col-3 q-mr-md"
                label="Correo"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 ||
                'Por favor ingresa un correo electronico']"
              />
              <q-select
                filled
                v-model="personData.civilStatus"
                class="ControlForm col-2 q-mr-md"
                :options="['Soltero(a)', 'Casado(a)', 'Divorciado(a)']"
                label="Estado civil"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor selecciona un estado']"
              />
              <q-input
                filled
                v-model="personData.weight"
                class="ControlForm col-2 q-mr-md"
                label="Peso"
                suffix="kgs"
                hint="Ejemplo: 75 kgs"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa tu peso',
                val => val > 40 && val <= 120 || 'Peso invalido']"
              />
              <q-input
                filled
                v-model="personData.height"
                class="ControlForm col q-mr-md"
                label="Estatura"
                suffix="mts"
                hint="Ejemplo: 1.80 mts"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa tu estatura',
                val => val > 1.00 && val <= 2.50 || 'Estatura invalida']"
              />
              <q-select
                filled
                v-model="personData.sex"
                class="ControlForm col-2"
                :options="['Masculino', 'Femenino']"
                label="Genero"
                stack-label
                lazy-rules
                :rules="[]"
              />
              </div>
              <div class="row">
              <q-input
                filled
                v-model="personData.mobile"
                class="ControlForm col q-mr-md"
                label="Celular"
                type="number"
                :min="0"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa un celular',
                val => val && val.length === 10 || 'Numero invalido']"
              />
              <SelectionInput
                class="col-5 q-mr-md"
                v-model="personData.birthCity"
                :searchParent="personData.birthCity"
                :optionsMenu="cities"
                optionValue="id"
                optionLabel="name"
                :filled="true"
                label="Ciudad de Nacimiento"
                :hint="personData.birthCity ? ''
                  : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
                :rules="[ () => personData.birthCity || 'Por favor selecciona una ciudad']"
              />
              <q-select
                filled
                v-model="personData.bloodType"
                class="ControlForm col q-mr-md"
                label="Tipo de sangre"
                :options="bloodTypes"
                option-value="id"
                option-label="name"
                stack-label
                lazy-rules
                :rules="[]"
              />
              <q-select
                filled
                v-model="personData.profession"
                class="ControlForm col"
                label="Profesión"
                :options="professions"
                option-value="id"
                option-label="name"
                stack-label
                lazy-rules
                :rules="[]"
              />
              </div>
              <!-- TODO: Fotografia (En adicionales) -->
              <div class="row q-mb-xs text-bold">
                Información adicional:
              </div>
              <div class="row">
              <q-input
                filled
                v-model="personData.address"
                class="ControlForm col q-mr-md"
                label="Dirección"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 100 ? true :
                  'Longitud maxima de 100 carácteres' ) : true ]"
              />
              <q-input
                filled
                v-model="personData.neighborhood"
                class="ControlForm col"
                label="Barrio"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 50 ? true :
                  'Longitud maxima de 50 carácteres' ) : true ]"
              />
              </div>
              <q-btn
                :label="action.created ? 'GUARDAR' : 'ACTUALIZAR DATOS'"
                :loading="loading"
                class="full-width"
                type="submit"
                color="positive"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-style: hidden;
}

.image-profile {
  border-radius: 100%;
  height: 200px;
  width: 200px;
}
</style>

<script>
import { date } from 'quasar';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_PERSONS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import SelectionInput from '../components/selection-input/SelectionInput';
import NotificationMixin from '../mixins/notifications';
import personModel from '../commons/models/person';
import { getError } from '../utils/helpers';

const { formatDate, subtractFromDate } = date;
const today = Date.now();

export default {
  name: 'AlterPersons',
  components: {
    SelectionInput,
  },
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      personData: {
        name: null,
        birthDate: formatDate(subtractFromDate(today, { year: 18 }), 'DD/MM/YYYY'),
        sex: 'Masculino',
        live: true,
        neighborhood: null,
        address: null,
        phone: null,
        mobile: null,
        civilStatus: 'Soltero(a)',
        document: null,
        height: 0,
        weight: 0,
        email: null,
        photo: null,
        bloodType: null,
        birthCity: null,
        profession: null,
      },
      loading: false,
      today,
      ROUTES,
      bloodTypes: [],
      cities: [],
      professions: [],
      image: null,
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await personModel.getApiFormat(this.personData);
          await this.$store.dispatch('persons/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.persons);
        } catch (e) {
          // console.log(e);
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await personModel.getApiFormat(this.personData);
          await this.$store.dispatch('persons/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          if (this.personData.id === this.user.id) {
            const userUpdated = { ...this.user };
            userUpdated.name = this.personData.name;
            userUpdated.avatar = this.personData.photo ? this.personData.photo : this.user.avatar;
            this.$q.localStorage.set(LS_USER_INFO, userUpdated);
            this.$router.replace(ROUTES.personal.persons);
            this.$router.go();
          } else {
            this.$router.replace(ROUTES.personal.persons);
          }
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      }
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
    minimumYears(dates) {
      return dates <= formatDate(subtractFromDate(today, { year: 18 }), 'YYYY/MM/DD');
    },
    minDateIsToday(dates) {
      return dates >= formatDate(today, 'YYYY/MM/DD');
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const { files } = event.target;
      const fileName = files[0].name;
      if (fileName.lastIndexOf('.') > 0) {
        const fileReader = new FileReader();
        fileReader.addEventListener('load', () => {
          this.personData.photo = fileReader.result;
        });
        fileReader.readAsDataURL(files[0]);
        this.image = files ? files[0] : null;
      }
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_PERSONS);
    },
  },
  async created() {
    await Promise.all([
      this.bloodTypes = await this.$store.dispatch('ui/getBloodTypes'),
      this.cities = await this.$store.dispatch('ui/getCities'),
      this.professions = await this.$store.dispatch('ui/getProfessions'),
    ]);
    if (this.action.created) {
      this.personData.bloodType = this.bloodTypes ? this.bloodTypes[0] : {};
      this.personData.profession = this.professions ? this.professions[0] : {};
    } else {
      const idToEdit = this.action.id;
      const person = await this.$store.dispatch('persons/getForId', idToEdit);
      this.personData = person;
    }
    this.loadingState = false;
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
};
</script>
