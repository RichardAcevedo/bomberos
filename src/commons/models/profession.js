import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    description: path('descripcion', dataApi),
  }
);

export default {
  getViewFormat,
};
