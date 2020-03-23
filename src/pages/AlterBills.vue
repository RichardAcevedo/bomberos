<template>
  <div class="q-pa-md q-gutter-sm bg-grey-2 background-height relative-position">
    <q-breadcrumbs>
      <q-breadcrumbs-el
        label="Minutas"
        icon="assignment"
        :to="ROUTES.bills.bills"
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
      v-else-if="withIssueTypes && withEmployees"
    >
      <q-expansion-item
        expand-separator
        icon="account_circle"
        label="Datos"
        :default-opened="true"
        :caption="!action.created ? billData.employee : null"
      >
        <q-card>
          <q-card-section>
            <q-form
              @submit="onSubmit"
            >
              <div v-if="!action.created" class="q-mb-xs text-center text-bold q-py-xs note">
                Solo esta permitido modificar la descripción, si crees que es necesario
                puedes crear una nueva nota.
              </div>
              <div class="row q-mb-xs text-bold">
                Información principal:
              </div>
              <div class="row">
              <q-select
                filled
                v-model="billData.userSession"
                class="ControlForm col q-mr-md"
                label="Usuario en sesión"
                :options="employees"
                readonly
                option-value="id"
                option-label="person"
                stack-label
                lazy-rules
                :rules="[]"
              />
              <q-input
                filled
                v-model="billData.date"
                disable
                class="ControlForm col-2 q-mr-md"
                label="Fecha"
                stack-label
                readonly
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa una fecha' ]"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="billData.date"
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
                v-model="billData.hour"
                mask="time"
                disable
                class="ControlForm col-2 q-mr-md"
                label="Hora"
                stack-label
                readonly
                :rules="[ val => val && val.length > 0  || 'Por favor ingresa una hora' ]"
              >
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="billData.hour" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
              <q-select
                filled
                class="ControlForm col-3"
                :readonly="!action.created"
                v-model="billData.issueType"
                label="Asunto"
                :options="issueTypes"
                option-value="id"
                option-label="name"
                stack-label
                lazy-rules
                :rules="[]"
              />
              <!-- <SelectionInput
                class="col-3"
                :readonly="!action.created"
                v-model="billData.issueType"
                :searchParent="billData.issueType"
                :optionsMenu="issueTypes"
                optionValue="id"
                optionLabel="name"
                :filled="true"
                label="Asunto"
                :hint="billData.issueType ? ''
                  : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
                :rules="[ () => billData.issueType || 'Por favor selecciona un asunto']"
              /> -->
              </div>
              <div class="row">
                <q-input
                  filled
                  autogrow
                  v-model="billData.description"
                  class="ControlForm col-5"
                  label="Descripción"
                  stack-label
                  lazy-rules
                  :rules="[]"
                />
              </div>
              <div v-if="billData.issueType
                && billData.issueType.name === 'Recepción de emergencia'">
                <div class="row q-mb-xs text-bold">
                  Información Emergencia:
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="emergency.state"
                    class="ControlForm col-3 q-mr-md"
                    :options="['En seguimiento', 'Terminada', 'Falsa alarma']"
                    label="Estado"
                    stack-label
                    lazy-rules
                    :rules="[ val => val && val.length > 0 ||
                    'Por favor selecciona un estado']"
                  />
                  <SelectionInput
                    class="col q-mr-md"
                    v-model="emergency.event"
                    :readonly="!action.created"
                    :searchParent="emergency.event"
                    :optionsMenu="events"
                    optionValue="id"
                    optionLabel="name"
                    :filled="true"
                    label="Evento"
                    :hint="emergency.event ? ''
                      : 'Escribe por lo menos dos letras, ten en cuenta las tildes.'"
                    :rules="[ () => emergency.event || 'Por favor selecciona un evento']"
                  />
                </div>
                <div class="row">
                  <q-input
                    filled
                    v-model="emergency.address"
                    :readonly="!action.created"
                    class="ControlForm col-4 q-mr-md"
                    label="Dirección"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Recepción de emergencia'
                      ? ( val && val.length > 0 ? true : 'Por favor ingrese una dirección' )
                        : true ]"
                  />
                  <q-input
                    filled
                    v-model="emergency.neighborhood"
                    :readonly="!action.created"
                    class="ControlForm col-4 q-mr-md"
                    label="Barrio"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Recepción de emergencia'
                      ? ( val && val.length > 0 ? true : 'Por favor ingrese un barrio' )
                        : true ]"
                  />
                </div>
                <div class="row q-mb-xs text-bold">
                  Quien que reporta:
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="emergency.report.type"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Tipo"
                    :options="reportTypes"
                    option-value="id"
                    option-label="name"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
                <div class="row">
                  <q-input
                    filled
                    v-model="emergency.report.name"
                    :readonly="!action.created"
                    class="ControlForm col-4 q-mr-md"
                    label="Nombre"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Recepción de emergencia'
                      ? ( val && val.length > 0 ? true : 'Por favor ingrese un nombre' )
                        : true ]"
                  />
                  <q-input
                    filled
                    v-model="emergency.report.document"
                    :readonly="!action.created"
                    class="ControlForm col-3 q-mr-md"
                    type="number"
                    :min="0"
                    label="Documento"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Recepción de emergencia'
                      ? ( val && val.length > 0 ? ( val && val > 0 && val.length <= 10 ? true
                        : 'Numero Invalido' ) : 'Por favor ingrese un documento' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="emergency.report.phone"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Telefono"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Recepción de emergencia'
                      ? ( val && val.length > 0 ? ( val && val > 0 && val.length <= 10 ? true
                        : 'Numero Invalido' ) : 'Por favor ingrese un telefono' ) : true ]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType
                && billData.issueType.name === 'Entrada de personal' ||
                billData.issueType && billData.issueType.name === 'Salida de personal'">
                <div class="row q-mb-xs text-bold">
                  Información entrada/salida del personal:
                </div>
                  <q-select
                    filled
                    v-model="personal.employee"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Empleado"
                    :options="employees"
                    option-value="id"
                    :option-label="(item) => item === null ? ''
                      : `${item.person} - ${item.code}`"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Entrada visitante' ||
                billData.issueType && billData.issueType.name === 'Salida visitante'">
                <div class="row q-mb-xs text-bold">
                  Información entrada/salida de visitante:
                </div>
                <div class="row">
                  <q-input
                    filled
                    v-model="visitor.name"
                    :readonly="!action.created"
                    class="ControlForm col-5 q-mr-md"
                    label="Nombre"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada visitante' ||
                      billData.issueType.name === 'Salida visitante' ? ( val && val.length > 0
                        ? true : 'Por favor ingrese un nombre' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="visitor.document"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Documento"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada visitante' ||
                      billData.issueType.name === 'Salida visitante' ? ( val && val.length > 0
                      ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                        : 'Por favor ingrese un documento' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="visitor.phone"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Telefono"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada visitante' ||
                      billData.issueType.name === 'Salida visitante' ? ( val && val.length > 0
                      ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                        : 'Por favor ingrese un telefono' ) : true ]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Entrada de máquina' ||
                billData.issueType && billData.issueType.name === 'Salida de máquina'">
                <div class="row q-mb-xs text-bold">
                  Información entrada/salida de máquina:
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="machine.employee"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Empleado que reporta"
                    :options="employees"
                    option-value="id"
                    :option-label="(item) => item === null ? ''
                      : `${item.person} - ${item.position}`"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-select
                    filled
                    v-model="machine.vehicle"
                    :readonly="!action.created"
                    class="ControlForm col-2 q-mr-md"
                    label="Vehiculo"
                    :options="vehicles"
                    option-value="id"
                    option-label="name"
                    stack-label
                    lazy-rules
                    @input="updateElements"
                    :rules="[]"
                  />
                  <q-select
                    filled
                    v-model="machine.crewmans"
                    :readonly="!action.created"
                    use-chips
                    multiple
                    class="ControlForm col"
                    label="Tripulantes"
                    :options="employees"
                    option-value="id"
                    option-label="person"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
                <div class="row">
                  <q-select
                    v-model="machine.newElements"
                    :readonly="!action.created"
                    class="ControlForm col"
                    filled
                    use-chips
                    multiple
                    :loading="loadChangeVehicle"
                    :options="elements"
                    option-value="id"
                    :option-label="(item) => item === null ? ''
                    : `${item.name} - ${item.inventoryCode}`"
                    label="Elementos"
                    stack-label
                    lazy-rules
                    :hint="elements && elements.length ?
                    'Selecciona los elementos que poseera el vehiculo'
                      : 'No hay elementos disponibles'"
                    :rules="[]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Entrada extintor(es)' ||
                billData.issueType && billData.issueType.name === 'Salida extintor(es)'">
                <div class="row q-mb-xs text-bold">
                  Información entrada/salida de Extintor(es):
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="extinguisher.extinguisherType"
                    :readonly="!action.created"
                    class="ControlForm col-3 q-mr-md"
                    label="Tipo"
                    :options="extinguisherTypes"
                    option-value="id"
                    option-label="name"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-input
                    filled
                    v-model="extinguisher.capacity"
                    :readonly="!action.created"
                    class="ControlForm col-3"
                    label="Capacidad"
                    mask="# lb"
                    fill-mask="0"
                    reverse-fill-mask
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada extintor(es)' ||
                      billData.issueType.name === 'Salida extintor(es)' ? ( val && val.length > 0
                      ? ( val && val.length <= 20 ? true : 'Longitud maxima de 20 carácteres' )
                        : 'Por favor ingrese una capacidad' ) : true ]"
                  />
                </div>
                <div class="row q-mb-xs text-bold">
                  Propietario:
                </div>
                <div class="row">
                  <q-input
                    filled
                    v-model="extinguisher.owner.name"
                    :readonly="!action.created"
                    class="ControlForm col-5 q-mr-md"
                    label="Nombre"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada extintor(es)' ||
                      billData.issueType.name === 'Salida extintor(es)' ? ( val && val.length > 0
                        ? true : 'Por favor ingrese un nombre' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="extinguisher.owner.document"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Documento"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada extintor(es)' ||
                      billData.issueType.name === 'Salida extintor(es)' ? ( val && val.length > 0
                        ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                          : 'Por favor ingrese un documento' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="extinguisher.owner.phone"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Telefono"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Entrada extintor(es)' ||
                      billData.issueType.name === 'Salida extintor(es)' ? ( val && val.length > 0
                        ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                          : 'Por favor ingrese un telefono' ) : true ]"
                  />
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="extinguisher.reason"
                    :readonly="!action.created"
                    class="ControlForm col-3 q-mr-md"
                    :options="['Nota de servicio', 'Prestamo']"
                    label="Razon"
                    stack-label
                    lazy-rules
                    :rules="[ val => val && val.length > 0 ||
                    'Por favor selecciona una razon']"
                  />
                  <q-input
                    filled
                    autogrow
                    v-model="extinguisher.descriptionReason"
                    :readonly="!action.created"
                    class="ControlForm col-5"
                    :label="extinguisher.reason"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Relevo'">
                <div class="row q-mb-xs text-bold">
                  Información Relevo
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="relief.employeeDelivery"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Entrega"
                    :options="employees"
                    option-value="id"
                    option-label="person"
                    stack-label
                    lazy-rules
                    :rules="[ val => val && val.id
                      || 'Es necesario especificar el empleado que entrega el turno']"
                  />
                  <q-select
                    filled
                    v-model="relief.employeeReceives"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Recibe"
                    :options="employees"
                    option-value="id"
                    option-label="person"
                    stack-label
                    lazy-rules
                    :rules="[ val => val && val.id
                      || 'Es necesario especificar el empleado que recibe el turno']"
                  />
                </div>
                <div class="row">
                  <q-input
                    filled
                    autogrow
                    v-model="relief.tasksExecuted"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Tareas ejecutadas"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-input
                    filled
                    autogrow
                    v-model="relief.slogans"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Consignas"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-input
                    filled
                    autogrow
                    v-model="relief.news"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Novedades"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Novedades en máquinas'">
                <div class="row q-mb-xs text-bold">
                  Información Novedades de máquinas
                </div>
                <div class="row">
                  <q-select
                    filled
                    v-model="noveltyMachine.employeeReport"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Empleado que reporta"
                    :options="employees"
                    option-value="id"
                    :option-label="(item) => item === null ? ''
                      : `${item.person} - ${item.position}`"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-select
                    filled
                    v-model="noveltyMachine.vehicle"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Vehiculo"
                    :options="vehicles"
                    option-value="id"
                    option-label="name"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                  <q-select
                    filled
                    v-model="noveltyMachine.novelthyType"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Tipo de novedad"
                    :options="novelthyTypes"
                    option-value="id"
                    option-label="name"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
                <div class="row">
                  <q-input
                    filled
                    autogrow
                    v-model="noveltyMachine.novelthyDescription"
                    :readonly="!action.created"
                    class="ControlForm col-5"
                    label="Descripción de novedad"
                    stack-label
                    lazy-rules
                    :rules="[]"
                  />
                </div>
              </div>
              <div v-if="billData.issueType && billData.issueType.name === 'Nota'">
                <div class="row q-mb-xs text-bold">
                  Información de la Nota:
                </div>
                <div class="row">
                  <q-input
                    filled
                    v-model="notes.name"
                    :readonly="!action.created"
                    class="ControlForm col-5 q-mr-md"
                    label="Nombre"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Nota' ? ( val && val.length > 0
                        ? true : 'Por favor ingrese un nombre' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="notes.document"
                    :readonly="!action.created"
                    class="ControlForm col q-mr-md"
                    label="Documento"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Nota' ? ( val && val.length > 0
                      ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                        : 'Por favor ingrese un documento' ) : true ]"
                  />
                  <q-input
                    filled
                    v-model="notes.phone"
                    :readonly="!action.created"
                    class="ControlForm col"
                    label="Telefono"
                    type="number"
                    :min="0"
                    stack-label
                    lazy-rules
                    :rules="[ val => billData.issueType.name === 'Nota' ? ( val && val.length > 0
                      ? ( val && val > 0 && val.length <= 10 ? true : 'Numero Invalido' )
                        : 'Por favor ingrese un telefono' ) : true ]"
                  />
                </div>
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
    <div v-else-if="!withIssueTypes" class="text-center">
      <div class="empty-state normal-section empty-issueTypes"></div>
      <h4 class="empty-copy"> No hay asuntos disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'minuta'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR ASUNTOS"
        :to="ROUTES.bills.issueTypes"
      />
    </div>
    <div v-else-if="!withEmployees" class="text-center">
      <div class="empty-state normal-section empty-curriculum"></div>
      <h4 class="empty-copy"> No hay empleados disponibles </h4>
      <q-btn
        v-if="user.type !== 'supervisor' && (user.type === 'personal'
          || user.type === 'administrador-general')"
        color="positive"
        style="height:min-content"
        class="text-capitalize"
        label="LISTAR HOJAS DE VIDA"
        :to="ROUTES.personal.curriculum"
      />
    </div>
  </div>
