<template>
  <div class="q-py-lg q-px-xl bg-grey-2 background-height">
    <div class="row q-mb-xs">
      <div class="title">REPORTES - HOJAS DE VIDA</div>
    </div>
    <q-separator />
    <div v-if="!employees">
      <q-spinner-tail
        class="absolute-center text-default"
        size="5em"
      />
    </div>
    <div
      v-else-if="employees && employees.length"
    >
      <div class="row q-mt-md">
        <q-select
          filled
          v-model="curriculumReport.employee"
          class="ControlForm col"
          label="Empleado:"
          :options="employees"
          option-value="id"
          :option-label="(item) => item === null ? ''
            : `${item.person} - ${item.position} (${item.code})`"
          stack-label
          lazy-rules
          :rules="[]"
        />
      </div>
      <div class="text-center">
        <q-btn
          :label="'GENERAR HOJA DE VIDA'"
          :loading="loading"
          class="text-bold"
          @click="generateCurriculumReport"
          color="positive"
        />
      </div>
    </div>
    <div v-else class="text-center">
      <div class="empty-state normal-section empty-curriculums"></div>
      <h3 class="empty-copy"> No hay empleados registrados.. </h3>
    </div>
  </div>
</template>

<style lang="stylus">
</style>

<script>
import { date } from 'quasar';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LS_USER_INFO, getPossibleRoutes } from '../commons/constants';
import { dateToViewFormat } from '../utils/helpers';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { formatDate } = date;

