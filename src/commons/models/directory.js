import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    phone: path('telefono', dataApi),
    address: path('direccion', dataApi),
    neighborhood: path('barrio', dataApi),
    name: path('nombre', dataApi),
    zone: path('zona', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    telefono: path('phone', dataView),
    direccion: path('address', dataView),
    barrio: path('neighborhood', dataView),
    nombre: path('name', dataView),
    zona: path('zone', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
