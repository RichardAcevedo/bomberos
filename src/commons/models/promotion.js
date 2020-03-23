import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';
import rankModel from './rank';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    dateMinutes: dateToViewFormat(path('fecha_acta', dataApi)),
    dateResolution: dateToViewFormat(path('fecha_resolucion', dataApi)),
    codeMinutes: path('codigo_acta', dataApi),
    codeResolution: path('codigo_resolucion', dataApi),
    description: path('descripcion', dataApi),
    active: path('activo', dataApi),
    dateDeactivation: path('fecha_desactivacion', dataApi) ? dateToViewFormat(path('fecha_desactivacion', dataApi)) : null,
    pathFile: path('dir_archivo', dataApi),
    employee: path('empleado.persona.nombre', dataApi),
    rank: path('rango.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    dateMinutes: dateToViewFormat(path('fecha_acta', dataApi)),
    dateResolution: dateToViewFormat(path('fecha_resolucion', dataApi)),
    codeMinutes: path('codigo_acta', dataApi),
    codeResolution: path('codigo_resolucion', dataApi),
    description: path('descripcion', dataApi),
    active: path('activo', dataApi) === 'Si',
    dateDeactivation: path('fecha_desactivacion', dataApi) ? dateToViewFormat(path('fecha_desactivacion', dataApi)) : null,
    pathFile: path('dir_archivo', dataApi),
    employee: employeeModel.getViewFormatSimple(path('empleado', dataApi)),
    rank: rankModel.getViewFormatComplete(path('rango', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fechaActa: dateToApiFormat(path('dateMinutes', dataView)),
    fechaResolucion: dateToApiFormat(path('dateResolution', dataView)),
    codigoActa: path('codeMinutes', dataView),
    codigoResolucion: path('codeResolution', dataView),
    descripcion: path('description', dataView),
    activo: path('active', dataView) === true ? 'Si' : 'No',
    fechaDesactivacion: !path('active', dataView) ? dateToApiFormat(path('dateDeactivation', dataView)) : null,
    idEmpleado: path('employee.id', dataView),
    idRango: path('rank.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  if (path('file', dataView)) result.archivo = path('file', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
