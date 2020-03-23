import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    document: path('documento', dataApi),
    address: path('direccion', dataApi),
    phone: path('telefono', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
    documento: path('document', dataView),
    direccion: path('address', dataView),
    telefono: path('phone', dataView),
    fecha: dateToApiFormat(path('date', dataView)),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
