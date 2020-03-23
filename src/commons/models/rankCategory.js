import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormat,
  getApiFormat,
};