</template>

<style lang="stylus">
@import '../css/app.styl';

.q-field--filled.q-field--readonly .q-field__control:before {
  border-bottom-style: hidden;
}

.note {
  border-radius: 20px;
  background: $primary;
  color: white;
}
</style>

<script>
import { date } from 'quasar';
import {
  ROUTES,
  ERROR_NOTIFICATION,
  SUCCESS_NOTIFICATION,
  LS_CREATING_BILLS,
  LS_USER_INFO,
  getPossibleRoutes,
} from '../commons/constants';
import NotificationMixin from '../mixins/notifications';
import billModel from '../commons/models/bill';
import SelectionInput from '../components/selection-input/SelectionInput';
import { getError } from '../utils/helpers';

const { formatDate } = date;
const today = Date.now();

export default {
  name: 'AlterBills',
  components: {
    SelectionInput,
  },
  mixins: [
    NotificationMixin,
  ],
  data() {
    return {
      loadingState: true,
      billData: {
        date: formatDate(today, 'DD/MM/YYYY'),
        hour: formatDate(Date.now(), 'HH:mm'),
        description: null,
        userSession: null,
        issueType: null,
        attributes: null,
      },
      emergency: {
        event: null,
        state: 'En seguimiento',
        address: null,
        neighborhood: null,
        report: {
          name: null,
          document: null,
          phone: null,
          type: null,
        },
      },
      personal: {
        employee: null,
      },
      visitor: {
        name: null,
        document: null,
        phone: null,
      },
      machine: {
        employee: null,
        vehicle: null,
        crewmans: [],
        newElements: null,
      },
      extinguisher: {
        extinguisherType: null,
        capacity: null,
        owner: {
          name: null,
          document: null,
          phone: null,
        },
        reason: 'Nota de servicio',
        descriptionReason: null,
      },
      relief: {
        employeeDelivery: null,
        tasksExecuted: null,
        employeeReceives: null,
        slogans: null,
        news: null,
      },
      noveltyMachine: {
        employeeReport: null,
        vehicle: null,
        novelthyType: null,
        novelthyDescription: null,
      },
      notes: {
        name: null,
        document: null,
        phone: null,
      },
      elements: [],
      employee: null,
      loading: false,
      today,
      ROUTES,
      withIssueTypes: true,
      withEmployees: true,
      issueTypes: [],
      employees: [],
      events: [],
      loadChangeVehicle: false,
      vehicles: [],
      extinguisherTypes: [],
      novelthyTypes: [],
    };
  },
  methods: {
    async onSubmit() {
      if (this.billData.issueType.name === 'Relevo'
      && (this.relief.employeeDelivery.id === this.relief.employeeReceives.id)) {
        const msgError = 'No es posible seleccionar al mismo empleado';
        this.createNotification({ message: msgError, timeout: 3000, ...ERROR_NOTIFICATION });
      } else {
        this.loading = true;
        let send = {};
        if (this.billData.issueType.name === 'Recepción de emergencia') {
          send = { ...this.billData, attributes: this.emergency };
        } else if (this.billData.issueType.name === 'Entrada de personal'
          || this.billData.issueType.name === 'Salida de personal') {
          send = { ...this.billData, attributes: this.personal };
        } else if (this.billData.issueType.name === 'Entrada visitante'
          || this.billData.issueType.name === 'Salida visitante') {
          send = { ...this.billData, attributes: this.visitor };
        } else if (this.billData.issueType.name === 'Entrada de máquina'
          || this.billData.issueType.name === 'Salida de máquina') {
          // this.machine.vehicle.elements = [];
          // TODO: Revisar que funcion cumple los elements de este objeto, mirar si rompe algo.
          send = { ...this.billData, attributes: this.machine };
        } else if (this.billData.issueType.name === 'Entrada extintor(es)'
          || this.billData.issueType.name === 'Salida extintor(es)') {
          send = { ...this.billData, attributes: this.extinguisher };
        } else if (this.billData.issueType.name === 'Relevo') {
          send = { ...this.billData, attributes: this.relief };
        } else if (this.billData.issueType.name === 'Novedades en máquinas') {
          send = { ...this.billData, attributes: this.noveltyMachine };
        } else if (this.billData.issueType.name === 'Nota') {
          send = { ...this.billData, attributes: this.notes };
        } else {
          send = { ...this.billData };
        }
        if (this.action.created) { // Validacion de si es editar o crear
          try {
            const dataFormat = await billModel.getApiFormat(send);
            await this.$store.dispatch('bills/store', dataFormat);
            const msg = 'Registro exitoso';
            this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
            this.loading = false;
            this.$router.replace(ROUTES.bills.bills);
          } catch (e) {
            // console.log(e);
            const msg = getError(e);
            this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
            this.loading = false;
          }
        } else {
          try {
            const dataFormat = await billModel.getApiFormat(send);
            await this.$store.dispatch('bills/update', dataFormat);
            const msg = 'Actualizacion satisfactoria';
            this.createNotification({ message: msg, timeout: 3000, ...SUCCESS_NOTIFICATION });
            this.loading = false;
            this.$router.replace(ROUTES.bills.bills);
          } catch (e) {
            const msg = getError(e);
            this.createNotification({ message: msg, timeout: 5000, ...ERROR_NOTIFICATION });
            this.loading = false;
          }
        }
      }
    },
    maxDateIsToday(dates) {
      return dates <= formatDate(today, 'YYYY/MM/DD');
    },
    minDateIsToday(dates) {
      return dates >= formatDate(today, 'YYYY/MM/DD');
    },
    async updateElements() {
      this.loadChangeVehicle = true;
      this.elements = [];
      const elementsAvailable = await this.$store.dispatch('elements/getElementsWithoutVehicle');
      const vehicle = await this.$store.dispatch('vehicles/getForId', this.machine.vehicle.id);
      if (vehicle.elements) {
        this.machine.newElements = [...vehicle.elements];
        elementsAvailable.unshift(...vehicle.elements);
      }
      this.elements = elementsAvailable;
      this.loadChangeVehicle = false;
    },
  },
  computed: {
    user() {
      return this.$q.localStorage.getItem(LS_USER_INFO);
    },
    action() {
      return this.$q.localStorage.getItem(LS_CREATING_BILLS);
    },
  },
  async created() {
    await Promise.all([
      this.issueTypes = await this.$store.dispatch('issueTypes/get'),
      this.employees = await this.$store.dispatch('employees/get'),
    ]);
    this.withIssueTypes = this.issueTypes.length > 0;
    this.withEmployees = this.employees.length > 0;
    if (this.withIssueTypes && this.withEmployees) {
      await Promise.all([
        this.events = await this.$store.dispatch('ui/getEvents'),
        this.vehicles = await this.$store.dispatch('vehicles/get'),
        this.reportTypes = await this.$store.dispatch('ui/getReportTypes'),
        this.novelthyTypes = await this.$store.dispatch('ui/getNoveltyTypes'),
        this.vehicles = await this.$store.dispatch('vehicles/get'),
        this.extinguisherTypes = await this.$store.dispatch('extinguisherTypes/get'),
      ]);
      if (this.action.created) {
        this.billData.userSession = { id: this.user.id, person: this.user.name };
        this.billData.issueType = this.issueTypes ? this.issueTypes[0] : {};
        // this.emergency.event = this.events ? this.events[0] : {};
        this.emergency.report.type = this.reportTypes ? this.reportTypes[0] : {};
        this.personal.employee = this.employees ? this.employees[0] : {};
        this.machine.employee = this.employees ? this.employees[0] : {};
        // this.machine.crewman = this.employees ? this.employees[0] : {};
        this.noveltyMachine.employeeReport = this.employees ? this.employees[0] : {};
        this.machine.vehicle = this.vehicles ? this.vehicles[0] : {};
        this.noveltyMachine.vehicle = this.vehicles ? this.vehicles[0] : {};
        await this.updateElements();
        this.extinguisher.extinguisherType = this.extinguisherTypes
          ? this.extinguisherTypes[0] : {};
        this.noveltyMachine.novelthyType = this.novelthyTypes ? this.novelthyTypes[0] : {};
        this.extinguisher.owner.job = this.professions ? this.professions[0] : {};
        this.relief.employeeDelivery = this.employees ? this.employees[0] : {};
        this.relief.employeeReceives = this.employees && this.employees.length > 1
          ? this.employees[1] : {};
      } else {
        const idToEdit = this.action.id;
        const bill = await this.$store.dispatch('bills/getForId', idToEdit);
        if (bill.issueType.name === 'Recepción de emergencia') {
          this.emergency = bill.attributes;
        } else if (bill.issueType.name === 'Entrada de personal'
          || bill.issueType.name === 'Salida de personal') {
          this.personal = bill.attributes;
        } else if (bill.issueType.name === 'Entrada de máquina'
          || bill.issueType.name === 'Salida de máquina') {
          this.machine = bill.attributes;
          this.updateElements();
        } else if (bill.issueType.name === 'Entrada visitante'
          || bill.issueType.name === 'Salida visitante') {
          this.visitor = bill.attributes;
        } else if (bill.issueType.name === 'Entrada extintor(es)'
          || bill.issueType.name === 'Salida extintor(es)') {
          this.extinguisher = bill.attributes;
        } else if (bill.issueType.name === 'Relevo') {
          this.relief = bill.attributes;
        } else if (bill.issueType.name === 'Novedades en máquinas') {
          this.noveltyMachine = bill.attributes;
        } else if (bill.issueType.name === 'Nota') {
          this.notes = bill.attributes;
        }
        this.billData = bill;
      }
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
