import { getPurOrderListOfPurchasers, getPurGoodsListOfPurchasers,
  getPurInfoDetailsOfPurchasers, updatePriceOfPurchasers,listChat,sendChat,updatePurchaseStatus,addPurNewGoods,delPurGoods,updateStage } from '../services/api';

export default {
  namespace: 'purchasePurchasers',

  state: {
    list: [],
    pagination: {},
    listGoods: [],
    paginationGoods: {},
    purchase: {},
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getPurOrderListOfPurchasers, payload);
      if (response !== undefined) {
        yield put({
          type: 'queryList',
          payload: response,
        });
      }
    },
    *goodslist({ payload,callback }, { call, put }) {
      const response1 = yield call(getPurInfoDetailsOfPurchasers, payload);
      const response = yield call(getPurGoodsListOfPurchasers, payload);
      if (response1 !== undefined) {
        yield put({
          type: 'queryDetails',
          payload: response1,
        });
      }
      if (response !== undefined) {
        yield put({
          type: 'queryGoodsList',
          payload: response,
        });
      }
      if(response !== undefined && response1 !== undefined) {
        const result = {
            bean:response1,
            list : response
          };
        callback(result);
      }
    },
    *updatePrice({ payload, callback }, { call }) {
      const response = yield call(updatePriceOfPurchasers, payload);
      if (response !== undefined) {
          callback(response);
      }
    },
    *listChat({ payload, callback }, { call }) {
      const response = yield call(listChat, payload);
      if (response !== undefined) {
        callback(response);
      }
    },
    *sendChat({ payload, callback }, { call }) {
      const response = yield call(sendChat, payload);
      if (response !== undefined) {
        callback(response);
      }
    },
    *submitPur({ payload, callback }, { call }) {
      const response = yield call(updatePurchaseStatus, payload);
      if (response !== undefined) {
        if(callback)callback(response);
      }
    },
    *addPurNewGoods({ payload, callback }, { call }) {
      const response = yield call(addPurNewGoods, payload);
      if (response !== undefined) {
        callback(response);
      }
    },
    *delPurGoods({ payload, callback }, { call }) {
      const response = yield call(delPurGoods, payload);
      if (response !== undefined) {
        callback(response);
      }
    },
    *updateStage({ payload, callback }, { call }) {
      const response = yield call(updateStage, payload);
      if (response !== undefined) {
        if(callback)callback(response);
      }
    }
    
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    queryGoodsList(state, action) {
      return {
        // ...action.payload,
        ...state,
        listGoods:action.payload,
        // paginationGoods:action.payload.pagination,
      };
    },
    queryDetails(state, action) {
      return {
        ...state,
        purchase:action.payload,
      };
    },

  },
};
