import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';
import awardTypeModel from './awardType';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    dateMinutes: dateToViewFormat(path('fecha_acta', dataApi)),
    dateResolution: dateToViewFormat(path('fecha_resolucion', dataApi)),
    codeMinutes: path('codigo_acta', dataApi),
    codeResolution: path('codigo_resolucion', dataApi),
    description: path('descripcion', dataApi),
    employee: path('empleado.persona.nombre', dataApi),
    awardType: path('tipo_condecoracion.nombre', dataApi),
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
    employee: employeeModel.getViewFormatSimple(path('empleado', dataApi)),
    awardType: awardTypeModel.getViewFormat(path('tipo_condecoracion', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fechaActa: dateToApiFormat(path('dateMinutes', dataView)),
    fechaResolucion: dateToApiFormat(path('dateResolution', dataView)),
    codigoActa: path('codeMinutes', dataView),
    codigoResolucion: path('codeResolution', dataView),
    descripcion: path('description', dataView),
    idEmpleado: path('employee.id', dataView),
    idTipoCondecoracion: path('awardType.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
