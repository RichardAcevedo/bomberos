import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import licenseCategoryModel from './licenseCategory';

const getApiFormat = dataView => (
  {
    fechaExpedicion: dateToApiFormat(path('expeditionDate', dataView)),
    fechaVigencia: dateToApiFormat(path('effectiveDate', dataView)),
    categoria: licenseCategoryModel.getApiFormat(path('licenseCategory', dataView)),
  }
);

const getViewFormat = dataApi => (
  {
    expeditionDate: dateToViewFormat(path('fecha_expedicion', dataApi)),
    effectiveDate: dateToViewFormat(path('fecha_vigencia', dataApi)),
    licenseCategory: licenseCategoryModel.getViewFormat(path('categoria', dataApi)),
  }
);

export default {
  getApiFormat,
  getViewFormat,
};
