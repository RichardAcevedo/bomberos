<template>
  <div>
    <div class="row q-mb-xs">
      <InteractionOptions
        v-if="!loading && trainings && trainings.length"
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
      v-else-if="trainings && trainings.length"
      :key="reRenderTable"
      :information="trainings"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state small-section empty-trainings"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterTrainings">
      <q-card style="width: 480px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Capacitación</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="trainingData.event"
                class="ControlForm col-6 q-mr-md"
                label="Evento"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un evento' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="trainingData.date"
                class="ControlForm col"
                label="Fecha"
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
                        v-model="trainingData.date"
                        mask="DD/MM/YYYY"
                        :options="maxDateIsToday"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <q-input
              filled
              :disable="gettingInfo"
              v-model="trainingData.institution"
              class="ControlForm"
              label="Institución"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese una institución',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="trainingData.theoreticalHours"
                type="number"
                :min="0"
                class="ControlForm col q-mr-md"
                label="Horas teoricas"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese el numero de horas',
                  val => val && val >= 0 || 'Numero invalido' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="trainingData.practicalHours"
                type="number"
                :min="0"
                class="ControlForm col"
                label="Horas practicas"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese el numero de horas',
                  val => val && val >= 0 || 'Numero invalido']"
              />
            </div>
            <div
              v-if="!isCreate && trainingData.pathFile"
              class="q-mb-md"
            >
              <div class="row q-mb-xs subtitle">
                Descargar archivo actual:
              </div>
              <a
                :href="`${NATIVE_URL}/files/capacitaciones/${trainingData.pathFile}`"
              >
                <q-btn
                  color="positive"
                  icon-right="cloud_download"
                  class="full-width"
                  align="between"
                >
                  <div class="ellipsis">
                    {{ trainingData.pathFile.substr(12) }}
                  </div>
                </q-btn>
              </a>
            </div>
            <div
              v-if="!trainingData.pathFile"
              class="row q-mb-xs subtitle"
            >
              Subir archivo de soporte:
            </div>
            <div
              v-if="trainingData.pathFile"
              class="row q-mb-xs subtitle"
            >
              Cambiar archivo de soporte:
            </div>
            <div class="row">
              <q-uploader
                class="col"
                @added="handleFileUpload"
                hide-upload-btn
                accept=".pdf, .dot, .doc, .docx, .odt, .xls, .xlsx, .ods, .ppt, .pptx, image/*"
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
  NATIVE_URL,
} from '../../commons/constants';
import TableView from '../table-view/TableView';
import InteractionOptions from '../interaction-options/InteractionOptions';
import DeleteTemplate from '../delete-template/DeleteTemplate';
import { titles, staticColumns } from '../../data/titlesBanks/employeeTrainings';
import trainingModel from '../../commons/models/employeeTraining';
import NotificationMixin from '../../mixins/notifications';
import { getError } from '../../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Trainings',
  data() {
    return {
      alterTrainings: false,
      trainingData: {
        event: null,
        institution: null,
        theoreticalHours: 0,
        practicalHours: 0,
        date: formatDate(today, 'DD/MM/YYYY'),
        idEmployee: this.idTarget,
        file: null,
        pathFile: null,
      },
      selected: [],
      reRenderTable: 0,
      visibleColumns: staticColumns,
      loadingAlter: false,
      gettingInfo: false,
      isCreate: null,
      NATIVE_URL,
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
    trainings() {
      return this.$store.getters['employeeTrainings/list'];
    },
    columns() {
      return getColumnsForTable(this.trainings, titles, staticColumns);
    },
  },
  methods: {
    handleFileUpload(files) {
      const specific = files[0];
      this.trainingData.file = specific;
    },
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterTrainings = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterTrainings = true;
      this.gettingInfo = true;
      const training = await this.$store.dispatch('employeeTrainings/getForId', this.selected[0].id);
      this.trainingData = training;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await trainingModel.getApiFormat(this.trainingData);
          await this.$store.dispatch('employeeTrainings/store', dataFormat);
          const msg = 'Registro exitoso';
          await this.$store.dispatch('employeeTrainings/getForEmployee', this.idTarget);
          this.alterTrainings = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await trainingModel.getApiFormat(this.trainingData);
          await this.$store.dispatch('employeeTrainings/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          await this.$store.dispatch('employeeTrainings/getForEmployee', this.idTarget);
          this.alterTrainings = false;
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
          principal: item.event,
          caption: item.institution,
          side: item.date,
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
        this.$store.dispatch('employeeTrainings/getForEmployee', this.idTarget);
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('employeeTrainings/remove', infoDelete);
    },
    reset() {
      this.trainingData = {
        event: null,
        institution: null,
        theoreticalHours: 0,
        practicalHours: 0,
        date: formatDate(today, 'DD/MM/YYYY'),
        idEmployee: this.idTarget,
        file: null,
        pathFile: null,
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
  },
};
</script>
