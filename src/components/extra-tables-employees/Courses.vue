<template>
  <div>
    <div class="row q-mb-xs">
      <InteractionOptions
        v-if="!loading && courses && courses.length"
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
      v-else-if="courses && courses.length"
      :key="reRenderTable"
      :information="courses"
      :columns="columns"
      :visibleColumns="visibleColumns"
      @selection="selected = $event"
    />
    <div v-else class="text-center">
      <div class="empty-state small-section empty-courses"></div>
      <h3 class="empty-copy"> No hay registros aún.. </h3>
      <q-btn
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="PRIMER REGISTRO"
        @click="openCreateNew"
      />
    </div>
    <q-dialog v-model="alterCourses">
      <q-card style="width: 500px; max-width: 80vw">
        <q-spinner-tail
          v-if="gettingInfo"
          class="absolute-center text-default"
          size="3em"
        />
        <q-card-section>
          <div class="text-h6 text-bold">Curso Bomberil</div>
        </q-card-section>
        <q-card-section>
          <q-form
            @submit="alterRow"
            @reset="reset"
          >
            <q-input
              filled
              :disable="gettingInfo"
              v-model="courseData.course"
              class="ControlForm q-mb-xs"
              label="Curso"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese un nombre',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <q-input
              filled
              :disable="gettingInfo"
              v-model="courseData.date"
              class="ControlForm"
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
                      v-model="courseData.date"
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
              v-model="courseData.institution"
              class="ControlForm"
              label="Insitución"
              stack-label
              lazy-rules
              :rules="[ val => val && val.length > 0 || 'Por favor ingrese una institución',
                val => val && val.length <= 80 || 'Longitud maxima de 80 carácteres' ]"
            />
            <span class="q-ml-xs subtitle">Duracion:</span>
            <div class="row q-mt-xs">
              <q-input
                filled
                :disable="gettingInfo"
                v-model="quantityDuration"
                class="ControlForm col-3 q-mr-sm"
                label="Cantidad"
                :min="1"
                :max="12"
                type="number"
                stack-label
                lazy-rules
                :rules="[ val => val && val > 0 || 'Por favor ingrese una cantidad',
                  val => val && val > 0 || 'Numero invalido' ]"
              />
              <q-select
                filled
                :disable="gettingInfo"
                v-model="time"
                class="ControlForm col"
                :options="['Dia(s)', 'Semana(s)', 'Mes(es)', 'Año(s)']"
                label="Tiempo"
                stack-label
                lazy-rules
                :rules="[ val => val && val.length > 0 ||
                'Por favor selecciona un tiempo']"
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
import { titles, staticColumns } from '../../data/titlesBanks/employeeCourses';
import courseModel from '../../commons/models/employeeCourse';
import NotificationMixin from '../../mixins/notifications';
import { getError } from '../../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'Courses',
  data() {
    return {
      alterCourses: false,
      quantityDuration: 1,
      time: 'Mes(es)',
      courseData: {
        course: null,
        date: formatDate(today, 'DD/MM/YYYY'),
        duration: null,
        institution: null,
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
    courses() {
      return this.$store.getters['employeeCourses/list'];
    },
    columns() {
      return getColumnsForTable(this.courses, titles, staticColumns);
    },
  },
  methods: {
    openCreateNew() {
      this.isCreate = true;
      this.reset();
      this.alterCourses = true;
    },
    async openUpdate() {
      this.isCreate = false;
      this.reset();
      this.alterCourses = true;
      this.gettingInfo = true;
      const course = await this.$store.dispatch('employeeCourses/getForId', this.selected[0].id);
      this.courseData = course;
      const durationParts = course.duration.split(' ');
      this.quantityDuration = durationParts ? durationParts[0] : 1;
      this.time = durationParts ? durationParts[1] : 'Mes(es)';
      this.gettingInfo = false;
    },
    async alterRow() {
      this.loadingAlter = true;
      this.courseData.duration = `${this.quantityDuration} ${this.time}`;
      if (this.isCreate) {
        try {
          const dataFormat = await courseModel.getApiFormat(this.courseData);
          await this.$store.dispatch('employeeCourses/store', dataFormat);
          const msg = 'Registro exitoso';
          await this.$store.dispatch('employeeCourses/getForEmployee', this.idTarget);
          this.alterCourses = false;
          this.loadingAlter = false;
          this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
        } catch (e) {
          const msg = getError(e);
          this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
          this.loadingAlter = false;
        }
      } else {
        try {
          const dataFormat = await courseModel.getApiFormat(this.courseData);
          await this.$store.dispatch('employeeCourses/update', dataFormat);
          const msg = 'Actualizacion exitosa';
          await this.$store.dispatch('employeeCourses/getForEmployee', this.idTarget);
          this.alterCourses = false;
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
          principal: item.course,
          caption: item.institution,
          side: item.duration,
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
        this.$store.dispatch('employeeCourses/getForEmployee', this.idTarget);
      });
    },
    async deleteRows(infoDelete) {
      await this.$store.dispatch('employeeCourses/remove', infoDelete);
    },
    reset() {
      this.quantityDuration = 1;
      this.time = 'Mes(es)';
      this.courseData = {
        course: null,
        date: formatDate(today, 'DD/MM/YYYY'),
        duration: null,
        institution: null,
        idEmployee: this.idTarget,
      };
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
  },
};
</script>
