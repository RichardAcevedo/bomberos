<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">REPORTES - MINUTAS</div>
    </div>
    <q-separator />
    <div v-if="loadingState">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <div
      v-else-if="issueTypes && issueTypes.length"
    >
      <div class="row q-mt-md">
        <q-select
          filled
          v-model="billReport.issueType"
          class="ControlForm col"
          label="Asunto:"
          :options="issueTypes"
          option-value="id"
          option-label="name"
          stack-label
          lazy-rules
          :rules="[]"
        />
      </div>
      <div
        v-if="billReport.issueType && (billReport.issueType.name === 'Entrada de personal'
          || billReport.issueType.name === 'Salida de personal'
          || billReport.issueType.name === 'Relevo')"
        class="row q-mt-md"
      >
        <q-select
          filled
          v-model="employee"
          class="ControlForm col"
          label="Empleado:"
          :options="employees"
          option-value="id"
          :option-label="(item) => item === null ? '' : `${item.person} - ${item.position}`"
          stack-label
          lazy-rules
          :rules="[]"
        />
      </div>
      <div
        v-if="billReport.issueType && (billReport.issueType.name === 'Entrada de máquina'
          || billReport.issueType.name === 'Salida de máquina'
          || billReport.issueType.name === 'Novedades en máquinas')"
        class="row q-mt-md"
      >
        <q-select
          filled
          v-model="vehicle"
          class="ControlForm col"
          label="Vehiculo:"
          :options="vehicles"
          option-value="id"
          option-label="name"
          stack-label
          lazy-rules
          :rules="[]"
        />
      </div>
      <div class="text-center">
        <q-btn
          :label="'GENERAR REPORTE '"
          :loading="loading"
          class="text-bold"
          @click="generateBillReport"
          color="positive"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-issueTypes"></div>
      <h3 class="empty-copy"> No hay asuntos registrados.. </h3>
    </div>
  </div>
</template>

<style lang="stylus">
</style>

<script>
import { date } from 'quasar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LS_USER_INFO, ERROR_NOTIFICATION, getPossibleRoutes } from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import billModel from '../commons/models/bill';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { formatDate } = date;

