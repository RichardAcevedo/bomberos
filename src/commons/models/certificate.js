import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import companyModel from './company';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    rate: path('tarifa', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    dateOut: dateToViewFormat(path('vence', dataApi)),
    company: path('empresa.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    rate: path('tarifa', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    dateOut: dateToViewFormat(path('vence', dataApi)),
    company: companyModel.getViewFormatSimple(path('empresa', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    tarifa: path('rate', dataView),
    fecha: dateToApiFormat(path('date', dataView)),
    vence: dateToApiFormat(path('dateOut', dataView)),
    idEmpresa: path('company.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
