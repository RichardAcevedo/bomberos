import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import extinguisherTypeModel from './extinguisherType';
import customerModel from './customer';
import companyModel from './company';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    capacity: path('capacidad', dataApi),
    rate: path('tarifa', dataApi),
    serviceNote: path('nota_de_servicio', dataApi), // nulo
    extinguisherType: path('tipo_extintor.nombre', dataApi),
    customer: path('cliente.nombre', dataApi),
    company: path('empresa.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    capacity: path('capacidad', dataApi),
    rate: path('tarifa', dataApi),
    serviceNote: path('nota_de_servicio', dataApi), // nulo
    extinguisherType: extinguisherTypeModel.getViewFormat(path('tipo_extintor', dataApi)),
    customer: customerModel.getViewFormat(path('cliente', dataApi)),
    company: companyModel.getViewFormatSimple(path('empresa', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fecha: dateToApiFormat(path('date', dataView)),
    capacidad: path('capacity', dataView),
    tarifa: path('rate', dataView),
    notaDeServicio: path('serviceNote', dataView),
    idTipoExtintor: path('extinguisherType.id', dataView),
    idCliente: path('customer.id', dataView),
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