export default {
  name: 'BillReports',
  data() {
    return {
      loadingState: true,
      loading: false,
      billReport: {
        issueType: null,
      },
      employee: null,
      vehicle: null,
      issueTypes: null,
      employees: null,
      vehicles: null,
    };
  },
  mixins: [
    NotificationMixin,
  ],
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  methods: {
    async generateBillReport() {
      this.loading = true;
      let send = {};
      let isSpecific = false;
      let specificName = null;
      if (this.billReport.issueType.name === 'Entrada de personal'
        || this.billReport.issueType.name === 'Salida de personal'
        || this.billReport.issueType.name === 'Relevo') {
        send = {
          issueType: this.billReport.issueType,
          employee: this.employee,
        };
        isSpecific = true;
        specificName = send.employee.person;
        this.billReport.employee = { ...this.employee };
      } else if (this.billReport.issueType.name === 'Entrada de máquina'
          || this.billReport.issueType.name === 'Salida de máquina'
          || this.billReport.issueType.name === 'Novedades en máquinas') {
        send = {
          issueType: this.billReport.issueType,
          vehicle: this.vehicle,
        };
        isSpecific = true;
        specificName = send.vehicle.name;
      } else {
        send = { issueType: this.billReport.issueType };
        isSpecific = false;
      }
      const correctFormat = await billModel.getApiFormatForReport(send);
      const bills = await this.$store.dispatch('bills/getBillsReport', correctFormat);
      if (bills.length) {
        this.createPDF(bills, { type: send.issueType.name, name: specificName }, isSpecific);
      } else {
        const msg = 'No hay minutas con las especificaciones ingresadas';
        this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
      }
      this.loading = false;
    },
    async generateRowsEmergency(bills) {
      const widthsOfColumns = [60, 50, 'auto', 80, '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'EVENTO',
            },
            {
              bold: true,
              text: 'ESTADO',
            },
            {
              bold: true,
              text: 'TIPO',
            },
            {
              bold: true,
              text: 'REPORTA',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.event.name,
          item.attributes.state,
          item.attributes.report.type.name,
          item.attributes.report.name,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsPersonal(bills) {
      const widthsOfColumns = [60, 50, 'auto', 'auto', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'TIPO USUARIO',
            },
            {
              bold: true,
              text: 'NOMBRE',
            },
            {
              bold: true,
              text: 'CODIGO',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.employee.userType,
          item.attributes.employee.person,
          item.attributes.employee.code,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsMachines(bills) {
      const widthsOfColumns = [60, 50, '*', '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'TIPO VEHICULO',
            },
            {
              bold: true,
              text: 'TRIPULANTE',
            },
            {
              bold: true,
              text: 'REPORTA',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.vehicle.vehicleType,
          item.attributes.crewman.person,
          item.attributes.employee.person,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsVisitors(bills) {
      const widthsOfColumns = [60, 50, '*', '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'NOMBRE',
            },
            {
              bold: true,
              text: 'DOCUMENTO',
            },
            {
              bold: true,
              text: 'TELEFONO',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.name,
          item.attributes.document,
          item.attributes.phone,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsExtinguishers(bills) {
      const widthsOfColumns = [60, 50, '*', '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'TIPO EXTINTOR',
            },
            {
              bold: true,
              text: 'CAPACIDAD',
            },
            {
              bold: true,
              text: 'PROPIETARIO',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.extinguisherType.name,
          item.attributes.capacity,
          item.attributes.owner.name,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsReliefs(bills, info) {
      const widthsOfColumns = [60, 50, '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'ENTREGA',
            },
            {
              bold: true,
              text: 'RECIBE',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.employeeDelivery.person === info.name ? {
            color: '#C25B52',
            bold: true,
            text: item.attributes.employeeDelivery.person,
          } : item.attributes.employeeDelivery.person,
          item.attributes.employeeReceives.person === info.name ? {
            color: '#C25B52',
            bold: true,
            text: item.attributes.employeeReceives.person,
          } : item.attributes.employeeReceives.person,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsNovelty(bills) {
      const widthsOfColumns = [60, 50, '*', '*'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'NOVEDAD',
            },
            {
              bold: true,
              text: 'REPORTA',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.novelthyType.name,
          item.attributes.employeeReport.person,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async generateRowsNotes(bills) {
      const widthsOfColumns = [60, 50, '*', '*', 'auto'];
      const rows = bills.reduce((m, item, i) => {
        if (!i) {
          m.push([
            {
              bold: true,
              text: 'FECHA',
            },
            {
              bold: true,
              text: 'HORA',
            },
            {
              bold: true,
              text: 'PERSONA',
            },
            {
              bold: true,
              text: 'TELEFONO',
            },
            {
              bold: true,
              text: 'DESCRIPCIÓN',
            },
          ]);
        }
        m.push([
          item.date,
          item.hour,
          item.attributes.name,
          item.attributes.phone,
          item.description,
        ]);
        return m;
      }, []);
      return {
        widths: widthsOfColumns,
        body: rows,
      };
    },
    async createPDF(bills, info, isSpecific) {
      let data = [];
      if (info.type === 'Recepción de emergencia') {
        data = await this.generateRowsEmergency(bills);
      } else if (info.type === 'Entrada de personal' || info.type === 'Salida de personal') {
        data = await this.generateRowsPersonal(bills);
      } else if (info.type === 'Entrada de máquina' || info.type === 'Salida de máquina') {
        data = await this.generateRowsMachines(bills);
      } else if (info.type === 'Entrada visitante' || info.type === 'Salida visitante') {
        data = await this.generateRowsVisitors(bills);
      } else if (info.type === 'Entrada extintor(es)' || info.type === 'Salida extintor(es)') {
        data = await this.generateRowsExtinguishers(bills);
      } else if (info.type === 'Relevo') {
        data = await this.generateRowsReliefs(bills, info);
      } else if (info.type === 'Novedades en máquinas') {
        data = await this.generateRowsNovelty(bills);
      } else if (info.type === 'Nota') {
        data = await this.generateRowsNotes(bills);
      }
      const docDefinition = {
        info: {
          title: isSpecific ? `Reporte de Minutas (${info.type}) - ${info.name}` : `Reporte de Minutas (${info.type})`,
          author: `${this.user.name}`,
          subject: 'Generado desde la aplicacion de Bomberos Voluntarios Villa del Rosario',
          creator: 'Bomberos Voluntarios Villa del Rosario',
        },
        footer: (currentPage, pageCount) => ({
          columns: [
            {
              text: `${currentPage.toString()} de ${pageCount}`,
              alignment: 'right',
              fontSize: 10,
              margin: [25, 10],
              color: '#C25B52',
            },
          ],
        }),
        header: {
          columns: [
            {
              text: 'Bomberos Voluntarios de Villa del Rosario',
              alignment: 'left',
              fontSize: 10,
              margin: [25, 10],
              color: '#C25B52',
            },
            {
              text: `${formatDate(new Date(), 'DD/MM/YYYY hh:mm aa')}`,
              alignment: 'right',
              style: 'smallFont',
              margin: [25, 10],
              color: '#C25B52',
            },
          ],
        },
        content: [
          {
            text: `Reporte Minuta (${info.type})`.toUpperCase(),
            style: 'title',
            margin: [0, 10, 0, 0],
            color: isSpecific ? '' : '#C25B52',
          },
          isSpecific ? {
            text: `${info.name}`,
            style: 'subtitle',
          } : {},
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 5,
                x2: 480,
                y2: 5,
                lineWidth: 2,
                lineColor: '#C25B52',
              },
            ],
            alignment: 'center',
          },
          {
            style: 'tableExample',
            table: data,
          },
        ],
        styles: {
          title: {
            bold: true,
            fontSize: 15,
            alignment: 'center',
          },
          subtitle: {
            bold: true,
            fontSize: 13,
            alignment: 'center',
            color: '#C25B52',
          },
          imageProfile: {
            alignment: 'center',
          },
          smallFont: {
            fontSize: 10,
          },
          tableExample: {
            margin: [0, 15, 0, 15],
            alignment: 'center',
          },
        },
        defaultStyle: {
          columnGap: 40,
          fontSize: 11,
        },
      };
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.download(isSpecific ? `Reporte de Minutas (${info.type}) - ${info.name}` : `Reporte de Minutas (${info.type})`);
    },
  },
  async created() {
    await Promise.all([
      this.issueTypes = await this.$store.dispatch('issueTypes/get'),
      this.employees = await this.$store.dispatch('employees/get'),
      this.vehicles = await this.$store.dispatch('vehicles/get'),
    ]);
    this.billReport.issueType = this.issueTypes ? this.issueTypes[0] : null;
    this.employee = this.employees ? this.employees[0] : null;
    this.vehicle = this.vehicles ? this.vehicles[0] : null;
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
