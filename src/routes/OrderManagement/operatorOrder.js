import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { message,Modal,Tabs,Input,Button,Table,Card,Form,Row,Col,Select,Upload,Pagination,Badge,notification,Divider,Switch,Icon,DatePicker } from 'antd';
import OperatorOrderCheckModal from './operatorOrderCheckModal';
import styles from './operatorOrder.less';
import moment from 'moment';
import {getHeader, getToken} from "../../utils/Global";
import { getUploadUrl } from "../../services/api"
const userId = getToken().userId;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

@connect(({orderManagement,publicDictionary,  loading ,roleRetaiBusManagement }) => ({
  orderManagement,publicDictionary,roleRetaiBusManagement,
  loading: loading.effects['orderManagement/supplierOrderTable'],
}))

@Form.create()
export default class operatorOrder extends Component {
  state={
    fileList1:[],
    fileList:[],
    visibleChildCheck:false,
    visibleChildDelivery:false,
    orderId:'',
    visible: false,
    formValues:{},
    warehouseId:'',
  }
  init(){
    this.props.dispatch({
      type: 'publicDictionary/getChannelType',
      payload: {},
    });
    this.props.dispatch({
      type: 'publicDictionary/getWareHouse',
      payload: {
        //userId:userId,
      },
    });
    this.props.dispatch({
      type: 'orderManagement/supplierOrderTable',
      payload: {
        //userId:userId,
        status:"全部"
      },
    });
  }
  componentDidMount() {
    this.init();
  }
  //按钮层
  onSelectChangeWarehouse=(val)=>{
    this.setState({
      warehouseId:val
    },()=>{
      // console.log(this.state.warehouseId)
    })
  }
  downloadToSendOrder=()=>{
    if(this.state.warehouseId!==''){
      this.props.dispatch({
        type:'orderManagement/downloadToSendOrder',
        payload:{
          //userId:userId,
          wid:this.state.warehouseId
        }
      })
    }else{
      message.error('请选择仓库')
    }
  }
  downloadTemplate=()=>{
    window.location.href='http://llwell-b2b.oss-cn-beijing.aliyuncs.com/templet/order.xlsx'
  }
  // 导入订单
  handleUploadChange1=(info)=>{
    if(info.file.status === 'done') {
      this.props.dispatch({
        type: 'orderManagement/uploadOrderbill',
        payload: {
          //userId:userId,
          fileTemp: info.file.response.fileName[0]
        },
        callback: this.onUploadCallback,

      });
    }

  }
  // 导入运单
  handleUploadChange=(info)=>{
    if(info.file.status === 'done') {
      this.props.dispatch({
        type: 'orderManagement/uploadWaybill',
        payload: {
          //userId:userId,
          fileTemp: info.file.response.fileName[0]
        },
        callback: this.onUploadCallback,

      });
    }
  }
  onUploadCallback = (params) => {
    const msg = params.msg;
    if(params.type==="0"){
      message.error(msg);
    }else {
      message.success("上传成功");
    }
    this.init();

  }
  //列表
  onSearch=(e)=>{
    e.preventDefault();
    const {orderManagement:{supplierOrder:{tableData}}}=this.props
    this.props.form.validateFields((err, fieldsValue) => {

      if (err) return;
      const rangeValue = fieldsValue['date'];
      const values = rangeValue==undefined ? {
        ...fieldsValue,
      }:{
        ...fieldsValue,
        'date': rangeValue==''?[]:[rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      };

      this.setState({
        formValues: values,
      });
      this.props.dispatch({
        type: 'orderManagement/supplierOrderTable',
        payload: {
          //userId:userId,
          ...values,
          ...tableData.pagination
        },
      });
    });


  }
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.init();
  }
  //导出订单
  exportOrders =()=>{
    this.props.dispatch({
      type:'orderManagement/exportOrders',
      payload:{
        ...this.state.formValues,
       // userId:userId,
      }
    })
  }
  handleTableChange=(pagination, filtersArg, sorter)=>{
    const params = {
      ...this.state.formValues,
      ...pagination,
      //userId:userId
    };
    this.props.dispatch({
      type: 'orderManagement/supplierOrderTable',
      payload: params,
    });
  }


