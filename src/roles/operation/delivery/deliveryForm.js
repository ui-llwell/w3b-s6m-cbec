import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Input,Button,Table,Card,Form,Row,Col,Select,Upload,notification,Divider,Switch,Icon,DatePicker,Modal,Tabs,Radio ,InputNumber,AutoComplete,Cascader

} from 'antd';
import styles from './deliveryForm.less';
import moment from 'moment';
import { getCurrentUrl } from '../../../services/api'
//import {getToken} from "../../../utils/Global";
import {message} from "antd/lib/index";
import {getUploadUrl} from '../../../services/api'
import {getHeader, getToken} from "../../../utils/Global";
const userId = getToken().userId;

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;


const confirm = Modal.confirm;

function destroyAll() {
  Modal.destroyAll();
}



@connect(({roleOperationDistribution }) => ({
  roleOperationDistribution
}))

@Form.create()
// 发货管理 - 发货单表单
export default class deliveryForm extends Component {
  state={
    formValues:{},
   // delList:[],
  // dataSource: [],
    data: [],
    value: undefined,
    value:'',
  }

  componentDidMount() {
    if(!this.props.match.params){
        this.init()
    }else{

    }
  }
  // init(){
  //   const {match,dispatch}=this.props;
  //   //console.log('fs',JSON.parse(match.params.biography))
  //   //const b=JSON.parse(match.params.biography)}
  //   const getData = JSON.parse(match.params.biography)
  //   //console.log('getData',getData)
  //   if(getData.status == 7) {
  //     this.props.dispatch({
  //       type: 'rolePurchaserBulkPurchases/getSeeData',
  //       //payload: params,
  //       payload: {
  //         purchasesn:getData.purchasesn,
  //         status:getData.status
  //       },
  //     });
  //   }
  // }



  //保存
  onPreservation=(e)=>{
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log('values',fieldsValue)

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
     
      type: 'roleOperationDistribution/getDeliverGoodsSave',
        payload: {
          ...values,
         
        },
        callback:this.onPreservationCallback
      });
    });
  }
  onPreservationCallback = (params) => {
    //console.log('xxxxparams',params.type)
    if(params.type==="1"){
      message.success("保存成功");
      this.handleFormReset()
      this.props.form.resetFields();
      this.setState({
        formValues: {},
      });
     }else{
      message.error("保存失败");
     }
  }

  //下载运单模板
  downloadTemplate=()=>{
    window.location.href='http://ecc-product.oss-cn-beijing.aliyuncs.com/templet/InquiryGoods.xlsx'
  }
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.setState({
      formValues: {},
    });
    //this.init();
  }
  //分页
  handleTableChange=(pagination, filters, sorter)=>{
    const params = {
      ...pagination,
      ...this.state.formValues,
    };
    //console.log('分页',params,pagination, filters, sorter)
    this.props.dispatch({
      //type: 'rolePurchaserBulkPurchases/getInquiryListData',
      //type: 'rolePurchaserBulkPurchases/getPagingData',
      type: 'roleOperationDistribution/getPaging',
      //payload: params,
       payload: {
         ...params,
         
       },
    });
  }

  //删除
  handleDelCheck = (e, record, index)=>{
    this.props.dispatch({
      type: 'roleOperationDistribution/deleteGoodsList',
      payload: {
        purchasesn:record.purchasesn,
        barcode:record.barcode,
        index:index
      },
    });
  }

  //提交
  handleOnSubmission = (e)=>{
    const {roleOperationDistribution:{shippingList:{tableData:{item,list, pagination}}} } = this.props;
 
   // console.log(this.props)
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      // console.log('values',fieldsValue)
      if (err) return;
      const rangeValue = fieldsValue['date'];
      const values = rangeValue==undefined ? {
        ...fieldsValue,
      }:{
        ...fieldsValue,
        //'date': rangeValue==''?[]:[rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
      };
      this.setState({
        formValues: values,
      });
      this.props.dispatch({
      type: 'roleOperationDistribution/getDeliverGoods',
         payload: {
           ...values,
        
         },
         callback: this.onSubmissionCallback
       });

    });
  }
  onSubmissionCallback = (params) => {
    //console.log('params',params.type)
    if(params.type==="1"){
      this.handleFormReset()
      this.props.form.resetFields();
      this.props.roleOperationDistribution.shippingList.tableData.list.remove
      this.setState({
        formValues: {},
      });

     }else{
     }
  }

  // 上传销售数据
  handleUploadChange=(info)=>{
   // console.log('fileTemp',info.file.response)
   //console.log('上传销售数据',this.props.roleOperationDistribution.shippingList.tableData.list != '' || true)
   
      if(info.file.status === 'done') {
        const that =  this
        if(this.props.roleOperationDistribution.shippingList.tableData.list !=''){
         // console.log(1)
        } else {
          confirm({
            title: '提示',
            content: '确定覆盖现有发货商品？',
            onOk() {
              that.props.dispatch({
                type: 'roleOperationDistribution/deliverGoodsuploadOrderbill',
                payload: {
                  purchasesn:'',
                  fileTemp: info.file.response.fileName[0]
                  //fileTemp:info.file.name
                },
                callback: that.onUploadCallback
              });
            },
            onCancel() {
              //console.log('Cancel');
            },
          });

        }
    }
  }
  onUploadCallback = (params) => {
    const msg = params.msg;
    if(params.item.type==="0"){

     message.error(params.item.msg);
    }else{
      message.success("上传成功",5);
    }
    //this.init();
  }


  handleSearch = (value) => {
    fetch(value, data => this.setState({ data }));
  }

  handleChange = (value) => {
    this.setState({ value });
  }
 


  //弹出确定
  showConfirm=() =>{
    confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
    
  }

  onChangeNum=(v)=>{
    console.log('v',v)
    this.setState({
      value: v
    },()=>{
      //console.log('bbbbbb',this.state.value)
    });
   
    }

  
