
export default function(dynamicWrapper,app){
  return {
    // 供应商
    ...supplier(dynamicWrapper,app),
    // 采购商
    ...procurement(dynamicWrapper,app),
    // 运营
    ...operation(dynamicWrapper,app),
    // 财务
    ...finance(dynamicWrapper,app),
    // 零售
    ...retail(dynamicWrapper,app)
  }

};
//-------------------------------------供应商-------------------------------------
export function supplier (dynamicWrapper,app){
  return{
    //-----------------------------订单统计-----------------------------
    //订单管理 - 供应商
    '/orderManagement/supplierOrder': {
      component: dynamicWrapper(app, ['orderManagement','publicDictionary'], () => import('../routes/OrderManagement/supplierOrder')),
    },

    //-----------------------------商品管理-----------------------------

    //商品入库
    '/goods/putaway': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/Putaway')),
    },
    //商品入库表单
    '/goods/step-form': {
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm')),
    },
    '/goods/step-form/info': {
      // name: '分步表单（上传入库信息）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step1')),
    },
    '/goods/step-form/confirm/:id': {
      // name: '分步表单（补全入库信息）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step2')),
    },
    '/goods/step-form/wait/:id': {
      // name: '分步表单（等待审核）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step3')),
    },
    '/goods/step-form/result/:isSuccess/:id': {
      // name: '分步表单（完成）',
      component: dynamicWrapper(app, ['goods'], () => import('../routes/Goods/StepForm/Step4')),
    },

    //商品管理 - 商品查看 - 供应商
    '/goods/goodsAboutS': {
      component: dynamicWrapper(app, ['goodsManagement','publicDictionary'], () => import('../routes/GoodsManagement/GoodsAboutS')),
    },
    //-----------------------------合同管理-----------------------------
    //查看合同
    '/agreement/supplierCheckAgreement': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/checkAgreement')),
    },

    //-----------------------------结算管理-----------------------------
    //货款结算
    '/finance/supplierPurchaseSettlement': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/purchaseSettlement')),
    },

    //-----------------------------20190321报价管理-----------------------------
    //我的可供商品
    '/forGoods/supplierForGoods': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/purchaseSettlement')),
    },
    // 批量供货页
    // '/forGoods/supplierForGoods/bulkSupply': {
    //   component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/purchaseSettlement')),
    // },
    // 批量供货-商品详情
    '/forGoods/bulkSupplyGoodsDetails': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/purchaseSettlement')),
    },
    //-----------------------------20190321商品管理-----------------------------
    // 我的可供商品-批量供货
    // 我的可供商品-一件代发
    // 我的可供商品-铺货
    '/goods/bulkSupplyGeneralPage': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/bulkSupplyGeneralPage')),
    },
    // 我的可供商品-批量供货-商品详情
    // 我的可供商品-一件代发-商品详情
    // 我的可供商品-铺货-商品详情
    '/commodityManagement/commodityDetailsGeneralPage/:barcode/:type': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/commodityDetailsGeneralPage')),
    },


    //-----------------------------20190321报价管理-----------------------------
    // 报价列表
    '/bulkPurchases/quotationList': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/quotationList')),
    },
    // 去报价（商品）
    // 查看报价（商品）
    // 去确认（相关费用）
    // 查看（相关费用）
    // 查看（已关闭）
    //共同页面去报价（商品） 查看报价（商品） 去确认（相关费用）查看（相关费用）查看（已关闭）
    '/quotationManagement/commodityGeneralPage/:id': {
      component: dynamicWrapper(app, ['roleSupplierBus'], () => import('../roles/supplier/commodityGeneralPage')),
    },
  }
}
//-------------------------------------采购商-------------------------------------
export function procurement (dynamicWrapper,app){
  return{
  //-------------代销业务-------------

    //代销-商品-商品库存-20181115
    '/consignment/consignmentStock': {
      component: dynamicWrapper(app, ['goodsManagement','publicDictionary'], () => import('../routes/GoodsManagement/consignmentStock')),
    },
    //代销-商品-收货确认-20181121
    '/consignment/receivingConfirmation': {
      component: dynamicWrapper(app, ['rolePurchaserConsignment'], () => import('../roles/purchaser/consignment/receivingConfirmation')),
    },
    //代销-订单-数据统计-20181204
    '/consignment/statistics': {
      component: dynamicWrapper(app, ['rolePurchaserConsignment'], () => import('../roles/purchaser/consignment/dataStatistics')),
    },
    //代销-订单-商品销售-20181204
    '/consignment/goodsSales': {
      component: dynamicWrapper(app, ['rolePurchaserConsignment'], () => import('../roles/purchaser/consignment/goodsSales')),
    },
    //代销-财务-合同信息-20181121
    '/consignment/contractInformation': {
      component: dynamicWrapper(app, ['rolePurchaserConsignment'], () => import('../roles/purchaser/consignment/contractInformation')),
    },
    //代销-统计-货款结算-20181121
    '/consignment/paymentSettlement': {
      component: dynamicWrapper(app, ['rolePurchaserConsignment'], () => import('../roles/purchaser/consignment/paymentSettlement')),
    },

    //-------------批量采购-------------
    //批量采购-发起询价-
    '/bulkPurchases/initiateInquiry': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/initiateInquiry')),
    },
    //批量采购-发起询价-（带参）
    '/bulkPurchases/initiateInquiryCan/:biography': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/initiateInquiry')),
    },

    //批量采购-询价列表-
    '/bulkPurchases/inquiryList': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/inquiryList')),
    },
    //批量采购-采购列表-
    '/bulkPurchases/purchaseList': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/purchaseList')),
    },

    //批量采购 - 询价列表/采购列表 - 查看列表详情
    '/bulkPurchases/listDetails/:biography': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/listDetails')),
    },


    // //批量采购 - 发起询价/询价列表 - 询价单
    // '/bulkPurchases/inquiryForm': {
    //   component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/inquiryForm')),
    // },

    //------------增加-------
    //批量采购 - 询价中
    '/bulkPurchases/inTheInquiry/:biography': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/inTheInquiry')),
    },
    //批量采购 - 报价中/已报价（二次）/已完成
    '/bulkPurchases/quoteWithDetails/:biography': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/quoteWithDetails')),
    },
    //批量采购 - 已报价
    '/bulkPurchases/quoted/:biography': {
      component: dynamicWrapper(app, ['rolePurchaserBulkPurchases'], () => import('../roles/purchaser/bulkPurchases/quoted')),
    },

  }
}
//-------------------------------------------------------------平台------------------------------------------------------
//-------------------------------------运营-------------------------------------
export function operation (dynamicWrapper,app){
  return {
    //-----------------------------库存-----------------------------
    //库存 - 平台库存
    '/stock/platformStock': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/stock/platformStock')),
    },
    //库存 - 门店库存
    '/stock/storesStock': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/stock/storesStock')),
    },
    //-----------------------------发货-----------------------------
    //发货单表单
    '/delivery/deliveryForm': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/delivery/deliveryForm')),
    },
    //选择发货商品
    '/delivery/selectProduct': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/delivery/selectProduct')),
    },
    //选择商品返回发货单（带参）
    '/delivery/returnDeliveryForm': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/delivery/returnDeliveryForm')),
    },
    //发货列表
    '/delivery/deliveryList': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/delivery/deliveryList')),
    },
    //发货列表- 查看发货单
    '/delivery/checkDelivery': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/delivery/checkDelivery')),
    },

    //-----------------------------销售-----------------------------
    //门店销售//（查看弹窗）
    '/sales/storesSales': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/sales/storesSales')),
    },


    //-----------------------------合同-----------------------------
    //合同列表
    '/agreement/agreementList': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/agreement/agreementList')),
    },
    //创建合同
    '/agreement/createAgreement': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/agreement/createAgreement')),
    },
    //查看合同
    '/agreement/checkAgreement': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/agreement/checkAgreement')),
    },

    //-----------------------------财务-----------------------------
    //采购结算
    '/finance/purchaseSettlement': {
      component: dynamicWrapper(app, ['roleOperationDistribution'], () => import('../roles/operation/finance/purchaseSettlement')),
    },
    //手动调账（查看）
    '/finance/manualTransfer': {
      component: dynamicWrapper(app, ['roleOperationDistribution','publicDictionary'], () => import('../roles/operation/finance/manualTransfer')),
    },





    //测试demo
    '/goods/test': {
      component: dynamicWrapper(app, ['goodsManagement','publicDictionary'], () => import('../routes/GoodsManagement/test')),
    },


  }
}
//-------------------------------------财务角色-------------------------------------
export function finance (dynamicWrapper,app){
  return {
    //-----------------------------平台-财务角色-结算管理-----------------------------
    // 供货结算
    '/financialSettlement/supplySettlement': {
      component: dynamicWrapper(app, ['roleFinanceManagement'], () => import('../roles/finance/supplySettlement')),
    },
    // 采购结算
    '/financialSettlement/purchaseSettlement': {
      component: dynamicWrapper(app, ['roleFinanceManagement'], () => import('../roles/finance/purchaseSettlement')),
    },

    //-----------------------------报表管理-----------------------------
    //销售管理 - 销售日报表
    '/report/salesDayReport': {
      component: dynamicWrapper(app, ['roleFinanceManagement'], () => import('../roles/finance/supplySettlement')),
    },
  }
}



//-------------------------------------零售付款-------------------------------------
export function retail (dynamicWrapper,app){
  return {
    //  - 订单列表
    '/orderManagemen/SalesForm': {
      component: dynamicWrapper(app, ['orderManagement','publicDictionary','roleRetaiBusManagement'], () => import('../roles/retail/SalesForm')),
    },
    // - 充值记录
    '/roles/rechargeDetails': {
      component: dynamicWrapper(app, ['roleRetaiBusManagement'], () => import('../roles/retail/rechargeDetails')),
    
    },
    //- 消费明细
    '/roles/rechargeDetailsConsumption': {
      component: dynamicWrapper(app, ['roleRetaiBusManagement'], () => import('../roles/retail/rechargeDetailsConsumption')),
    
    },

    //商品管理 -商品查看  
    '/goods/goodsAboutR': {
      component: dynamicWrapper(app, ['goodsManagement','publicDictionary'], () => import('../roles/retail/goodsAboutR')),
    },

    //关注公众号 - 二维码 联系客服
    '/mediaPlatformR': {
      component: dynamicWrapper(app, [], () => import('../roles/retail/mediaPlatformR')),
    },   

  }
}
