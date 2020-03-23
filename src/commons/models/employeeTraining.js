import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    event: path('evento', dataApi),
    institution: path('institucion', dataApi),
    theoreticalHours: `${path('hora_teorica', dataApi)}`,
    practicalHours: `${path('hora_practica', dataApi)}`,
    date: dateToViewFormat(path('fecha', dataApi)),
    pathFile: path('dir_archivo', dataApi),
    idEmployee: path('id_empleado', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    evento: path('event', dataView),
    institucion: path('institution', dataView),
    horaTeorica: path('theoreticalHours', dataView),
    horaPractica: path('practicalHours', dataView),
    fecha: dateToApiFormat(path('date', dataView)),
    idEmpleado: path('idEmployee', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  if (path('file', dataView)) result.archivo = path('file', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
