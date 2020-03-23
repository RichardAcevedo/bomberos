<template>
  <div>
    <div class="row q-mb-xs">
      <InteractionOptions
        v-if="!loading && informations && informations.length"
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
      v-else-if="informations && informations.length"
      :key="reRenderTable"
      :information="informations"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state small-section empty-informations"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterInformations">
      <q-card style="width: 450px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Información Bomberil</div>
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
                v-model="informationData.institution"
                class="ControlForm col-7 q-mr-md"
                label="Insitución"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese una institución',
                  val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="informationData.dateIn"
                class="ControlForm col"
                label="Fecha de Inicio"
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
                        v-model="informationData.dateIn"
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
                v-model="informationData.position"
                class="ControlForm col-6 q-mr-md"
                label="Cargo"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Por favor ingrese un cargo',
                  val => val && val.length <= 100 || 'Longitud maxima de 100 carácteres' ]"
              />
              <q-input
                filled
                :disable="gettingInfo"
                v-model="informationData.resolution"
                class="ControlForm col"
                label="Resolución"
                stack-label
                lazy-rules
                :rules="[ val => val ? ( val.length <= 30 ? true :
                    'Longitud maxima de 30 carácteres' ) : true ]"
              />
            </div>
            <q-select
              filled
              :disable="gettingInfo"
              v-model="informationData.rank"
              class="ControlForm"
              label="Rango"
              :options="ranks"
              option-value="id"
              option-label="name"
              stack-label
              lazy-rules
              :rules="[]"
            />
            <div
              v-if="!isCreate && informationData.pathFile"
              class="q-mb-md"
            >
              <div class="row q-mb-xs subtitle">
                Descargar archivo actual:
              </div>
              <a
                :href="`${NATIVE_URL}/files/informaciones/${informationData.pathFile}`"
              >
                <q-btn
                  color="positive"
                  icon-right="cloud_download"
                  class="full-width"
                  align="between"
                >
                  <div class="ellipsis">
                    {{ informationData.pathFile.substr(12) }}
                  </div>
                </q-btn>
              </a>
            </div>
            <div
              v-if="!informationData.pathFile"
              class="row q-mb-xs subtitle"
            >
              Subir archivo de soporte:
            </div>
            <div
              v-if="informationData.pathFile"
              class="row q-mb-xs subtitle"
            >
              Cambiar archivo de soporte:
            </div>
            <div class="row q-mb-md">
              <q-uploader
                class="col"
                @added="handleFileUpload"
                hide-upload-btn
                accept=".pdf, .dot, .doc, .docx, .odt, .xls, .xlsx, .ods, .ppt, .pptx, image/*"
              />
            </div>
            <span class="q-ml-xs subtitle" v-if="!active">Inactivo:</span>
            <div class="row q-mt-xs" v-if="!active">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="informationData.dateOut"
                class="ControlForm col-5 q-mr-md"
                label="Fecha de baja"
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
                        v-model="informationData.dateOut"
                        mask="DD/MM/YYYY"
                        :options="maxDateIsToday"
                        @input="() => $refs.qDateProxy.hide()"
                      />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
import { titles, staticColumns } from '../../data/titlesBanks/employeeInformations';
import informationModel from '../../commons/models/employeeInformation';
import NotificationMixin from '../../mixins/notifications';
import { getError } from '../../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Informations',
  data() {
    return {
      alterInformations: false,
      active: false,
      informationData: {
        dateIn: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
        position: null,
        institution: null,
        resolution: null,
        rank: this.ranks.length > 0 ? this.ranks[0] : null,
        idEmployee: this.idTarget,
        pathFile: null,
        file: null,
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
    ranks: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    informations() {
      return this.$store.getters['employeeInformations/list'];
    },
    columns() {
      return getColumnsForTable(this.informations, titles, staticColumns);
    },
  },
  methods: {
    handleFileUpload(files) {
      const specific = files[0];
      this.informationData.file = specific;
    },
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterInformations = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterInformations = true;
      this.gettingInfo = true;
      const information = await this.$store.dispatch('employeeInformations/getForId', this.selected[0].id);
      this.active = !information.dateOut;
      this.informationData = information;
      this.informationData.dateOut = !this.active ? information.dateOut : formatDate(today, 'DD/MM/YYYY');
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      this.informationData.dateOut = !this.active ? this.informationData.dateOut : null;
      if (this.isCreate) {
        try {
          const dataFormat = await informationModel.getApiFormat(this.informationData);
          await this.$store.dispatch('employeeInformations/store', dataFormat);
          const msg = 'Registro exitoso';
          await this.$store.dispatch('employeeInformations/getForEmployee', this.idTarget);
          this.alterInformations = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await informationModel.getApiFormat(this.informationData);
          await this.$store.dispatch('employeeInformations/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          await this.$store.dispatch('employeeInformations/getForEmployee', this.idTarget);
          this.alterInformations = false;
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
          principal: item.position,
          caption: item.institution,
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
        this.$store.dispatch('employeeInformations/getForEmployee', this.idTarget);
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('employeeInformations/remove', infoDelete);
    },
    reset() {
      this.active = false;
      this.informationData = {
        dateIn: formatDate(today, 'DD/MM/YYYY'),
        dateOut: formatDate(today, 'DD/MM/YYYY'),
        position: null,
        institution: null,
        resolution: null,
        idEmployee: this.idTarget,
        rank: this.ranks.length > 0 ? this.ranks[0] : null,
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
