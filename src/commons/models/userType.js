import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    slug: path('slug', dataApi),
  }
);

export default {
  getViewFormat,
};
