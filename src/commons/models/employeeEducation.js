import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import cityModel from './city';

const getViewFormat = (dataApi, simple) => (
  {
    id: path('id', dataApi),
    institution: path('institucion', dataApi),
    title: path('titulo_obtenido', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    finish: path('terminado', dataApi),
    city: simple ? path('ciudad.nombre', dataApi) : cityModel.getViewFormat(path('ciudad', dataApi)),
    idEmployee: path('id_empleado', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    institucion: path('institution', dataView),
    tituloObtenido: path('title', dataView),
    fecha: dateToApiFormat(path('date', dataView)),
    terminado: path('finish', dataView),
    idCiudad: path('city.id', dataView),
    idEmpleado: path('idEmployee', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
