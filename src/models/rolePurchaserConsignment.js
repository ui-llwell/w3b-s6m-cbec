import { message} from 'antd';
import {
  getConfirmReceiptData,getChildModelTableData,childModelSubmit,exportOrder,
  dataStatistics,
  goodsSales,getUploadOrderbillDX,
  contractInformation,
  getPaymentSettlementData,getSettlementDetailsData,getSettlementDetailsElseData,getChildModelPrintData,
  changeStatusCompleteReconciliation //确认付款
} from '../services/rolePurchaserConsignment_S'
import {ReceiptModel} from "../roles/purchaser/consignment/receivingConfirmation";
import {getDownloadToSendOrder} from "../services/orderManagement_S";
// import paymentSettlement from "../roles/purchaser/consignment/paymentSettlement";
export default {
  namespace: 'rolePurchaserConsignment',
  state:{
    // -------- 收货确认 --------------
    confirmReceipt:{
      tableData:{
        list: [],
        pagination:{},
      },
      childReceiptModelVisible:false,
      childModelHelpData:{
        visible:false,
        type:0,
        status:0,
        sendType:0,
        sendid:0
      },
      childModelTableData:{
        item:{},
        list: [],
        pagination:{},
      }
    },

    // -------- 数据统计 --------------
    dataStatistics:{
      tableData:{
        list: [],
        pagination:{},
      },
    },
    // -------- 商品销售 --------------
    goodsSales:{
      tableData:{
        list: [],
        pagination:{},
      },
    },
    // -------- 合同信息 --------------
    contractInformation:{
      getData:{
        item:{},
        list:[],
        visible:false,
        src:''
      },
      childHelpData:{
        visible:false,
        src:''
      }

    },

    // -------- 货款结算 --------------
    paymentSettlement:{
      tableData:{
        list: [],
        pagination:{},
      },
      childDetailsModelVisible:false,
      childDetailsModelHelpId: '',
      childModelDetailsTableTab1Data:{
        item:{},
        list: [],
        pagination:{},
      },
      childModelDetailsTableTab2Data:{
        item:{},
        list: [],
        pagination:{},
      },
      childPrintModelVisible:false,
      childModelPrint:{
        item:{},
        list:[],
        pagination:{}
      }
    }
  },
  effects:{
    // -------- 收货确认 --------------
    // 收货确认 - 列表
    *getConfirmReceiptData({ payload },{ call,put }){
      const response = yield call(getConfirmReceiptData, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'getConfirmReceiptDataR',
          payload: response,
        })
      }
    },
    // 收货确认 - 操作内商品详情列表
    *getChildModelTableData({ payload },{ call,put }){
      const response = yield call(getChildModelTableData, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'getChildModelTableDataR',
          payload: response,
        })
      }
    },
    // 收货确认操作辅助信息
    *childModel({ payload },{ call,put }){
      // console.log('childModel',payload)
      const response = yield call(getChildModelTableData, {sendid:payload.sendid});
      if (response !== undefined) {
        yield put({
          type: 'childModelR',
          payload: payload,
        })
        yield put({
          type: 'childReceiptModelVisibleR',
          payload: payload.visible,
        })
        yield put({
          type: 'getChildModelTableDataR',
          payload: response,
        })
      }
    },
    // 收货确认 - 操作内提交或确认
    *childModelSubmit({ payload,callback },{ call,put }) {
      const response = yield call(childModelSubmit, payload);
      const initDataResponse = yield call(getConfirmReceiptData, {});
      if (response !== undefined) {
        if(response.type==='1'){
          message.success("提交成功");
          yield put({
            type: 'childReceiptModelVisibleR',
            payload: false,
          })
          callback();
          if(initDataResponse !== undefined){
            yield put({
              type: 'getConfirmReceiptDataR',
              payload: initDataResponse,
            })
          }
        }else{
          message.error(response.msg);
        }
      }
    },
    // 收货确认 - 导出 收货单
    *exportOrder({ payload, callback }, { call, put }) {
      const response = yield call(exportOrder, payload);
      if (response !== undefined) {
        if(response.type==1){
          message.success('导出成功');
          let downloadUrl = response.msg;
          window.location.href = downloadUrl;
        }else{
          message.error(response.msg)
        }
      }else{
        message.error(response.msg);
      }
    },

    // -------- 数据统计 --------------
    //数据统计 - 列表查询
    *dataStatistics({ payload },{ call,put }){
        const response = yield call(dataStatistics, payload);
        // console.log('~res',response)
        if(response!==undefined){
          yield put({
          type: 'dataStatisticsR',
          payload: response,
        })
      }
    },


    // -------- 商品销售 --------------
    //商品销售 - 列表查询
    *goodsSales({ payload },{ call,put }){
        const response = yield call(goodsSales, payload);
        // console.log('~res',response)
        if(response!==undefined){
          yield put({
          type: 'goodsSalesR',
          payload: response,
        })
      }
    },
    //商品销售 - 上传销售数据
    *uploadOrderbill({ payload,callback },{ call,put}){
      const response = yield call(getUploadOrderbillDX, payload);
       console.log('~',response)
      if (response !== undefined) {
        callback(response)
      }
    },

    // -------- 合同信息 --------------
    // 代销-财务-合同信息-图片放大20181121
    *sendChildHelpData({ payload },{ call,put }){
      // console.log(payload)
      yield put({
        type: 'sendChildHelpDataR',
        payload: payload,
      })
    },

    //代销-财务-合同信息-20181121
    *contractInformation({ payload },{ call,put }){
      const response = yield call(contractInformation, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'contractInformationR',
          payload: response,
        })
      }
    },


    // -------- 货款结算 --------------
    // 货款结算 - 列表
    *getPaymentSettlementData({ payload },{ call,put }){
      const response = yield call(getPaymentSettlementData, payload);
       console.log('~res22',response)
      if(response!==undefined){
        yield put({
          type: 'getPaymentSettlementDataR',
          payload: response,
        })
      }
    },

    // 货款结算 - 确认付款
    *completeReconciliation({ payload },{ call,put }){
      const response = yield call(changeStatusCompleteReconciliation, payload);
      const responseList = yield call(getPaymentSettlementData, {});
      // console.log('~res',response)
      if(response!==undefined){
      //  判断成功 刷新主列表页面
      //  ...
        if (response.type==1) {
          if(responseList!==undefined){
            yield put({
              type:'getPaymentSettlementDataR',
              payload: responseList
            })
          }
        }else{
          message.error('对账失败，请重新确认');
        }
      }
    },






    // 货款结算 - 查看结算明细
    *getSettlementDetailsData({ payload },{ call,put }){
      const responseTab1 = yield call(getSettlementDetailsData, payload);
      const responseTab2 = yield call(getSettlementDetailsElseData, payload);
      // console.log('~res',response)
      if(responseTab1!==undefined){
        yield put({
          type: 'getSettlementDetailsDataR',
          payload: {responseTab1,responseTab2,childDetailsModelVisible:true,childDetailsModelHelpId:payload.accountCode},
        })
      }
    },
    // 货款结算 - 查看结算明细 - 货款分页
    *childModelDetailsTableTab1Data({ payload },{ call,put }){
      const response = yield call(getSettlementDetailsData, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'childModelDetailsTableTabDataR',
          payload: {data:response,tab:'childModelDetailsTableTab1Data'},
        })
      }
    },
    // 货款结算 - 查看结算明细 - 其他分页
    *childModelDetailsTableTab2Data({ payload },{ call,put }){
      const response = yield call(getSettlementDetailsElseData, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'childModelDetailsTableTabDataR',
          payload: {data:response,tab:'childModelDetailsTableTab2Data'},
        })
      }
    },
    // 货款结算 - 打印
    *childModelPrintData({ payload,callback },{ call,put }){
      const response = yield call(getChildModelPrintData, payload);
      // console.log('~res',response)
      if(response!==undefined){
        yield put({
          type: 'childModelPrintDataR',
          payload: {response,childPrintModelVisible:true},
        })
        yield
          setTimeout(function () {
          window.print()
        },1000)

      }
    },

  },
  reducers:{
    // -------- 收货确认 --------------
    getConfirmReceiptDataR(state, action){
      return {
        ...state,
        confirmReceipt:{
          ...state.confirmReceipt,
          tableData:action.payload
        }
      }
    },
    childModelR(state, action){
      return {
        ...state,
        confirmReceipt:{
          ...state.confirmReceipt,
          childModelHelpData:action.payload
        }
      }
    },
    getChildModelTableDataR(state, action){
      return {
        ...state,
        confirmReceipt:{
          ...state.confirmReceipt,
          childModelTableData:action.payload
        }
      }
    },
    childReceiptModelVisibleR(state,action){
      return {
        ...state,
        confirmReceipt:{
          ...state.confirmReceipt,
          childReceiptModelVisible:action.payload
        }
      }
    },


    // -------- 数据查询 --------------
    dataStatisticsR(state, action){
      return {
        ...state,
        dataStatistics:{
          ...state.dataStatistics,
          tableData:action.payload
        }
      }
    },


    // -------- 商品销售 --------------
    goodsSalesR(state, action){
      return {
        ...state,
        goodsSales:{
          ...state.goodsSales,
          tableData:action.payload
        }
      }
    },


    // -------- 合同信息 --------------
    contractInformationR(state, action){
      return {
        ...state,
        contractInformation:{
          ...state.contractInformation,
          getData:action.payload,
          
        }
      }
    },
    sendChildHelpDataR(state, action){
      return {
        ...state,
        contractInformation:{
          ...state.contractInformation,
          childHelpData:action.payload
        }
      }
    },





    // -------- 货款结算 --------------

    getPaymentSettlementDataR(state, action){
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          tableData:action.payload
        }
      }
    },
    getSettlementDetailsDataR(state, action){
      // console.log(action.payload)
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          childModelDetailsTableTab1Data:action.payload.responseTab1,
          childModelDetailsTableTab2Data:action.payload.responseTab2,
          childDetailsModelVisible:action.payload.childDetailsModelVisible,
          childDetailsModelHelpId:action.payload.childDetailsModelHelpId
        }
      }
    },
    childModelDetailsTableTabDataR(state, action){
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          [action.payload.tab]:action.payload.data,
        }
      }
    },
    childDetailsModelVisibleR(state, action){
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          childDetailsModelVisible:action.payload
        }
      }
    },
    childPrintModelVisibleR(state, action){
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          childPrintModelVisible:action.payload
        }
      }
    },

    childModelPrintDataR(state, action){
      return {
        ...state,
        paymentSettlement:{
          ...state.paymentSettlement,
          childModelPrint:action.payload.response,
          childPrintModelVisible:action.payload.childPrintModelVisible
        }
      }
    }
  }
}