//改变数量
  //onChange
  inputOnBlur = (record,val) =>{
    // console.log('record',record.barcode)
     //console.log('onchange_valuce', this.state.value)
     const {match,dispatch}=this.props;
     const getData = JSON.parse(match.params.biography)
     const b = roleOperationDistribution.shippingList.tableData.list.map((item) => {
      return {
       // demand:this.state.value,
       // price:item.supplyPrice,
       purchaseNum:this.state.value,
       supplyPrice:item.supplyPrice,
       barcode:item.barcode,
      }
     })
 
     const c =b.find(item=>
       item.barcode===record.barcode
     )
     const d = [c].map((item) => {
       // const demand
       // const price
        //return  [item.demand = item.purchaseNum,item.price = item.supplyPrice]
        return {
         // demand:this.state.value,
         // price:item.supplyPrice,
         demand:this.state.value,
         price:item.supplyPrice,
        }
       })  
     // console.log('item返回值b',b)
     // console.log('item返回值c',[c])
     // console.log('item返回值d',d)
     // console.log('purchaseNum',record.purchaseNum)  
     // console.log('this.state.value',this.state.value =='') 



    // if(this.state.value != ''){
    //   if(record.purchaseNum != this.state.value){
    //     //console.log('传数')
    //     this.props.dispatch({
    //       type: 'rolePurchaserBulkPurchases/getChangeNum',
    //       //payload: params,
    //       payload: {
    //         purchasesn:getData.purchasesn,
    //         // list:this.props.rolePurchaserBulkPurchases.listQuotedQriceOver.tableData.list,
    //         list:d,
    //         barcode:record.barcode
    //       },
    //     }); 
    //   }  
    // }  





   }  




  renderForm(){
  const { roleOperationDistribution:{shippingList:{tableData:{list, pagination,item}}} } = this.props;
  const { getFieldDecorator } = this.props.form;
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
  };
  //下拉数据
  const options = this.state.data.map(d => <Option key={d.value}>{d.text}</Option>)
    const columns = [
      {
        title: '序号',
        dataIndex: 'keyId',
        key: 'keyId',
      }, {
        title: '商品名称',
        dataIndex: 'goodsName',
        key: 'goodsName',
      }, {
        title: '商品条码',
        dataIndex: 'barcode',
        key: 'barcode',
      }, {
        title: '原产地',
        dataIndex: 'total',
        key: 'total',
      }, {
        title: '生产商',
        dataIndex: 'totala',
        key: 'totala',
      }, {
        title: '零售价',
        dataIndex: 'totalb',
        key: 'totalb',
      }, {
        title: '供货价',
        dataIndex: 'totalc',
        key: 'totalc',
      }, {
        title: '当前库存数',
        dataIndex: 'totald',
        key: 'totald',
      }, {
        title: '发货数量',
        dataIndex: 'totale',
        key: 'totale',
        render: (val,record,e) =>{
          // console.log(2,record)
           // {record.supplierNumType ==2?<a onClick={()=>this.handleDetailsCheck(record)}>详情<br/></a>:<span></span>}
           return (
            
           <InputNumber 
             // onChange={this.onChange(record)} 
              onChange={this.onChangeNum}
              onBlur={()=>this.inputOnBlur(record) }
              //  onClick={(e) => this.handleDelCheck(e, record, index)}>
              //  min={parseInt(record.minAvailableNum)} 
              //  max={parseInt(record.maxAvailableNum)} 
               defaultValue={record.purchaseNum}
             />
 
           )
         }


      }, {
        title: '安全库存数',
        dataIndex: 'totalf',
        key: 'totalf',
      },{
        title: '操作',
        dataIndex: 'goMoney',
        key: 'goMoney',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a href="javascript:;" onClick={(e) => this.handleDelCheck(e, record, index)}>删除</a><br/>
            </Fragment>
          )
        }
      }
    ];
    const props = {
      action: getUploadUrl(),
      headers: getHeader(),
      showUploadList: false,
      // listType: 'picture',
      // accept:'image/*',
      onChange: this.handleUploadChange,
      multiple: false,
      // customRequest:this.upload,
    };
    //console.log('sex',parseInt(item.sex ))
    return (
      <Form onSubmit={this.onPreservation} layout="inline">
        <div className={styles.titleName}>发货单</div>
        <div className={styles.takeGoods}>
          <span></span>
          发货人信息
        </div>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={4} sm={24}></Col>
          <Col md={8} sm={24}>

            <FormItem label="发货人：  ">
              {getFieldDecorator('contacts', {
                initialValue: item.contacts,
                rules: [{ required: true, message: '请输入姓名' }],
              })(
                <Input placeholder="请输入姓名"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发货人电话：  ">
              {getFieldDecorator('contacts', {
                initialValue: item.b,
                rules: [{ required: true, message: '请输入电话' }],
              })(
                <Input placeholder="请输入电话"/>
              )}
            </FormItem>      
          </Col>
          <Col md={4} sm={24}></Col>
        </Row>
        <div className={styles.line} style={{marginBottom:25}}></div>
        <div className={styles.takeGoods}>
          <span></span>
          快递信息
        </div>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
        <Col md={4} sm={24}></Col>
          <Col md={8} sm={24}>
            <FormItem label="快递公司：  ">
              {getFieldDecorator('contactsa', {
                initialValue: item.c,
                rules: [{ required: true, message: '请输入快递公司' }],
              })(
                <Input placeholder="请输入快递公司"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运单号：">
              {getFieldDecorator('contacts', {
                initialValue: item.d,
                rules: [{ required: true, message: '请输入运单号' }],
              })(
                <Input placeholder="请输入运单号"/>
              )}
            </FormItem>      
          </Col>
          <Col md={4} sm={24}></Col>
            
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}></Col>
          <Col md={10} sm={24}>
          
          </Col>
          <Col md={7} sm={24}></Col>
        </Row>
        <div className={styles.line} style={{marginBottom:25}}></div>
        <div className={styles.takeGoods}>
          <span></span>
          采购商信息
        </div>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={3} sm={24}></Col>
          <Col md={6} sm={24}>
            <FormItem label="采购商：">
                {getFieldDecorator('sendType',{
                  //initialValue:'1'
                  // initialValue:item.sendType==''?'1':item.sendType,
                  initialValue:1,
                  rules: [{ required: true, message: '请输入提供地点' }],
                })(
                  <Select
                      placeholder="日本提货"
                    >
                    <Option value="1">日本提货</Option>
                    <Option value="2">韩国提货</Option>
                    <Option value="3">香港提货</Option>
                    <Option value="6">国内提货</Option>
                    </Select>
                )}


                {/* {getFieldDecorator('sendType',{
                  //initialValue:'1'
                
                  rules: [{ required: true, message: '请输入提供地点' }],
                })(
                  
                  <Select
                    showSearch
                    value={this.state.value}
                    placeholder={this.props.placeholder}
                    style={this.props.style}
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    filterOption={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    notFoundContent={null}
                  >
                    {options}
                  </Select>



                )} */}
          
         


            </FormItem>      
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人：">
              {getFieldDecorator('contacts', {
                initialValue: item.e,
                rules: [{ required: true, message: '请输入联系人' }],
              })(
                <Input placeholder="请输入联系人"/>
              )}
            </FormItem>         
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人电话：">
              {getFieldDecorator('contacts', {
                initialValue: item.g,
                rules: [{ required: true, message: '请输入联系人电话' }],
              })(
                <Input placeholder="请输入联系人电话"/>
              )}
            </FormItem>  
          </Col>
          <Col md={3} sm={24}></Col>
        </Row>
        <div className={styles.line} style={{marginBottom:25}}></div>
        <div className={styles.takeGoods}>
          <span></span>
          发货商品
          <div style={{marginBottom:'35px'}}></div>
        </div>
        <div style={{marginBottom:'20px'}}>
          <Button style={{ marginLeft: 8 }} type="" onClick={this.downloadTemplate}>
            <Icon type="snippets" />选择发货商品
          </Button>        
          <Button style={{ marginLeft: 8 }} type="primary" onClick={this.downloadTemplate}>
            <Icon type="download" />下载询价模板
          </Button>
          <Upload  {...props}>
            <Button style={{ marginLeft: 8 }}>
              <Icon type="cloud-upload-o" /> 导入询价商品
            </Button>

          </Upload>
        </div>
        <Table dataSource={list}
                // showHeader={false}
                 // scroll={{ x: 1500}}
                 rowKey={record => record.keyId}
                 columns={columns}
                 pagination={paginationProps}
                 onChange={this.handleTableChange}
                 // loading={submitting}
          />
          <p onClick={this.showConfirm}>
            {/* Confirm 777*/}
          </p>
        <Row style={{marginTop:'15px', marginBottom:'5px'}}>
          <Col md={9} sm={24}></Col>
          <Col md={6} sm={24}>
            <Button style={{ marginLeft: 48 }} htmlType="submit">保存</Button>
            <Button style={{ marginLeft: 48, marginLeft:"20px"}}type="primary" onClick={this.handleOnSubmission} >提交</Button>
          </Col>
          <Col md={9} sm={24}></Col>
        </Row>
      </Form>
    );
  }

  render() {
    return (
      <div className={styles.qa}>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
          </div>
        </Card>
      </div>
    );
  }

}


