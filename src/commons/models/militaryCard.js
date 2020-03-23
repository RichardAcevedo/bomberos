import { path } from '../../utils/helpers';

const getApiFormat = dataView => (
  {
    clase: path('class', dataView),
    distrito: path('district', dataView),
  }
);

const getViewFormat = dataApi => (
  {
    class: path('clase', dataApi),
    district: path('distrito', dataApi),
  }
);

export default {
  getApiFormat,
  getViewFormat,
};