  handleVisible = (flag,who) => {
    if(who=='childCheck'){
      this.setState({
        visibleChildCheck:!!flag,
      });
    }else if(who=='childDelivery'){
      this.setState({
        visibleChildDelivery:!!flag,
      });
    }
  }
  handleChildrenCheck =(record)=>{
    this.props.dispatch({
      type: 'orderManagement/supplierOrderChildCheck',
      payload: {
        orderId:record.merchantOrderId,
      },
    });
    setTimeout(()=>{
      this.handleVisible(true,'childCheck');
    },0)
  }
  handleChildrenCustoms =(record)=>{
    this.props.dispatch({
      type: 'orderManagement/operatorCustoms',
      payload: {
        orderId:record.merchantOrderId,
        // orderId:"SH20180913112913284028",
      },
    });
  }
  handleChildrenDelivery=(record)=>{
    this.setState({
      orderId:record.merchantOrderId
    })
    const { orderManagement:{supplierOrder:{tableData},wareHouseData,expressArr} } = this.props;
    this.handleVisible(true,'childDelivery');
    //快递选择
    this.props.dispatch({
      type:'publicDictionary/getExpress',
      payload:{}
    })
  }
  //点击同意退货
  handleAgreedToReturn = (record) => {
    const { orderManagement:{supplierOrder:{agreedToReturn,orderId}} } = this.props;
    this.props.dispatch({
      type:'orderManagement/getAgreedToReturnR',
      payload:{
        id:record.merchantOrderId
      }
    })
    this.props.dispatch({
      type:'orderManagement/getOpenAgreedToReturn',
      payload:{
        id:record.merchantOrderId
      }
    })
    this.props.dispatch({
      type:'orderManagement/getReGoodsMessage',
      payload:{
        parentOrderId:record.merchantOrderId
      }
    })
    

  }

  //点击填写运单
  handleCompleteReturn = (record) => {

    //console.log('go')

    this.props.dispatch({
      type:'orderManagement/getAgreedToReturnR',
      payload:{
        id:record.merchantOrderId
      }
    })
    this.props.dispatch({
      type:'orderManagement/getOpenCompleteReturnR',
      payload:{
        // id:record.merchantOrderId
      }
    })
    //快递选择
    this.props.dispatch({
      type:'publicDictionary/getExpress',
      payload:{}
    })

    
    this.props.dispatch({
      type:'roleRetaiBusManagement/getReGoodsFundIdMessage',
      payload: {
        parentOrderId:record.merchantOrderId,
        
      }
    });

  }

  //点击完成退款
  handleReturnRoods = (record) => {
    
    this.props.dispatch({
      type:'orderManagement/getAgreedToReturnR',
      payload:{
        id:record.merchantOrderId
      }
    })
    this.props.dispatch({
      type:'orderManagement/getOpenReturnGoods',
      payload:{
      }
    })

  }


