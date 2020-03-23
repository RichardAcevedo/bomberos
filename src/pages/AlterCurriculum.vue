<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Hojas de vida"
        icon="person"
        :to="ROUTES.personal.curriculum"
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
      v-else-if="withPersons || !action.created"
    >
      <q-expansion-item
        group="tables-adds"
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="action.created"
        :caption="employeeData.person.name || null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <div class="row">
                <q-toggle
                  v-model="employeeData.active"
                  color="green"
                  class="q-mb-sm"
                  label="Activo"
                  :disable="unalterable"
                />
                <q-btn
                  v-if="!action.created && withFingerPrint.length > 0"
                  color="red"
                  label="Eliminar huella"
                  icon-right="fingerprint"
                  style="height:min-content"
                  class="q-ml-auto"
                  :loading="deletingFingerprint"
                  @click="bulkFingerPrint"
                />
              </div>
              <div class="row q-mb-xs">
                <q-select
                  filled
                  v-model="employeeData.person"
                  class="ControlForm col-3 q-mr-md"
                  label="Persona disponible"
                  :disable="unalterable"
                  :options="persons"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
                <q-input
                  filled
                  v-model="employeeData.code"
                  type="number"
                  min="0"
                  class="ControlForm col q-mr-md"
                  label="Código"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 || 'Por favor ingresa el código',
                  val => val && val >= 0 || 'Numero invalido' ]"
                />
                <q-input
                  v-model="employeeData.password"
                  filled
                  class="ControlForm col-3 q-mr-md"
                  label="Contraseña"
                  stack-label
                  :type="isPwd ? 'password' : 'text'"
                  lazy-rules
                  :rules="action.created ?
                  [ val => val && val.length > 0 || 'Por favor ingresa la contraseña' ] : []"
                  :hint="action.created ? '' : 'La contraseña actual estará oculta'"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>
                <q-select
                  filled
                  v-model="employeeData.userType"
                  class="ControlForm col-3"
                  label="Tipo de usuario"
                  :disable="unalterable"
                  :options="userTypes"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div class="row q-mb-xs">
                <SelectionInput
                  class="col-5 q-mr-md"
                  v-model="employeeData.city"
                  :searchParent="employeeData.city"
                  :optionsMenu="cities"
                  optionValue="id"
                  optionLabel="name"
                  :filled="true"
                  label="Ciudad"
                  :hint="employeeData.city ? ''
                    : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
                  :rules="[ () => employeeData.city || 'Por favor selecciona una ciudad']"
                />
                <q-input
                  filled
                  v-model="employeeData.dateIn"
                  class="ControlForm col-2 q-mr-md"
                  label="Fecha Ingreso"
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
                          v-model="employeeData.dateIn"
                          mask="DD/MM/YYYY"
                          :options="maxDateIsToday"
                          @input="() => $refs.qDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select
                  filled
                  v-model="employeeData.houseType"
                  class="ControlForm col-2 q-mr-md"
                  :options="['Arrendada', 'Propia']"
                  label="Tipo de casa"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && val.length > 0 ||
                  'Por favor selecciona un tipo']"
                />
              </div>
              <div class="row q-mb-xs">
                <q-select
                  v-model="employeeData.languages"
                  class="ControlForm col"
                  filled
                  use-chips
                  multiple
                  :options="languages"
                  option-value="id"
                  option-label="name"
                  label="Idiomas"
                  stack-label
                  lazy-rules
                  hint="Selecciona por lo menos un idioma"
                  :rules="[ val => val && val.length > 0 ||
                  'Por favor selecciona por lo menos un idioma']"
                />
              </div>
              <div class="row q-mb-xs text-bold">
                Información adicional:
              </div>
              <div class="row q-mb-xs">
                <q-toggle
                  v-model="employeeData.computer"
                  class="col-2 q-mr-md"
                  color="primary"
                  label="Computador"
                />
                <q-toggle
                  v-model="militaryCard"
                  class="col-2 q-mr-md"
                  color="primary"
                  label="Libreta Militar"
                />
                <q-toggle
                  v-model="license"
                  class="col-3 q-mr-md"
                  color="primary"
                  label="Licencia de conducción"
                />
              </div>
              <div class="row q-mb-xs">
                <q-input
                  filled
                  v-model="employeeData.npib"
                  type="number"
                  :min="0"
                  class="ControlForm col-3 q-mr-md"
                  label="Código NPIB"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val >= 0 ? ( val.length <= 50 ? true :
                  'Longitud maxima de 50 carácteres' ) : 'Numero incorrecto' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.dependents"
                  class="ControlForm col-2 q-mr-md"
                  type="number"
                  :min="0"
                  label="Pers. a cargo"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val >= 0 ? true : 'Numero incorrecto' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.sure"
                  class="ControlForm col-3 q-mr-md"
                  label="Seguro"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 50 ? true :
                    'Longitud maxima de 50 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.filing"
                  class="ControlForm col"
                  label="Radicación"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 50 ? true :
                    'Longitud maxima de 50 carácteres' ) : true ]"
                />
              </div>
              <div class="row q-mb-xs">
                <q-input
                  filled
                  v-model="employeeData.passport"
                  class="ControlForm col q-mr-md"
                  label="Pasaporte"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 50 ? true :
                    'Longitud maxima de 50 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.activity"
                  class="ControlForm col-3 q-mr-md"
                  label="Actividad"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 100 ? true :
                    'Longitud maxima de 100 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.machine"
                  class="ControlForm col"
                  label="Maquina"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 100 ? true :
                    'Longitud maxima de 100 carácteres' ) : true ]"
                />
              </div>
              <div class="row">
                <q-input
                  filled
                  v-model="employeeData.work"
                  class="ControlForm col-4 q-mr-md"
                  label="Labor"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 100 ? true :
                    'Longitud maxima de 100 carácteres' ) : true ]"
                />
                <q-input
                  filled
                  v-model="employeeData.hobi"
                  class="ControlForm col"
                  label="Hobi"
                  stack-label
                  lazy-rules
                  :rules="[ val => val ? ( val.length <= 150 ? true :
                    'Longitud maxima de 150 carácteres' ) : true ]"
                />
              </div>
              <div class="row q-mb-md text-bold" v-if="militaryCard">
                Libreta militar:
              </div>
              <div class="row q-mb-xs" v-if="militaryCard">
                <q-select
                  filled
                  v-model="employeeData.militaryCard.class"
                  class="ControlForm col-3 q-mr-md"
                  :options="['Primera', 'Segunda']"
                  label="Clase"
                  stack-label
                  lazy-rules
                  :rules="[ val => militaryCard && val && val.length > 0 ||
                  'Por favor selecciona una clase']"
                />
                <q-input
                  filled
                  v-model="employeeData.militaryCard.district"
                  class="ControlForm col-3 q-mr-md"
                  label="Distrito"
                  stack-label
                  lazy-rules
                  :rules="[ val => val && militaryCard || 'Por favor ingrese un distrito',
                    val => val && militaryCard && val.length <= 80 ||
                      'Longitud maxima de 80 carácteres' ]"
                />
              </div><div class="row q-mb-md text-bold" v-if="license">
                Licencia de conducción:
              </div>
              <div class="row q-mb-xs" v-if="license">
                <q-input
                  filled
                  v-model="employeeData.license.expeditionDate"
                  class="ControlForm col-3 q-mr-md"
                  label="Fecha de expedición"
                  readonly
                  stack-label
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
                          v-model="employeeData.license.expeditionDate"
                          mask="DD/MM/YYYY"
                          :options="maxDateIsToday"
                          @input="() => $refs.qDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-input
                  filled
                  v-model="employeeData.license.effectiveDate"
                  class="ControlForm col-3 q-mr-md"
                  label="Fecha de vigencia"
                  readonly
                  stack-label
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
                          v-model="employeeData.license.effectiveDate"
                          mask="DD/MM/YYYY"
                          :options="minDateIsToday"
                          @input="() => $refs.qDateProxy.hide()"
                        />
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
                <q-select
                  filled
                  v-model="employeeData.license.licenseCategory"
                  class="ControlForm col-2 q-mr-md"
                  label="Categoria"
                  :options="licenseCategories"
                  option-value="id"
                  option-label="name"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div>
                <div v-if="action.created" class="q-field__bottom q-mb-sm">
                  <strong>IMPORTANTE:</strong> Para tener acceso a las demas secciones(cursos
                  bomberiles, educación, etc.) es necesario crear la hoja de vida y luego editarla.
                </div>
                <q-btn
                  :label="action.created ? 'GUARDAR' : 'ACTUALIZAR DATOS'"
                  :loading="loading"
                  class="full-width"
                  type="submit"
                  color="positive"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-expansion-item>
      <div v-if="!action.created">
        <q-expansion-item
          v-model="sections.courses"
          group="tables-adds"
          expand-separator
          icon="fireplace"
          label="Curso Bomberil"
        >
          <q-card>
            <q-card-section>
              <Courses
                :loading="loadingStateCourse"
                :idTarget="action.id"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-model="sections.education"
          group="tables-adds"
          expand-separator
          icon="school"
          label="Educación"
        >
          <q-card>
            <q-card-section>
              <Educations
                :loading="loadingStateEducation"
                :idTarget="action.id"
                :cities="cities"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-model="sections.experiences"
          group="tables-adds"
          expand-separator
          icon="assessment"
          label="Experiencia"
        >
          <q-card>
            <q-card-section>
              <Experiences
                :loading="loadingStateExperience"
                :idTarget="action.id"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-model="sections.information"
          group="tables-adds"
          expand-separator
          icon="info"
          label="Información Bomberil"
        >
          <q-card>
            <q-card-section>
              <Informations
                :loading="loadingStateInformation"
                :idTarget="action.id"
                :ranks="ranks"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          v-model="sections.trainings"
          group="tables-adds"
          expand-separator
          icon="supervised_user_circle"
          label="Capacitación"
        >
          <q-card>
            <q-card-section>
              <Trainings
                :loading="loadingStateTranings"
                :idTarget="action.id"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>
      </div>
    </q-list>
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-persons"></div>
      <h4 class="empty-copy"> No hay personas sin hojas de vida </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR PERSONAS"
        :to="ROUTES.personal.persons"
      />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-style: hidden;
}
</style>

