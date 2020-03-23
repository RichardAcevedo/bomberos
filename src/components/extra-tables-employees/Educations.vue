<template>
  <div>
    <div class="row q-mb-xs">
      <InteractionOptions
        v-if="!loading && educations && educations.length"
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
      v-else-if="educations && educations.length"
      :key="reRenderTable"
      :information="educations"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state small-section empty-educations"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterEducations">
      <q-card style="width: 400px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Educación</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <q-input
              filled
              :disable="gettingInfo"
              v-model="educationData.institution"
              class="ControlForm q-mb-xs"
              label="Institución"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese una institución',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <q-input
              filled
              :disable="gettingInfo"
              v-model="educationData.title"
              class="ControlForm q-mb-xs"
              label="Titulo obtenido"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese un titulo',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <div class="row">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="educationData.date"
                class="ControlForm col-6 q-mr-md"
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
                        v-model="educationData.date"
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
                :disable="gettingInfo"
                v-model="educationData.finish"
                class="ControlForm col"
                :options="['Si', 'No']"
                label="Terminado"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 ||
                'Por favor dinos si está terminado']"
              />
            </div>
            <SelectionInput
              :key="reloadCity"
              class="q-mb-lg"
              :disable="gettingInfo"
              v-model="educationData.city"
              :searchParent="educationData.city"
              :optionsMenu="cities"
              optionValue="id"
              optionLabel="name"
              :filled="true"
              label="Ciudad"
              :hint="educationData.city ? ''
                : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
              :rules="[ () => educationData.city || 'Por favor selecciona una ciudad']"
            />
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
import SelectionInput from '../selection-input/SelectionInput';
import { titles, staticColumns } from '../../data/titlesBanks/employeeEducations';
import educationModel from '../../commons/models/employeeEducation';
import NotificationMixin from '../../mixins/notifications';
import { getError } from '../../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Educations',
  data() {
    return {
      reloadCity: 0,
      alterEducations: false,
      educationData: {
        institution: null,
        title: null,
        date: formatDate(today, 'DD/MM/YYYY'),
        finish: 'Si',
        city: null,
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
    SelectionInput,
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
    cities: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    educations() {
      return this.$store.getters['employeeEducations/list'];
    },
    columns() {
      return getColumnsForTable(this.educations, titles, staticColumns);
    },
  },
  methods: {
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterEducations = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterEducations = true;
      this.gettingInfo = true;
      const education = await this.$store.dispatch('employeeEducations/getForId', this.selected[0].id);
      this.educationData = education;
      this.reloadCity += 1;
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      if (this.isCreate) {
        try {
          const dataFormat = await educationModel.getApiFormat(this.educationData);
          await this.$store.dispatch('employeeEducations/store', dataFormat);
          const msg = 'Registro exitoso';
          await this.$store.dispatch('employeeEducations/getForEmployee', this.idTarget);
          this.alterEducations = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await educationModel.getApiFormat(this.educationData);
          await this.$store.dispatch('employeeEducations/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          await this.$store.dispatch('employeeEducations/getForEmployee', this.idTarget);
          this.alterEducations = false;
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
          principal: item.title,
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
        this.$store.dispatch('employeeEducations/getForEmployee', this.idTarget);
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('employeeEducations/remove', infoDelete);
    },
    reset() {
      this.educationData = {
        institution: null,
        title: null,
        date: formatDate(today, 'DD/MM/YYYY'),
        finish: 'Si',
        city: null,
        idEmployee: this.idTarget,
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
  },
};
</script>
