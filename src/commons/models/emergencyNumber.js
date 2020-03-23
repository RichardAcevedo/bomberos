import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    phone: path('telefono', dataApi),
    entity: path('entidad', dataApi),
    address: path('direccion', dataApi) ? path('direccion', dataApi) : null,
    neighborhood: path('barrio', dataApi) ? path('barrio', dataApi) : null,
    otherNumber: path('otro_telefono', dataApi) ? path('otro_telefono', dataApi) : null,
    extension: path('extension', dataApi) ? path('extension', dataApi) : null,
  }
);

const getApiFormat = (dataView) => {
  const result = {
    telefono: path('phone', dataView),
    entidad: path('entity', dataView),
    direccion: path('address', dataView),
    barrio: path('neighborhood', dataView),
    otroTelefono: path('otherNumber', dataView),
    extension: path('extension', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
