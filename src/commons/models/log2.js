import { path } from '../../utils/helpers';

const getViewFormat = dataApi => (
  {
    id: path('id', dataApi),
    idMinuta: path('idMinuta', dataApi),
    tipoEmergency: path('tipoEmergency', dataApi),
    estado: path('estado', dataApi),
    descripcion: path('descripcion', dataApi),
    created_at: path('created_at', dataApi),
  }
);

export default {
  getViewFormat,
};