  renderAdvancedForm(){
    const { publicDictionary:{purchaseArr,channelTypeArr,supplierArr,wareHouseArr,expressArr} }= this.props;
    const { orderManagement:{supplierOrder:{tableData}} } = this.props;
   

    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('status',{
                initialValue:'全部'
              })(
                <Select
                  placeholder="请选择"
                  optionFilterProp="label"
                  // onChange={this.onSelectChange}
                >
                  {/* <Option value="全部">全部</Option>
                  <Option value="0">未支付</Option>
                  <Option value="1">新订单</Option>
                  <Option value="2">等待发货</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">等待签收</Option>
                  <Option value="5">已完成</Option>
                  <Option value="6">待处理</Option>
                  <Option value="-1">已关闭</Option> */}
                  <Option value="全部">全部</Option>
                  <Option value="0">未支付</Option>
                  <Option value="1">已付款</Option>
                  <Option value="2">等待发货</Option>
                  <Option value="3">已发货</Option>
                  <Option value="4">等待签收</Option>
                  <Option value="5">已完成</Option>
                  <Option value="6">申请退款</Option>
                  <Option value="7">同意退货</Option>
                  <Option value="-1">已关闭</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单编号">
              {getFieldDecorator('orderId')(
                <Input placeholder="请输入订单编号" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运单编号">
              {getFieldDecorator('waybillno')(
                <Input placeholder="请输入运单编号" />
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem
              label="平台渠道"
            >
              {getFieldDecorator('platformId')(
                <Select
                  placeholder="请选择渠道商"
                >
                  {channelTypeArr.map(val => <Option key={val.platformId} value={val.platformId} label={val.platformType}>{val.platformType}</Option>)}

                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="供应商">
              {getFieldDecorator('supplier')(
                <Input placeholder="请输入供应商账号/公司名称/邮箱/手机号" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单日期">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }}  placeholder={['起始时间', '终止时间']} />
              )}
            </FormItem>
          </Col>

        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
          </Col>
          <Col md={8} sm={24}>
          </Col>
          <Col md={8} sm={24}>
            <span style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.exportOrders} disabled={tableData.pagination.total<=0} >导出订单</Button>
          </span>
          </Col>
        </Row>
        <Divider dashed />
        <div style={{ overflow: 'hidden',marginBottom:10,fontSize:16 }}>
          <div style={{ float: 'right' }}>
            <span> 共查询出符合条件的数据：{tableData?tableData.pagination.total:0}， </span>
            <span>总销量：{tableData.item?tableData.item.totalSales :0}， </span>
            <span>总订单额：¥{tableData.item?tableData.item.totalTradeAmount :0} </span>
          </div>
        </div>
      </Form>
    );
  }
  render() {
    const { publicDictionary:{purchaseArr,channelTypeArr,supplierArr,wareHouseArr,expressArr} }= this.props;
    const { orderManagement:{supplierOrder:{tableData}} } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...tableData.pagination,
    }
    const columns = [
      {
        title: '序号',
        dataIndex: 'keyId',
        key: 'keyId',
      }, {
      title: '订单日期',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
    }, {
      title: '订单编号',
      dataIndex: 'merchantOrderId',
      key: 'merchantOrderId',
    }, {
      title: '订单额',
      dataIndex: 'tradeAmount',
      key: 'tradeAmount',
      }, {
        title: '供应商',
        dataIndex: 'supplier',
        key: 'supplier',
      }, {
        title: '分销渠道',
        dataIndex: 'purchase',
        key: 'purchase',
      }, {
        title: '所在仓库',
        dataIndex: 'warehouseName',
        key: 'warehouseName',
      }, {
      title: '运单编号',
      dataIndex: 'waybillno',
      key: 'waybillno',
    }, {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
    },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (val,record) =>
          <div>
            <a href="javascript:;" onClick={()=>this.handleChildrenCheck(record)}>订单详情</a><br/>
            <a href="javascript:;" onClick={()=>this.handleChildrenCustoms (record)}>清关信息</a><br/>
            {record.ifSend=='1'?
            <a href="javascript:;" onClick={()=>this.handleChildrenDelivery(record)}>发货<br/></a>:''}
            {
              record.ifAgree==1?
              <a href="javascript:;" onClick={()=>this.handleAgreedToReturn(record)}>退货审批<br/></a>:''
            }
            {
              record.ifFinish==1?
              <a href="javascript:;" onClick={()=>this.handleCompleteReturn(record)}>填写运单<br/></a>:''
            }
            {
              record.ifFinish==1?
              <a href="javascript:;" onClick={()=>this.handleReturnRoods(record)}>退货完成<br/></a>:''
            }
          </div>
      }
    ];
    const {visibleChildCheck,visibleChildDelivery} = this.state;
    const parent  = {
      visible:visibleChildCheck,
      handleVisible : this.handleVisible,
    };
    const ChildrenDeliveryParent  = {
      visible:visibleChildDelivery,
      handleVisible : this.handleVisible,
      expressArr:expressArr,
      dispatch:this.props.dispatch,
      orderId:this.state.orderId
    };
    const props1 = {
      action: getUploadUrl(),
      headers: getHeader(),
      showUploadList: false,
      // listType: 'picture',
      // data:{
      //   userId:userId
      // },
      // accept:'image/*',
      onChange: this.handleUploadChange1,
      multiple: false,
      // customRequest:this.upload,
    };
    const props = {
      action: getUploadUrl(),
      headers: getHeader(),
      showUploadList: false,
      // listType: 'picture',
      // data:{
      //   userId:userId
      // },
      // accept:'image/*',
      onChange: this.handleUploadChange,
      multiple: false,
      // customRequest:this.upload,
    };
    return (
      <div>
        <Card className={styles.mT10}>
          <div>

            {/*<Button  type="primary" onClick={this.downloadTemplate}>*/}
              {/*<Icon type="download" />下载订单模板*/}
            {/*</Button>*/}
            <Upload {...props1} className={styles.upload}>
              <Button style={{ marginLeft: 8 }}>
                <Icon type="cloud-upload-o" /> 导入订单信息
              </Button>
            </Upload>
            <Select style={{ width: 180,marginLeft: 8 }}
                    placeholder="请选择仓库"
                    onChange={this.onSelectChangeWarehouse}>
              {wareHouseArr.map(val => <Option key={val.wid} value={val.wid} label={val.wname}>{val.wname}</Option>)}
            </Select>
            <Button style={{ marginLeft: 8 }} onClick={this.downloadToSendOrder}>
              <Icon type="cloud-download-o" />导出需发货的订单
            </Button>
            <Upload {...props} className={styles.upload}>
              <Button style={{ marginLeft: 8 }}>
                <Icon type="cloud-upload-o" /> 导入运单信息
              </Button>
            </Upload>
          </div>
          <Divider dashed />
          <div className={styles.tableListForm}>
            {this.renderAdvancedForm()}
          </div>
          <Table
            dataSource={tableData.list}
               rowKey={record => record.id}
               columns={columns}
               pagination={paginationProps}
               onChange={this.handleTableChange}
               // loading={submitting}
          />
        </Card>
        <OperatorOrderCheckModal
          parent = {parent}
        />
        <ChildrenDelivery
          parent = {ChildrenDeliveryParent}
        />
        <ChildrenCustoms />
        <AgreedToReturn />
        <CompleteReturn 
          parent = {ChildrenDeliveryParent}
        />
        <AddReturnGoods />
      </div>
    );
  }
}

@connect(({orderManagement,publicDictionary,  loading ,roleRetaiBusManagement}) => ({
  orderManagement,publicDictionary,roleRetaiBusManagement,
  loading: loading.effects['orderManagement/supplierOrderTable'],
}))
@Form.create()
class ChildrenDelivery extends React.Component {
  handleOk = (e) => {
    e.preventDefault();
    const that = this;
    this.props.form.validateFields((err, fieldsValue)=>{
      if(!err){
        this.props.parent.dispatch({
          type:'orderManagement/confirmDelivery',
          payload:{
            ...fieldsValue,
            //userId:userId,
            orderId:this.props.parent.orderId
          },
          callback:function () {
            that.props.parent.handleVisible(false,'childDelivery')
            that.props.form.resetFields();
            that.props.dispatch({
              type: 'orderManagement/supplierOrderTable',
              payload: {
               // userId:userId,
                status:"全部"
              },
            });
          }
        })
      }
    })
  }
  handleOverseas =(e)=>{
    e.preventDefault();
    const that = this;
    this.props.parent.dispatch({
      type:'orderManagement/shipmentOverseas',
      payload:{
        //userId:userId,
        orderId:this.props.parent.orderId
      },
      callback:function () {
        that.props.parent.handleVisible(false,'childDelivery')
        that.props.form.resetFields();
        that.props.dispatch({
          type: 'orderManagement/supplierOrderTable',
          payload: {
           // userId:userId,
            status:"全部"
          },
        });

      }
    })
  }
  handleCancel = (e) => {
    this.props.parent.handleVisible(false,'childDelivery')
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
   
    // const {parent:{expressArr}} = this.props
    // console.log('this.props',this.props)
    return (
      <div>
        <Modal
          title="发货"
          visible={this.props.parent.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="1" onClick={this.handleCancel}>关闭</Button>,
            <Button key="2" type="primary" onClick={this.handleOverseas}>海外出货</Button>,
            <Button key="3" type="primary" onClick={this.handleOk}>确定</Button>
          ]}
        >
        <div className={styles.tableListForm}>
          <Form onSubmit={this.handleOk} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="运单号">
                  {getFieldDecorator('waybillno',{
                    //initialValue:reGoodsFundIdMessage.expressName,
                    rules:[{
                      required:true,message:'请填写运单号',
                    }]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
            <FormItem label="快递公司">
              {getFieldDecorator('expressId',{
                  //initialValue:item.usercode,
                  //initialValue:reGoodsFundIdMessage.type==0?'':reGoodsFundIdMessage.refundId,
                  rules: [{ required: true, message: '请选择快递：' }],
                  })(
                    <Select
                    placeholder="请选择"
                    optionFilterProp="label"
                    // onChange={this.onSelectChange}
                  >
                    {this.props.parent.expressArr.map(val => <Option key={val.expressId} value={val.expressId} label={val.expressName}>{val.expressName}</Option>)}
                  </Select>
                )}


            </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
        </Modal>
      </div>
    );
  }
}


//  清关信息弹窗
@connect(({orderManagement,publicDictionary,  loading }) => ({
  orderManagement,publicDictionary,
  loading: loading.effects['orderManagement/supplierOrderTable'],
}))
@Form.create()
class ChildrenCustoms extends React.PureComponent {

  handleCancel = (e) => {
    // this.props.parent.handleVisible(false,'childCheck');
    // this.props.form.resetFields();
    this.props.dispatch({
      type:'orderManagement/changeCustomsVisibleR',
      payload:false
    })
  }

  render() {
    const {orderManagement:{customsVisible,customsInformationList}} = this.props;
    const columns = [
      {
        title: '申报时间',
        dataIndex: 'applyTime',
        key: 'applyTime',
      }, {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
      }, {
        title: '运单号',
        dataIndex: 'wayBillNo',
        key: 'wayBillNo',
      }, {
        title: '快递公司',
        dataIndex: 'logisticsName',
        key: 'logisticsName',
      }, {
        title: '清关状态',
        dataIndex: 'notes',
        key: 'notes',
      }, {
        title: '清关时间',
        dataIndex: 'ratifyDate',
        key: 'ratifyDate',
      }
    ];
    return (
      <div>
        <Modal
          width={ '100%' }
          style={{maxWidth:1200}}
          cancelText="关闭"
          // okText="提交"
          title="清关信息"

          visible={customsVisible}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>关闭</Button>
          ]}
        >
          <div>
            <Table
              dataSource={customsInformationList}
              rowKey={record => record.key}
              pagination={false}
              columns={columns}
            />

          </div>
        </Modal>
      </div>
    );
  }
}

//同意退货
@connect(({orderManagement,roleOperationDistribution,roleRetaiBusManagement }) => ({
  orderManagement,roleOperationDistribution,roleRetaiBusManagement
}))
@Form.create()
class AgreedToReturn  extends Component {
  handleCancel = () => {
    //console.log('go')
    this.props.dispatch({
      type:'orderManagement/getCloseAgreedToReturn',
    });
    
  }
  handleOk = (e) => {
    const { orderManagement:{supplierOrder:{agreedToReturn,orderId}} } = this.props;
   
    this.props.dispatch({
      type: 'orderManagement/getAgreeReGoods',
      payload: {
        parentOrderId:orderId,
      },
      callback: this.callbackType,
    });

  }

  callbackType = (params) => {
    if(params.type==1){
      //this.init()

      this.props.dispatch({
        type:'orderManagement/getCloseAgreedToReturn',
      });
      this.props.dispatch({
        type: 'orderManagement/supplierOrderTable',
        payload: {
          //userId:userId,
          status:"全部"
        },
      });
    }
  } 
  render(){
    const { orderManagement:{supplierOrder:{agreedToReturn,orderId,item}} } = this.props;
    const { getFieldDecorator } = this.props.form;
    //console.log('item',item)
    return(
      <div>
        <Modal
          visible= {agreedToReturn}
          onCancel={this.handleCancel}
          width={'55%'}
          onOk={this.handleOk}
          style={{padding:'20px'}}
        >
          <div style={{margin:'25px',fontSize:'16px'}}>
            <div style={{padding:'5px 0px',marginLeft:'300PX'}}><span style={{paddingRight:'35px'}}>采购商名:</span>{item.purchaserCode}</div>
            <div style={{padding:'5px 0',marginLeft:'300PX'}}><span style={{paddingRight:'35px'}}>采购商电话:</span>{item.purchaserTel}</div>
            <div style={{padding:'5px 0',marginLeft:'300PX'}}><span style={{paddingRight:'35px'}}>供应商名:</span>{item.customerCode}</div>
            <div style={{padding:'5px 0',marginLeft:'300PX'}}><span style={{paddingRight:'35px'}}>供应商电话:</span>{item.customerTel}</div>
            <div style={{padding:'5px 0',marginLeft:'100PX'}}><span style={{paddingRight:'5px'}}>退货理由:</span>{item.refundRemark}</div>
            <div style={{padding:'5px 0',marginLeft:'100PX'}}></div>
          </div>      
        </Modal>
      </div>
    )
  }
}

//填写运单
@connect(({orderManagement,publicDictionary,  loading ,roleRetaiBusManagement}) => ({
  orderManagement,publicDictionary,roleRetaiBusManagement,
  loading: loading.effects['orderManagement/supplierOrderTable'],
}))
@Form.create()
class CompleteReturn extends React.Component {

  handleOk = (e) => {
    const { orderManagement:{supplierOrder:{completeReturn,orderId}} } = this.props;
    // const { orderManagement:{supplierOrder:{completeReturn,orderId}} } = this.props;
    const { roleRetaiBusManagement:{SalesForm:{waybill,num}} } = this.props;
    //console.log('orderId',orderId)
    e.preventDefault();
    const that = this;
    this.props.form.validateFields((err, fieldsValue)=>{
      if(!err){
        this.props.parent.dispatch({
          type:'roleRetaiBusManagement/getReGoodsFundId',
          payload:{
            ...fieldsValue,
            parentOrderId:orderId
          },
          callback: this.callbackType,
        })
      }
    })
  }

  callbackType = (params) => {
    if(params.type==1){
      //this.init()
      this.props.dispatch({
        type:'orderManagement/getCloseCompleteReturnR',
      });
      this.props.dispatch({
        type: 'orderManagement/supplierOrderTable',
        payload: {
          //userId:userId,
          status:"全部"
        },
      });
      this.props.form.resetFields();
    }
  } 

  handleCancel = (e) => {
    // this.props.parent.handleVisible(false,'childDelivery')
    this.props.dispatch({
      type:'orderManagement/getCloseCompleteReturnR',
      payload:{
        // id:record.merchantOrderId
      }
    })
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { orderManagement:{supplierOrder:{completeReturn,orderId}} } = this.props;
    const { roleRetaiBusManagement:{SalesForm:{waybill,num,reGoodsFundIdMessage}} } = this.props;
    

    return (
      <div>
        <Modal
          title="填写运单"
          visible={completeReturn}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="1" onClick={this.handleCancel}>关闭</Button>,
      
            <Button key="3" type="primary" onClick={this.handleOk}>确定</Button>
          ]}
        >
        <div className={styles.tableListForm}>
          <Form onSubmit={this.handleOk} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={24} sm={24}>
                <FormItem label="运单号11111">
                  {getFieldDecorator('refundId',{
                    initialValue:reGoodsFundIdMessage.type==0?'':reGoodsFundIdMessage.refundId,
                    rules:[{
                      required:true,message:'请填写运单号',
                    }]
                  })(
                    <Input placeholder="请输入" />
                  )}
                </FormItem>
              </Col>
              <Col md={24} sm={24}>
            <FormItem label="快递公司">
                {getFieldDecorator('refundExpressId',{
                  initialValue:reGoodsFundIdMessage.type==0?'':reGoodsFundIdMessage.expressName,
                  rules: [{ required: true, message: '请选择快递：' }],
                  })(
                    <Select
                    placeholder="请选择"
                    optionFilterProp="label"
                    // onChange={this.onSelectChange}
                  >
                    {this.props.parent.expressArr.map(val => <Option key={val.expressId} value={val.expressName} label={val.expressName}>{val.expressName}</Option>)}
                  </Select>
                )}
            </FormItem>
              </Col>
              </Row>
          </Form>
        </div>
        </Modal>
      </div>
    );
  }
}

//完成退货弹窗
@connect(({orderManagement,roleOperationDistribution,roleRetaiBusManagement }) => ({
  orderManagement,roleOperationDistribution,roleRetaiBusManagement
}))
@Form.create()
class AddReturnGoods  extends Component {
  handleCancel = () => {
    this.props.dispatch({
      type:'orderManagement/getCloseReturnGoods',
      
    });
    
  }
  handleOk = (e) => {
    const { orderManagement:{supplierOrder:{completeReturn,orderId}} } = this.props;
   
    this.props.dispatch({
      type:'orderManagement/getMakeSureReGoods',
      payload:{
        parentOrderId:orderId
      },
      callback: this.callbackType,
    })

  }

  callbackType = (params) => {
    if(params.type==1){
      //this.init()
    
      this.props.dispatch({
        type:'orderManagement/getCloseReturnGoods',
      });
      this.props.dispatch({
        type: 'orderManagement/supplierOrderTable',
        payload: {
          //userId:userId,
          status:"全部"
        },
      });
      this.props.form.resetFields();
    }
  } 

  render(){
    const { orderManagement:{supplierOrder:{AddReturnGoods,orderId}} } = this.props;
    const { getFieldDecorator } = this.props.form;
    //console.log('ffff',num)
    return(
      <div>
        <Modal
          visible= {AddReturnGoods}
          onCancel={this.handleCancel}
          width={'55%'}
          onOk={this.handleOk}
          style={{padding:'20px'}}
        >
          
          <div style={{textAlign:'center',clear:'both',margin:'25px 0 25px 0',fontSize:'20px'}}>请确认是否收到退货</div>        
        </Modal>
      </div>
    )
  }
}