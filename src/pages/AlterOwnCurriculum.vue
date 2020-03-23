<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
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
        v-model="formPerson"
        group="tables-adds"
        icon="account_circle"
        label="Datos personales"
        :caption="personData.name || null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmitPerson"
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
                        :options="minimumYears"
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
      <q-expansion-item
        group="tables-adds"
        expand-separator
        v-model="formEmployee"
        icon="work"
        label="Datos del empleado"
        :caption="employeeData.userType.name || null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmitEmployee"
            >
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <q-toggle
                v-model="employeeData.active"
                color="green"
                class="q-mb-sm"
                label="Activo"
              />
              <div class="row q-mb-xs">
                <q-select
                  filled
                  v-model="employeeData.person"
                  class="ControlForm col-3 q-mr-md"
                  label="Persona"
                  :options="persons"
                  option-value="id"
                  option-label="name"
                  disable
                  readonly
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
                  :hint="action.created ? '' : 'Esta contraseña solo es revelada al propietario'"
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
                  :options="userTypes"
                  disable
                  readonly
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
  LS_USER_INFO,
} from '../commons/constants';
import SelectionInput from '../components/selection-input/SelectionInput';
import NotificationMixin from '../mixins/notifications';
import employeeModel from '../commons/models/employee';
import personModel from '../commons/models/person';
import { getError } from '../utils/helpers';
import Courses from '../components/extra-tables-employees/Courses';
import Educations from '../components/extra-tables-employees/Educations';
import Experiences from '../components/extra-tables-employees/Experiences';
import Informations from '../components/extra-tables-employees/Informations';
import Trainings from '../components/extra-tables-employees/Trainings';

const { formatDate, subtractFromDate } = date;
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
      formEmployee: false,
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
      formPerson: false,
      personData: {
        name: null,
        birthDate: formatDate(today, 'DD/MM/YYYY'), // poner que minimo hace 18 años
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
      bloodTypes: [],
      professions: [],
      withPersons: true,
      loading: false,
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
    async onSubmitEmployee() {
      this.loading = true;
      const send = JSON.parse(JSON.stringify(this.employeeData));
      send.militaryCard = this.militaryCard ? send.militaryCard : null;
      send.license = this.license ? send.license : null;
      try {
        const dataFormat = await employeeModel.getApiFormat(send);
        await this.$store.dispatch('employees/update', dataFormat);
        const msg = 'Se actualizo correctamente la información del empleado';
        this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        this.loading = false;
        this.formEmployee = false;
        // const menu = getMenu(this.user.type);
        // const firstOption = menu[0].options[0].link;
        // this.$router.replace(firstOption);
      } catch (e) {
        const msg = getError(e);
        this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
        this.loading = false;
      }
    },
    async onSubmitPerson() {
      this.loading = true;
      try {
        const dataFormat = await personModel.getApiFormat(this.personData);
        await this.$store.dispatch('persons/update', dataFormat);
        const msg = 'Se actualizo correctamente su información personal';
        this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        this.loading = false;
        if (this.personData.id === this.user.id) {
          const userUpdated = { ...this.user };
          userUpdated.name = this.personData.name;
          userUpdated.avatar = this.personData.photo ? this.personData.photo : this.user.avatar;
          this.$q.localStorage.set(LS_USER_INFO, userUpdated);
          this.formPerson = false;
          setTimeout(() => {
            this.$router.go();
          }, 400);
        } else {
          this.formPerson = false;
        }
      } catch (e) {
        const msg = getError(e);
        this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
        this.loading = false;
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
      }
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return { created: false, id: this.user.id };
    },
  },
  async created() {
    await Promise.all([
      this.userTypes = await this.$store.dispatch('ui/getUserTypes'),
      this.cities = await this.$store.dispatch('ui/getCities'),
      this.licenseCategories = await this.$store.dispatch('ui/getLicenseCategories'),
      this.languages = await this.$store.dispatch('ui/getLanguages'),
      this.bloodTypes = await this.$store.dispatch('ui/getBloodTypes'),
      this.professions = await this.$store.dispatch('ui/getProfessions'),
      this.ranks = await this.$store.dispatch('ranks/get'),
    ]);
    const idEmployee = this.action.id;
    const employee = await this.$store.dispatch('employees/getForIdWithPassword', idEmployee);
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
    this.personData = this.employeeData.person;
    this.loadingState = false;
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
};
</script>
