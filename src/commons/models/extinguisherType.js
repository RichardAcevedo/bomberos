import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    unity: path('unidad', dataApi),
    quantity: path('cantidad', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
    unidad: path('unity', dataView),
    cantidad: path('quantity', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
