import { message} from 'antd';
import {notification} from "antd/lib/index";
import {
  getClient,
  getSalesStatisticsListA,getSalesStatisticsListS,getSalesStatisticsListO,
  getWorkStatisticsDate, //统计柱状图
} from '../services/salesStatistics_S'
export default {
  namespace: 'salesStatistics',
  state:{
    salesStatisticsAll:{
      tableData:{
        item:{
          salesNumTotal:0,
        },
        list: [],
        pagination:{},
      },

    },
    clientData:{
      tableData:{
        list: [],
        pagination:{},
      }
    },

    managementStatisticS: {
      tableData:{
        item:{
          
        },
        list: [],
        pagination:{},
      },
    }




  },
  effects:{
    // 我的客户
    *getClient({ payload },{ call,put }){
      const response = yield call(getClient, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'getClientR',
          payload: response,
        })
      }
    },
    // 销售统计列表 - 供应商
    *getSalesStatisticsListS({ payload },{ call,put}){
      const response = yield call(getSalesStatisticsListS, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getSalesStatisticsListR',
          payload: response,
        });
      }
    },
    // 销售统计列表 - 运营
    *getSalesStatisticsListO({ payload },{ call,put}){
      const response = yield call(getSalesStatisticsListO, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getSalesStatisticsListR',
          payload: response,
        });
      }
    },
    // 销售统计列表 - 代理
    *getSalesStatisticsListA({ payload },{ call,put}){
      const response = yield call(getSalesStatisticsListA, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getSalesStatisticsListR',
          payload: response,
        });
      }
    },
    // getWorkStatisticsDate 统计图
    *getWorkStatisticsDate({ payload },{ call,put}){
      const response = yield call(getWorkStatisticsDate, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getWorkStatisticsDateR',
          payload: response,
        });
      }
    },
  },
  reducers:{
    getClientR(state, action){
      return {
        ...state,
        clientData:{
          ...state.clientData,
          tableData:action.payload
        }
      }
    },
    getSalesStatisticsListR(state, action) {
        return {
          ...state,
          salesStatisticsAll:{
            ...state.salesStatisticsAll,
            tableData:action.payload
          },
        };
    },
    
    getWorkStatisticsDateR(state, action) {
      return {
        ...state,
        managementStatisticS: {
          ...state.managementStatisticS,
            tableData:action.payload
        }
      };
    },


  }
}
