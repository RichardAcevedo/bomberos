<template>
  <div>
    <div class="row q-mb-xs">
      <InteractionOptions
        v-if="!loading && experiences && experiences.length"
        :selected="selected"
        :createFunction="openCreateNew"
        :editFunction="openUpdate"
        :deleteFunction="openDelete"
      />
    </div>
    <q-spinner-dots
      v-if="loading"
      class="absolute-center text-default"
      size="3em"
    />
    <TableView
      v-else-if="experiences && experiences.length"
      :key="reRenderTable"
      :information="experiences"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state small-section empty-experiences"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterExperiences">
      <q-card style="width: 500px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Experiencia</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <q-toggle
              v-model="active"
              color="primary"
              class="q-mb-sm"
              label="Actualmente activo"
            />
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.company"
                class="ControlForm col-7 q-mr-md"
                label="Empresa"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingresa una empresa',
                    val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.dateIn"
                class="ControlForm col"
                label="Fecha de Ingreso"
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
                        v-model="experienceData.dateIn"
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
                :disable="gettingInfo"
                v-model="experienceData.position"
                class="ControlForm col-6 q-mr-md"
                label="Cargo"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un cargo',
                  val => val && val.length <= 40 || 'Longitud maxima de 40 carácteres' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.boss"
                class="ControlForm col"
                label="Jefe"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un nombre',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
            </div>
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.address"
                class="ControlForm col-7 q-mr-md"
                label="Dirección"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 50 ? true :
                    'Longitud maxima de 50 carácteres' ) : true ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.phone"
                class="ControlForm col"
                label="Telefono"
                :min="0"
                type="number"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un telefono',
                  val => val && val > 0 && val.length < 11 || 'Numero telefonico incorrecto']"
              />
            </div>
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.labors"
                class="ControlForm col-7 q-mr-md"
                label="Labores"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese a que se dedicó',
                  val => val && val.length <= 100 || 'Longitud maxima de 100 carácteres' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.check"
                class="ControlForm col"
                label="Verificación"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese una verificación']"
              />
            </div>
            <span class="q-ml-xs subtitle" v-if="!active">Datos de retiro:</span>
            <div class="row q-mt-xs" v-if="!active">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="experienceData.dateOut"
                class="ControlForm col q-mr-md"
                label="Fecha de retiro"
                readonly
                stack-label
                :rules="[ val => !active && val && val.length > 0
                  || 'Por favor ingresa una fecha']"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="experienceData.dateOut"
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
                :disable="gettingInfo"
                v-model="experienceData.reason"
                class="ControlForm col-7"
                label="Razón de retiro"
                stack-label
                :rules="[ val => !active && val && val.length > 0
                  || 'Por favor ingresa una razón']"
              />
            </div>
            <q-separator class="q-mb-sm"/>
            <div align="center">
              <q-btn
                color="negative"
                type="reset"
                flat
                label="Cancelar"
                v-close-popup
                :disable="loadingAlter"
              />
              <q-btn
                color="positive"
                type="submit"
                flat
                label="Guardar"
                :disable="gettingInfo"
                :loading="loadingAlter"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<style lang="stylus">
@import '../../css/app.styl';

</style>

<script>
import { date } from 'quasar';
import {
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  getColumnsForTable,
} from '../../commons/constants';
import TableView from '../table-view/TableView';
import InteractionOptions from '../interaction-options/InteractionOptions';
import DeleteTemplate from '../delete-template/DeleteTemplate';
import { titles, staticColumns } from '../../data/titlesBanks/employeeExperiences';
import experienceModel from '../../commons/models/employeeExperience';
import NotificationMixin from '../../mixins/notifications';
import { getError } from '../../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Experiences',
  data() {
    return {
      alterExperiences: false,
      active: false,
      experienceData: {
        company: null,
        position: null,
        address: null,
        phone: null,
        boss: null,
        labors: null,
        dateIn: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
        reason: null,
        check: null,
        idEmployee: this.idTarget,
      },
      selected: [],
      reRenderTable: 0,
      visibleColumns: staticColumns,
      loadingAlter: false,
      gettingInfo: false,
      isCreate: null,
    };
  },
  mixins: [
    NotificationMixin,
  ],
  components: {
    TableView,
    InteractionOptions,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    idTarget: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    experiences() {
      return this.$store.getters['employeeExperiences/list'];
    },
    columns() {
      return getColumnsForTable(this.experiences, titles, staticColumns);
    },
  },
  methods: {
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterExperiences = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterExperiences = true;
      this.gettingInfo = true;
      const experience = await this.$store.dispatch('employeeExperiences/getForId', this.selected[0].id);
      this.active = !experience.dateOut && !experience.reason;
      this.experienceData = experience;
      this.experienceData.dateOut = !this.active ? experience.dateOut : formatDate(today, 'DD/MM/YYYY');
      this.experienceData.reason = !this.active ? experience.reason : null;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      this.experienceData.dateOut = !this.active ? this.experienceData.dateOut : null;
      this.experienceData.reason = !this.active ? this.experienceData.reason : null;
      if (this.isCreate) {
        try {
          const dataFormat = await experienceModel.getApiFormat(this.experienceData);
          await this.$store.dispatch('employeeExperiences/store', dataFormat);
          const msg = 'Registro exitoso';
          await this.$store.dispatch('employeeExperiences/getForEmployee', this.idTarget);
          this.alterExperiences = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await experienceModel.getApiFormat(this.experienceData);
          await this.$store.dispatch('employeeExperiences/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          await this.$store.dispatch('employeeExperiences/getForEmployee', this.idTarget);
          this.alterExperiences = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      }
    },
    organizerDataDelete(info) {
      return info.reduce((m, item) => {
        m.push({
          principal: item.company,
          caption: item.position,
          side: item.dateIn,
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
        this.$store.dispatch('employeeExperiences/getForEmployee', this.idTarget);
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('employeeExperiences/remove', infoDelete);
    },
    reset() {
      this.active = false;
      this.experienceData = {
        company: null,
        position: null,
        address: null,
        phone: null,
        boss: null,
        labors: null,
        dateIn: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
        reason: null,
        check: null,
        idEmployee: this.idTarget,
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
  },
};
</script>