export default {
  name: 'CurriculumReports',
  data() {
    return {
      loading: false,
      curriculumReport: {
        employee: null,
      },
      employees: null,
    };
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
  },
  methods: {
    async generateCurriculumReport() {
      this.loading = true;
      const curriculum = await this.$store.dispatch('employees/getCurriculumPersonal',
        this.curriculumReport.employee.id);
      this.createPDF(curriculum);
      this.loading = false;
    },
    async generateLanguages(languages) {
      return languages.reduce((m, item, i) => {
        if (i === 0) m += `${item.nombre}`;
        else m += `, ${item.nombre}`;
        return m;
      }, []);
    },
    async generateStudies(studies) {
      return studies.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Institución: ', color: '#C25B52', bold: true },
            { text: `${item.institucion}\n` },
            { text: 'Titulo obtenido: ', bold: true },
            { text: `${item.titulo_obtenido}\n` },
            { text: 'Fecha de realización: ', bold: true },
            { text: `${dateToViewFormat(item.fecha)}\n` },
            { text: 'Lugar de realización: ', bold: true },
            { text: `${item.ciudad}, ${item.departamento}\n` },
            { text: 'Actualmente: ', bold: true },
            item.terminado ? { text: 'Terminado\n' } : { text: 'En curso\n' },
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateCourses(courses) {
      return courses.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Nombre: ', color: '#C25B52', bold: true },
            { text: `${item.curso}\n` },
            { text: 'Institución: ', bold: true },
            { text: `${item.institucion}\n` },
            { text: 'Fecha de realización: ', bold: true },
            { text: `${dateToViewFormat(item.fecha)}\n` },
            { text: 'Duración: ', bold: true },
            { text: `${item.duracion}\n` },
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateExperiences(experiences) {
      return experiences.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Empresa: ', color: '#C25B52', bold: true },
            { text: `${item.empresa}\n` },
            { text: 'Cargo: ', bold: true },
            { text: `${item.cargo}\n` },
            { text: 'Duración: ', bold: true },
            item.fecha_retiro ? { text: `${dateToViewFormat(item.fecha_ingreso)} - ${dateToViewFormat(item.fecha_retiro)}\n` } : { text: `${dateToViewFormat(item.fecha_ingreso)} - Actualidad\n` },
            item.direccion ? { text: 'Dirección: ', bold: true } : {},
            item.direccion ? { text: `${item.direccion}\n` } : {},
            { text: 'Telefono: ', bold: true },
            { text: `${item.telefono}\n` },
            item.labores ? { text: 'Labores: ', bold: true } : {},
            item.labores ? { text: `${item.labores}\n` } : {},
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateInformations(informations) {
      return informations.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Institución: ', color: '#C25B52', bold: true },
            { text: `${item.institucion}\n` },
            { text: 'Cargo: ', bold: true },
            { text: `${item.cargo}\n` },
            { text: 'Duración: ', bold: true },
            item.fecha_baja ? { text: `${dateToViewFormat(item.fecha_inicio)} - ${dateToViewFormat(item.fecha_baja)}\n` } : { text: `${dateToViewFormat(item.fecha_inicio)} - Actualidad\n` },
            { text: 'Rango: ', bold: true },
            { text: `${item.rango}\n` },
            item.resolucion ? { text: 'Resolución: ', bold: true } : {},
            item.resolucion ? { text: `${item.resolucion}\n` } : {},
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generatePromotions(promotions) {
      return promotions.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Rango: ', color: '#C25B52', bold: true },
            { text: `${item.rango}\n` },
            { text: 'Acta: ', bold: true },
            { text: `${item.codigo_acta}, ` },
            { text: 'fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha_acta)}\n` },
            { text: 'Resolución: ', bold: true },
            { text: `${item.codigo_resolucion}, ` },
            { text: 'fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha_resolucion)}\n` },
            { text: 'Estado: ', bold: true },
            item.activo === 'Si' ? { text: 'Activo\n' } : { text: `Inactivo(${dateToViewFormat(item.fecha_desactivacion)})\n` },
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateTrainings(trainings) {
      return trainings.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Institución: ', color: '#C25B52', bold: true },
            { text: `${item.institucion}\n` },
            item.evento ? { text: 'Evento: ', bold: true } : {},
            item.evento ? { text: `${item.evento}\n` } : {},
            item.hora_practica ? { text: 'Horas prácticas: ', bold: true } : {},
            item.hora_practica ? { text: `${item.hora_practica}\n` } : {},
            item.hora_teorica ? { text: 'Horas teoricas: ', bold: true } : {},
            item.hora_teorica ? { text: `${item.hora_teorica}\n` } : {},
            { text: 'Fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha)}\n` },
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateAwards(awards) {
      return awards.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Tipo de condecoración: ', color: '#C25B52', bold: true },
            { text: `${item.tipo_condecoracion}\n` },
            { text: 'Acta: ', bold: true },
            { text: `${item.codigo_acta}, ` },
            { text: 'fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha_acta)}\n` },
            { text: 'Resolución: ', bold: true },
            { text: `${item.codigo_resolucion}, ` },
            { text: 'fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha_resolucion)}\n` },
            item.descripcion ? { text: 'Descripción', bold: true } : {},
            item.descripcion ? { text: `${item.descripcion}\n` } : {},
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateAppointments(appointments) {
      return appointments.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Cargo: ', color: '#C25B52', bold: true },
            { text: `${item.cargo}\n` },
            { text: 'Fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha)}\n` },
            { text: 'Articulo: ', bold: true },
            { text: `${item.articulo}\n` },
            { text: 'Orden: ', bold: true },
            { text: `${item.orden}\n` },
            item.descripcion ? { text: 'Descripción: ', bold: true } : {},
            item.descripcion ? { text: `${item.descripcion}\n` } : {},
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async generateSanctions(sanctions) {
      return sanctions.reduce((m, item) => {
        m.push({
          text: [
            { text: 'Tipo de sanción: ', color: '#C25B52', bold: true },
            { text: `${item.tipo_sancion}\n` },
            { text: 'Fecha: ', bold: true },
            { text: `${dateToViewFormat(item.fecha)}\n` },
            { text: 'Orden: ', bold: true },
            { text: `${item.orden}\n` },
            item.descripcion ? { text: 'Descripción: ', bold: true } : {},
            item.descripcion ? { text: `${item.descripcion}\n` } : {},
            { text: '\n', style: 'smallFont' },
          ],
        });
        return m;
      }, []);
    },
    async createPDF(empleado) {
      const linea = {
        type: 'line',
        x1: 0,
        y1: 5,
        x2: 480,
        y2: 5,
        lineWidth: 2,
        lineColor: '#C25B52',
      };
      const idiomas = await this.generateLanguages(empleado.idiomas);
      const estudios = await this.generateStudies(empleado.educaciones);
      const experiencias = await this.generateExperiences(empleado.experiencias);
      const cursos = await this.generateCourses(empleado.cursos);
      const informaciones = await this.generateInformations(empleado.informaciones);
      const ascensos = await this.generatePromotions(empleado.ascensos);
      const capacitaciones = await this.generateTrainings(empleado.capacitaciones);
      const condecoraciones = await this.generateAwards(empleado.condecoraciones);
      const nombramientos = await this.generateAppointments(empleado.nombramientos);
      const sanciones = await this.generateSanctions(empleado.sanciones);
      const docDefinition = {
        info: {
          title: `Hoja de vida de ${empleado.persona.nombre}`,
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
          empleado.persona.fotografia ? {
            image: empleado.persona.fotografia,
            style: 'imageProfile',
            width: 150,
            // height: 150,
          } : {},
          {
            text: (empleado.persona.nombre).toUpperCase(),
            style: 'title',
            margin: [0, 10, 0, 0],
          },
          {
            text: empleado.tipo_usuario.nombre,
            style: 'subtitle',
          },
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
            margin: [0, 10, 0, 0],
            alignment: 'justify',
            columns: [
              {
                text: [
                  {
                    text: 'DATOS PERSONALES\n',
                    bold: true,
                    color: '#C25B52',
                  },
                  {
                    text: [
                      { text: 'Cedula: ', bold: true },
                      { text: `${empleado.persona.documento}\n` },
                      { text: 'Tipo de Sangre: ', bold: true },
                      { text: `${empleado.persona.tipo_sangre.nombre}\n` },
                      { text: 'Correo: ', bold: true },
                      { text: `${empleado.persona.email}\n` },
                      { text: 'Fecha de nacimiento: ', bold: true },
                      { text: `${dateToViewFormat(empleado.persona.fecha_nacimiento)}\n` },
                      empleado.persona.direccion ? { text: 'Dirección: ', bold: true } : {},
                      empleado.persona.direccion ? { text: `${empleado.persona.direccion}\n` } : {},
                      empleado.persona.barrio ? { text: 'Barrio: ', bold: true } : {},
                      empleado.persona.barrio ? { text: `${empleado.persona.barrio}\n` } : {},
                      { text: 'Nacimiento: ', bold: true },
                      { text: `${empleado.persona.ciudad_nacimiento.nombre}, ${empleado.persona.ciudad_nacimiento.departamento.nombre}\n` },
                      { text: 'Sexo: ', bold: true },
                      empleado.persona.sexo === 'M' ? { text: 'Masculino\n' } : { text: 'Femenino\n' },
                      { text: 'Estado civil: ', bold: true },
                      { text: `${empleado.persona.estado_civil}\n` },
                    ],
                  },
                ],
                alignment: 'right',
                margin: [0, 0, 0, 5],
              },
              {
                text: [
                  {
                    text: 'INFORMACION LABORAL\n',
                    bold: true,
                    color: '#C25B52',
                  },
                  {
                    text: [
                      { text: 'Código: ', bold: true },
                      { text: `${empleado.codigo}\n` },
                      { text: 'Fecha ingreso: ', bold: true },
                      { text: `${dateToViewFormat(empleado.fecha_ingreso)}\n` },
                      { text: 'Estadia: ', bold: true },
                      { text: `${empleado.ciudad.nombre}, ${empleado.ciudad.departamento.nombre}\n` },
                      { text: 'Profesión: ', bold: true },
                      { text: `${empleado.persona.profesion.nombre}\n` },
                      { text: 'Celular de contacto: ', bold: true },
                      { text: `${empleado.persona.celular}\n` },
                      { text: 'Idiomas: ', bold: true },
                      { text: `${idiomas}.\n` },
                    ],
                    alignment: 'left',
                  },
                ],
              },
            ],
          },
          estudios.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          estudios.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'ESTUDIOS\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: estudios },
            ],
          } : {},
          experiencias.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          experiencias.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'EXPERIENCIA LABORAL\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: experiencias },
            ],
          } : {},
          cursos.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          cursos.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'CURSOS BOMBERILES\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: cursos },
            ],
          } : {},
          informaciones.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          informaciones.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'INFORMACION BOMBERIL\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: informaciones },
            ],
          } : {},
          ascensos.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          ascensos.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'ASCENSOS\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: ascensos },
            ],
          } : {},
          capacitaciones.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          capacitaciones.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'CAPACITACIONES\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: capacitaciones },
            ],
          } : {},
          condecoraciones.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          condecoraciones.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'CONDECORACIONES\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: condecoraciones },
            ],
          } : {},
          nombramientos.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          nombramientos.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'NOMBRAMIENTOS\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: nombramientos },
            ],
          } : {},
          sanciones.length > 0 ? { canvas: [{ ...linea }], alignment: 'center' } : {},
          sanciones.length > 0 ? {
            margin: [30, 8, 0, 0],
            text: [
              {
                text: 'SANCIONES\n',
                bold: true,
                color: '#C25B52',
                alignment: 'center',
              },
              { text: sanciones },
            ],
          } : {},
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
        },
        defaultStyle: {
          columnGap: 40,
          fontSize: 11,
        },
      };
      const pdf = pdfMake.createPdf(docDefinition);
      pdf.download(`Hoja de vida de ${empleado.persona.nombre}`);
    },
  },
  async created() {
    this.employees = await this.$store.dispatch('employees/get');
    this.curriculumReport.employee = this.employees ? this.employees[0] : null;
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
