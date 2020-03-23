import rankCategoriesApi from '../../commons/api/rankCategories';
import * as types from '../../commons/mutationTypes';
import rankCategoryModel from '../../commons/models/rankCategory';
import { downloadExcel } from '../../utils/helpers';

const get = async ({ commit }) => {
  try {
    const rankCategories = await rankCategoriesApi.get();
    const { data } = rankCategories;
    const result = data.reduce((m, item) => {
      m.push(rankCategoryModel.getViewFormat(item));
      return m;
    }, []);
    commit(types.SET_RANK_CATEGORIES_LIST, result);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const getForId = async (params, payload) => {
  try {
    const rankCategory = await rankCategoriesApi.getForId(payload);
    const { data } = rankCategory;
    const result = rankCategoryModel.getViewFormat(data);
    return result;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const store = async (params, payload) => rankCategoriesApi.store(payload);

const remove = async (params, payload) => {
  try {
    await payload.reduce(async (m, item) => {
      await rankCategoriesApi.remove(item.id);
    }, []);
  } catch (e) {
    // console.log(e);
  }
};

const update = async (params, payload) => {
  try {
    const rankCategory = await rankCategoriesApi.update(payload);
    return rankCategory;
  } catch (e) {
    // console.log(e);
    return e;
  }
};

const report = async (params, payload) => {
  try {
    const file = await rankCategoriesApi.report();
    downloadExcel(file.data, payload);
  } catch (e) {
    // console.log(e);
  }
};

export default {
  get,
  getForId,
  store,
  remove,
  update,
  report,
};
