import { path, dateToApiFormat, dateToViewFormat } from '../../utils/helpers';
import employeeModel from './employee';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    sanctionType: path('tipo_sancion', dataApi),
    order: path('orden', dataApi),
    description: path('descripcion', dataApi),
    employee: path('empleado.persona.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    date: dateToViewFormat(path('fecha', dataApi)),
    sanctionType: path('tipo_sancion', dataApi),
    order: path('orden', dataApi),
    description: path('descripcion', dataApi),
    employee: employeeModel.getViewFormatSimple(path('empleado', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    fecha: dateToApiFormat(path('date', dataView)),
    tipoSancion: path('sanctionType', dataView),
    orden: path('order', dataView),
    descripcion: path('description', dataView),
    idEmpleado: path('employee.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