<script>
import { date } from 'quasar';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_CURRICULUM,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import SelectionInput from '../components/selection-input/SelectionInput';
import NotificationMixin from '../mixins/notifications';
import employeeModel from '../commons/models/employee';
import { getError } from '../utils/helpers';
import Courses from '../components/extra-tables-employees/Courses';
import Educations from '../components/extra-tables-employees/Educations';
import Experiences from '../components/extra-tables-employees/Experiences';
import Informations from '../components/extra-tables-employees/Informations';
import Trainings from '../components/extra-tables-employees/Trainings';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterCurriculum',
  components: {
    SelectionInput,
    Courses,
    Educations,
    Experiences,
    Informations,
    Trainings,
  },
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      sectionsSelected: {},
      sections: {
        courses: false,
        education: false,
        experiences: false,
        information: false,
        trainings: false,
      },
      loadingState: true,
      loadingStateCourse: true,
      loadingStateEducation: true,
      loadingStateExperience: true,
      loadingStateInformation: true,
      loadingStateTranings: true,
      unalterable: false,
      employeeData: {
        npib: null,
        code: null,
        password: null,
        dateIn: formatDate(today, 'DD/MM/YYYY'),
        filing: null,
        active: true,
        passport: null,
        sure: null,
        houseType: 'Arrendada',
        dependents: 0,
        activity: null,
        work: null,
        machine: null,
        computer: false,
        hobi: null,
        userType: null,
        person: null,
        city: null,
        languages: null,
        militaryCard: {
          class: 'Primera',
          district: null,
        },
        license: {
          expeditionDate: formatDate(today, 'DD/MM/YYYY'),
          effectiveDate: formatDate(today, 'DD/MM/YYYY'),
          licenseCategory: null,
        },
      },
      withFingerPrint: [],
      withPersons: true,
      loading: false,
      deletingFingerprint: false,
      isPwd: true,
      today,
      ROUTES,
      militaryCard: false,
      license: false,
      userTypes: [],
      persons: [],
      cities: [],
      licenseCategories: [],
      languages: [],
    };
  },
  methods: {
    async onSubmit() {
      this.loading = true;
      const send = JSON.parse(JSON.stringify(this.employeeData));
      send.militaryCard = this.militaryCard ? send.militaryCard : null;
      send.license = this.license ? send.license : null;
      if (this.action.created) { // Validacion de si es editar o crear
        try {
          const dataFormat = await employeeModel.getApiFormat(send);
          await this.$store.dispatch('employees/store', dataFormat);
          const msg = 'Registro exitoso';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.curriculum);
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loading = false;
        }
      } else {
        try {
          const dataFormat = await employeeModel.getApiFormat(send);
          await this.$store.dispatch('employees/update', dataFormat);
          const msg = 'Actualizacion satisfactoria';
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
          this.loading = false;
          this.$router.replace(ROUTES.personal.curriculum);
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
    minDateIsToday(dates) {
      return dates >= formatDate(today, 'YYYY/MM/DD');
    },
    bulkFingerPrint() {
      this.$q.dialog({
        title: 'Confirmar borrado de huella',
        message: 'Se eliminara el registro de huella dactilar y solo se podra ingresar por contraseña.',
        cancel: true,
        ok: {
          label: 'Eliminar',
          color: 'negative',
          flat: true,
        },
      }).onOk(async () => {
        this.deletingFingerprint = true;
        await this.$store.dispatch('ui/removeFingerprintForEmployee', this.action.id);
        this.withFingerPrint = await this.$store.dispatch('employees/withFingerPrint', this.action.id);
        this.deletingFingerprint = false;
      }).onOk(() => {})
        .onCancel(() => {})
        .onDismiss(() => {});
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_CURRICULUM);
    },
  },
  async created() {
    if (this.action.created) {
      this.persons = await this.$store.dispatch('persons/getNotEmployees');
      this.withPersons = this.persons.length > 0;
      if (this.withPersons) {
        await Promise.all([
          this.userTypes = await this.$store.dispatch('ui/getUserTypes'),
          this.cities = await this.$store.dispatch('ui/getCities'),
          this.licenseCategories = await this.$store.dispatch('ui/getLicenseCategories'),
          this.languages = await this.$store.dispatch('ui/getLanguages'),
        ]);
        this.employeeData.person = this.persons ? this.persons[0] : {};
        this.employeeData.userType = this.userTypes ? this.userTypes[0] : {};
        this.employeeData.license.licenseCategory = this.licenseCategories
          ? this.licenseCategories[0] : {};
      }
      this.loadingState = false;
    } else {
      await Promise.all([
        this.userTypes = await this.$store.dispatch('ui/getUserTypes'),
        this.cities = await this.$store.dispatch('ui/getCities'),
        this.licenseCategories = await this.$store.dispatch('ui/getLicenseCategories'),
        this.languages = await this.$store.dispatch('ui/getLanguages'),
        this.withFingerPrint = await this.$store.dispatch('employees/withFingerPrint', this.action.id),
      ]);
      const idToEdit = this.action.id;
      if (idToEdit === this.user.id) {
        this.unalterable = true;
      }
      this.ranks = await this.$store.dispatch('ranks/get');
      const employee = await this.$store.dispatch('employees/getForId', idToEdit);
      this.persons.unshift(employee.person);// Adicionando la persona actual a la lista.
      this.employeeData = employee;
      this.militaryCard = employee.militaryCard !== null;
      this.employeeData.militaryCard = employee.militaryCard || {
        class: 'Primera',
        district: null,
      };
      this.license = employee.license !== null;
      this.employeeData.license = employee.license || {
        expeditionDate: formatDate(today, 'DD/MM/YYYY'),
        effectiveDate: formatDate(today, 'DD/MM/YYYY'),
        licenseCategory: this.licenseCategories ? this.licenseCategories[0] : {},
      };
      this.loadingState = false;
    }
  },
  async updated() {
    if (this.sectionsSelected.courses !== this.sections.courses
      || this.sectionsSelected.education !== this.sections.education
      || this.sectionsSelected.experiences !== this.sections.experiences
      || this.sectionsSelected.information !== this.sections.information
      || this.sectionsSelected.trainings !== this.sections.trainings) {
      // Hago la asignacion en cada if y no al final para evitar errores por el
      // asincronismo de js
      if (this.sections.courses) {
        this.sectionsSelected = JSON.parse(JSON.stringify(this.sections));
        await this.$store.dispatch('employeeCourses/getForEmployee', this.action.id);
        this.loadingStateCourse = false;
      } else if (this.sections.education) {
        this.sectionsSelected = JSON.parse(JSON.stringify(this.sections));
        await this.$store.dispatch('employeeEducations/getForEmployee', this.action.id);
        this.loadingStateEducation = false;
      } else if (this.sections.experiences) {
        this.sectionsSelected = JSON.parse(JSON.stringify(this.sections));
        await this.$store.dispatch('employeeExperiences/getForEmployee', this.action.id);
        this.loadingStateExperience = false;
      } else if (this.sections.information) {
        this.sectionsSelected = JSON.parse(JSON.stringify(this.sections));
        await this.$store.dispatch('employeeInformations/getForEmployee', this.action.id);
        this.loadingStateInformation = false;
      } else if (this.sections.trainings) {
        this.sectionsSelected = JSON.parse(JSON.stringify(this.sections));
        await this.$store.dispatch('employeeTrainings/getForEmployee', this.action.id);
        this.loadingStateTranings = false;
      }
    }
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
