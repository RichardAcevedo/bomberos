import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    course: path('curso', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    duration: path('duracion', dataApi),
    institution: path('institucion', dataApi),
    idEmployee: path('id_empleado', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    curso: path('course', dataView),
    fecha: dateToApiFormat(path('date', dataView)),
    duracion: path('duration', dataView),
    institucion: path('institution', dataView),
    idEmpleado: path('idEmployee', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
