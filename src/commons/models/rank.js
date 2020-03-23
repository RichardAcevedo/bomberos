import { path } from '../../utils/helpers';
import rankCategoryModel from './rankCategory';

const getViewFormatSimple = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    description: path('descripcion', dataApi),
    category: path('categoria_rango.nombre', dataApi),
  }
);

const getViewFormatComplete = dataApi => (
  {
    id: path('id', dataApi),
    name: path('nombre', dataApi),
    description: path('descripcion', dataApi),
    category: rankCategoryModel.getViewFormat(path('categoria_rango', dataApi)),
  }
);

const getApiFormat = (dataView) => {
  const result = {
    nombre: path('name', dataView),
    descripcion: path('description', dataView),
    idCategoriaRango: path('category.id', dataView),
  };
  if (path('id', dataView)) result.id = path('id', dataView);
  return result;
};

export default {
  getViewFormatSimple,
  getViewFormatComplete,
  getApiFormat,
};
