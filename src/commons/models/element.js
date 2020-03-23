import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    inventoryCode: path('codigo_inventario', dataApi),
    name: path('nombre', dataApi),
    description: path('descripcion', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    codigoInventario: path('inventoryCode', dataView),
    nombre: path('name', dataView),
    descripcion: path('description', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
