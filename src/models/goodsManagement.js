import { message} from 'antd';
import {notification} from "antd/lib/index";
import {getBrandData} from '../services/publicDictionary_S'
import {getCheckStepStatus, getGoodsPutaway, getWareHouseData} from '../services/api'
import {
  getConsignmentStockData,
  getGoodsList,getGoodsDetailsO,getGoodsDetailsA,getGoodsDetailsS,getDefaultRadios,
  getGoodsDetails,onAudit,
} from '../services/goodsManagement_S'
export default {
  namespace: 'goodsManagement',
  state:{
    // 商品管理 - 商品查看 - 运营/供应商/代理
    goodsAboutData:{
      tableData:{
        list: [],
        pagination:{},
      },
      // 商品管理 - 商品查看详情 - 供应
      childCheckS:{},
      // 商品管理 - 商品查看详情 - 运营
      childCheckO:{
        goodsSelectSupplierList:[],
      },
      // 商品管理 - 商品查看详情 - 代理
      childCheckA:{},
    },
    // 商品管理 - 商品上架审核
    goodsOnAudit:{
      visible:{
        checkVisible:false,
        changeVisible:false,
        auditFailureVisible:false,
      },
      tableData:{
        list: [],
        pagination:{},
      },
      // 审核、查看获取详细信息
      goodsDetails:{
        warehouseGoodsList: []
      },
      selectedId: []
    },


    // 代销-商品库存
    consignmentStockData:{
      tableData:{
        list: [],
        pagination:{},
      },
    }
  },
  effects:{
    // 代销-商品报价
    *getConsignmentStockData({payload},{call,put}){
      const response = yield call(getConsignmentStockData, payload)
      if(response !== ''){
        yield put({
          type: 'getConsignmentStockDataR',
          payload:response
        })
      }
    },



    *getDataAndClose({ payload },{ call, put }){
      const response = yield call(getBrandData, payload);
      if(response !== ''){
        yield put({
          type: 'changeVisible',
          payload: {
            visibleType: payload.visibleType,
            visibleValue: false
          }
        });
      }
    },
    // 商品管理 - 商品查看 - 运营/供应商/代理/采购
    *getGoodsAboutData({ payload },{ call,put}){
      const response = yield call(getGoodsList, payload);
      if (response !== undefined) {
        yield put({
          type: 'getGoodsAboutDataR',
          payload: response,
        });
      }
    },
    // 商品管理 - 商品查看详情 - 供应
    *getGoodsDetailsS({ payload },{ call,put}){
      const response = yield call(getGoodsDetailsS, payload);
      if (response !== undefined) {
        yield put({
          type: 'getGoodsDetailsSR',
          payload: response,
        });
      }
    },
    // 商品管理 - 商品查看详情 - 运营
    *getGoodsDetailsO({ payload },{ call,put}){
      const response = yield call(getGoodsDetailsO, payload);
      if (response !== undefined) {
        yield put({
          type: 'getGoodsDetailsOR',
          payload: response,
        });
      }
    },
    // 商品管理 - 商品查看详情 - 运营 - 默认选中供应商
    *getDefaultRadios({ payload },{ call,put}){
      const response = yield call(getDefaultRadios, payload);
      if (response !== undefined) {
        if(response.type==1){
          message.success(response.msg);
          yield put({
            type: 'getDefaultRadiosR',
            payload: payload,
          });
        }else{
          message.error(response.msg);
        }

      }
    },

    // 商品管理 - 商品查看详情 - 代理
    *getGoodsDetailsA({ payload },{ call,put}){
      const response = yield call(getGoodsDetailsA, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getGoodsDetailsAR',
          payload: response,
        });
      }
    },

    // 上架审核列表
    *getGoodsOnAuditList({ payload },{ call,put}){
      const response = yield call(getGoodsPutaway, payload);
      // console.log('~',response)
      if (response !== undefined) {
        yield put({
          type: 'getGoodsOnAuditListR',
          payload: response,
        });
      }
    },
    // 上架审核列表全套
    *getGoodsDetailsAndOther({ payload },{ call,put}){
      const responseF = yield call(getGoodsDetails, {logId: payload.logId});
      if (responseF !== undefined) {
        yield put({
          type: 'getGoodsDetailsR',
          payload: responseF,
        });

        const responseS = yield call(getCheckStepStatus, payload);
        if (responseS !== undefined) {
          yield put({
            type: 'changeVisible',
            payload: {
              visibleType: responseS.status == '1' ? 'changeVisible' : 'checkVisible',
              visibleValue: true
            },
          });
        }
      }
    },
    *onAudit({ payload,callback },{ call,put, select}){
      const selected = yield select(state => state.goodsManagement.goodsOnAudit.selectedId);
      const response = yield call(onAudit, {...payload, logGoodsId: selected});
      if (response !== undefined) {
        yield put({
          type: 'changeVisible',
          payload: {
            visibleType: payload.visibleType,
            visibleValue: false
          }
        });
        yield put({
          type: 'changeSelectedId',
          payload: {
            selectedRow:[],
          },
        });
        yield put({
          type: 'getGoodsOnAuditList',
          payload: {
            userId:payload.userId,
          },
        });
        callback(response);
      }
    },
  },
  reducers:{
    getConsignmentStockDataR(state, action){
      return {
        ...state,
        consignmentStockData:{
          ...state.consignmentStockData,
          tableData:action.payload,
        }
      };
    },
    changeVisible(state, action){
      state.goodsOnAudit.visible[action.payload.visibleType] = action.payload.visibleValue;
      return {...state};
    },
    changeSelectedId(state, action){
      state.goodsOnAudit.selectedId = action.payload.selectedRow;
      return {...state};
    },
    getGoodsAboutDataR(state, action) {
      return {
        ...state,
        goodsAboutData:{
          ...state.goodsAboutData,
          tableData:action.payload,
        },
      };
    },
    getGoodsDetailsSR(state, action) {
      return {
        ...state,
        goodsAboutData:{
          ...state.goodsAboutData,
          childCheckS:action.payload,
        },
      };
    },
    getGoodsDetailsOR(state, action) {
      return {
        ...state,
        goodsAboutData:{
          ...state.goodsAboutData,
          childCheckO:action.payload,
        },
      };
    },
    getDefaultRadiosR(state, action) {

      state.goodsAboutData.childCheckO.goodsSelectSupplierList.map(item=>{
        item.ifSel=item.id ==action.payload.id?'1':'0'
        return item
      })

      // _.find(state.goodsAboutData.childCheckO.goodsSelectSupplierList,function(item){ return item.id === action.payload.id}).ifSel = '1';
      // _.find(state.goodsAboutData.childCheckO.goodsSelectSupplierList,function(item){return item.id !== action.payload.id}).ifSel = '0';

      return {
        ...state,
      };
    },
    getGoodsDetailsAR(state, action) {
      return {
        ...state,
        goodsAboutData:{
          ...state.goodsAboutData,
          childCheckA:action.payload,
        },
      };
    },
    getGoodsOnAuditListR(state, action) {
      return {
        ...state,
        goodsOnAudit:{
          ...state.goodsOnAudit,
          tableData:action.payload
        },
      };
    },
    getGoodsDetailsR(state, action) {
      return {
        ...state,
        goodsOnAudit:{
          ...state.goodsOnAudit,
          goodsDetails:action.payload,
          selectedId: action.payload.warehouseGoodsList.map(item => {
            return item.id
          })
        },
      };
    },

  }
}
