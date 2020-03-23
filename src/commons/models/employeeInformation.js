import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import rankModel from './rank';

const getViewFormat = (dataApi, simple) => (
  {
    id: path('id', dataApi),
    dateIn: dateToViewFormat(path('fecha_inicio', dataApi)),
    dateOut: path('fecha_baja', dataApi) ? dateToViewFormat(path('fecha_baja', dataApi)) : null,
    position: path('cargo', dataApi),
    institution: path('institucion', dataApi),
    resolution: path('resolucion', dataApi) ? path('resolucion', dataApi) : null,
    idEmployee: path('id_empleado', dataApi),
    pathFile: path('dir_archivo', dataApi),
    rank: simple ? path('rango.nombre', dataApi) : rankModel.getViewFormatComplete(path('rango', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fechaInicio: dateToApiFormat(path('dateIn', dataView)),
    fechaBaja: path('dateOut', dataView) ? dateToApiFormat(path('dateOut', dataView)) : null,
    cargo: path('position', dataView),
    institucion: path('institution', dataView),
    resolucion: path('resolution', dataView) ? path('resolution', dataView) : null,
    idEmpleado: path('idEmployee', dataView),
    idRango: path('rank.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  if (path('file', dataView)) result.archivo = path('file', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
