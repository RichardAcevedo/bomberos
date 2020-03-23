import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    departament: path('departamento.nombre', dataApi),
  }
);

export default {
  getViewFormat,
};
