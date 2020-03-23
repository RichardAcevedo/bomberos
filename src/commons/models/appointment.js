import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';
import positionModel from './position';

const booleanToString = boolean => (boolean ? 'Si' : 'No');
const stringToBoolean = string => (string === 'Si');

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    article: path('articulo', dataApi),
    order: path('orden', dataApi),
    active: path('activo', dataApi),
    dateOut: path('fecha_desactivacion', dataApi) ? dateToViewFormat(path('fecha_desactivacion', dataApi)) : path('fecha_desactivacion', dataApi),
    description: path('descripcion', dataApi),
    employee: path('empleado.persona.nombre', dataApi),
    position: path('cargo.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    article: path('articulo', dataApi),
    order: path('orden', dataApi),
    active: stringToBoolean(path('activo', dataApi)),
    dateOut: path('fecha_desactivacion', dataApi) ? dateToViewFormat(path('fecha_desactivacion', dataApi)) : path('fecha_desactivacion', dataApi),
    description: path('descripcion', dataApi),
    employee: employeeModel.getViewFormatSimple(path('empleado', dataApi)),
    position: positionModel.getViewFormat(path('cargo', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fecha: dateToApiFormat(path('date', dataView)),
    articulo: path('article', dataView),
    orden: path('order', dataView),
    activo: booleanToString(path('active', dataView)),
    fechaDesactivacion: path('dateOut', dataView) ? dateToApiFormat(path('dateOut', dataView)) : path('dateOut', dataView),
    descripcion: path('description', dataView),
    idEmpleado: path('employee.id', dataView),
    idCargo: path('position.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
