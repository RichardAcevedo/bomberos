import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';
import issueModel from './issueType';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    hour: path('hora', dataApi),
    issueType: path('asunto.nombre', dataApi),
    description: path('descripcion', dataApi),
    attributes: path('atributos', dataApi),
    userSession: path('usuario_sesion.persona.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    hour: path('hora', dataApi),
    issueType: issueModel.getViewFormat(path('asunto', dataApi)),
    description: path('descripcion', dataApi),
    attributes: path('atributos', dataApi),
    userSession: employeeModel.getViewFormatSimple(path('usuario_sesion', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fecha: dateToApiFormat(path('date', dataView)),
    hora: path('hour', dataView),
    descripcion: path('description', dataView),
    atributos: path('attributes', dataView),
    idAsunto: path('issueType.id', dataView),
    idUsuarioSesion: path('userSession.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

const getApiFormatForReport = (dataView) => {
  const result = {
    idAsunto: path('issueType.id', dataView),
  };
  if (path('employee', dataView)) result.idEmpleado = path('employee.id', dataView);
  if (path('vehicle', dataView)) result.idVehiculo = path('vehicle.id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
  getApiFormatForReport,
};
