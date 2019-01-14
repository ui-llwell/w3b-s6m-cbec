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

//import jsonp from 'fetch-jsonp';
import querystring from 'querystring';
import { init } from 'rollbar';
import { isRegExp } from 'util';

const userId = getToken().userId;

const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;


const confirm = Modal.confirm;

function destroyAll() {
  Modal.destroyAll();
}





@connect(({roleOperationDistribution,publicDictionary }) => ({
  roleOperationDistribution,publicDictionary
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
    valueGoodsNum:'',
    valueSafeNum:'',
    purchase:false,
    usercode:''
  }

  componentDidMount() {
    this.init()
    // if(!this.props.match.params){
    //     this.init()
    // }else{


    //}
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

  


  init(){
   // console.log()
  // console.log('shippingList',this.props.roleOperationDistribution.shippingList.tableData)
    this.props.dispatch({
      type: 'publicDictionary/getPurchaserArr',
      //payload: params,
      payload: {
        purchasesn:1,
        
      },
    });

    // 


    // console.log('fff',this.props.roleOperationDistribution)
    // if(this.props.roleOperationDistribution.shippingList.tableData.list != ''){
    //   this.props.dispatch({
    //     type: 'roleOperationDistribution/getPaging',
    //     payload: {
    //       id: this.props.roleOperationDistribution.chooseShipment.tableData.list[0].id,
    //     },
    //   });
    // }

    // this.props.dispatch({
    //   type: 'roleOperationDistribution/getSubmission',
    //   payload: {
    //    // id:this.props.roleOperationDistribution.shippingList.tableData.list[0].id,
    //     // index:index
    //   },
    // });
   

  }


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
          id:this.props.roleOperationDistribution.shippingList.tableData.list == ''?'':this.props.roleOperationDistribution.shippingList.tableData.list[0].id
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
         id:this.props.roleOperationDistribution.shippingList.tableData.list[0].id
       },
    });
  }

  //删除
  handleDelCheck = (e, record, index)=>{
    this.props.dispatch({
      type: 'roleOperationDistribution/deleteGoodsList',
      payload: {
        id:record.id,
        barcode:record.barcode,
        index:index
      },
    });
  }

  //提交
  handleOnSubmission = (e)=>{
    const {roleOperationDistribution:{shippingList:{tableData:{item,list, pagination}}} } = this.props;
 
   
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
      if(this.props.roleOperationDistribution.shippingList.tableData.list != ''){
        this.props.dispatch({
          type: 'roleOperationDistribution/getDeliverGoods',
            payload: {
              ...values,
              id:this.props.roleOperationDistribution.shippingList.tableData.list[0].id
            },
            callback: this.onSubmissionCallback
          });
      } else {
        message.error("请导入询价商品");
      }
      

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
  //选择发货
  deliverGoods = (e) => {
   
      const that =  this
      if(this.props.roleOperationDistribution.shippingList.tableData.list ==''){
        if(that.state.purchase == true){
          that.props.dispatch({
            type: 'roleOperationDistribution/getchooseShipment',
            payload: {
            
             // fileTemp: info.file.response.fileName[0],
              //usercode:"cgs",
              usercode:that.state.usercode,
              id:this.props.roleOperationDistribution.shippingList.tableData.list[0]==undefined?'':this.props.roleOperationDistribution.shippingList.tableData.list[0].id,
              isDelete:'0',



            },
            
          });
        } else {
          message.error('请填写采购商');
        }
        
      } else {
        if(that.state.purchase == true){
          confirm({
            title: '提示',
            content: '确定覆盖现有发货商品？',
            onOk() {
              that.props.dispatch({
                type: 'roleOperationDistribution/getchooseShipment',
                payload: {
                  usercode:that.state.usercode,
                  id:that.props.roleOperationDistribution.shippingList.tableData.list[0]==undefined?'':that.props.roleOperationDistribution.shippingList.tableData.list[0].id,
                  isDelete:'1',
                },
              });
            },
            onCancel() {
              //console.log('Cancel');
            },
          });
        }else {
          message.error('请填写采购商');
        }
      }
  
    
  }




  // 上传销售数据
  handleUploadChange=(info)=>{
   // console.log('fileTemp',info.file.response)
   //console.log('上传销售数据',this.props.roleOperationDistribution.D.tableData.list[0]==undefined?'':this.props.roleOperationDistribution.shippingList.tableData.list[0].id)
   
  //  console.log('xx',this.props.roleOperationDistribution.shippingList.tableData.item)
  //  console.log('qq',this.state.usercode)
      if(info.file.status === 'done') {
        const that =  this
        if(this.props.roleOperationDistribution.shippingList.tableData.list ==''){
          if(that.state.purchase == true){
            that.props.dispatch({
              type: 'roleOperationDistribution/deliverGoodsuploadOrderbill',
              payload: {
              
               // fileTemp: info.file.response.fileName[0],
                //usercode:"cgs",
                usercode:that.state.usercode,
                id:this.props.roleOperationDistribution.shippingList.tableData.list[0]==undefined?'':this.props.roleOperationDistribution.shippingList.tableData.list[0].id,
                fileTemp:info.file.name
              },
              callback: that.onUploadCallback
            });
          } else {
            message.error('请填写采购商');
          }
          
        } else {
          if(that.state.purchase == true){
            confirm({
              title: '提示',
              content: '确定覆盖现有发货商品？',
              onOk() {
                that.props.dispatch({
                  type: 'roleOperationDistribution/deliverGoodsuploadOrderbill',
                  payload: {
              
                   // fileTemp: info.file.response.fileName[0],
                    //usercode:"cgs",
                    usercode:that.state.usercode,
                    id:that.props.roleOperationDistribution.shippingList.tableData.list[0]==undefined?'':that.props.roleOperationDistribution.shippingList.tableData.list[0].id,
                    fileTemp:info.file.name
                  },
                  callback: that.onUploadCallback
                });
              },
              onCancel() {
                //console.log('Cancel');
              },
            });
          }else {
            message.error('请填写采购商');
          }

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

  onChangeNum=(v)=>{
  //  console.log('valueGoodsNum',v)
    this.setState({
      valueGoodsNum: v
    },()=>{
      //console.log('bbbbbb',this.state.value)
    });
   
    }

  
//改变数量 GoodsNum
  //onChange
  inputOnBlur = (record,val) =>{
   
    //.log('val',this.state.value)
   // console.log('record',record.id)
     const b = this.props.roleOperationDistribution.shippingList.tableData.list.map((item) => {
      return {
       // demand:this.state.value,
       // price:item.supplyPrice,
       goodsNum:this.state.valueGoodsNum, //发货数量
      // safeNum:this.state.value,  //安全数量
      // supplyPrice:item.supplyPrice,
       id:record.id,
       barcode:item.barcode,
      }
     })
     const c =b.find(item=>
       item.barcode===record.barcode
     )
    // console.log('c',c) 

    if(this.state.valueGoodsNum != ''){
      //if(record.goodsNum != this.state.value){
    //    console.log('传数')
        this.props.dispatch({
          type: 'roleOperationDistribution/getChangeNum',
          //payload: params,
          payload: {
            barcode: c.barcode,
            goodsNum: c.goodsNum,
            id: c.id
          },
        }); 
      //}  
    }  
   }  

   //记录改变SafeNum
   onChangeSafeNum=(v)=>{
  //  console.log('valueGoodsNum',v)
    this.setState({
      valueSafeNum: v
    },()=>{
      //console.log('bbbbbb',this.state.value)
    });
   
    }

//改变数量 SafeNum
  //onChange
  inputOnBlurSafeNum = (record,val) =>{
   
  //  console.log('valxxx',this.state.valueSafeNum)
   // console.log('record',record.id)
     const b = this.props.roleOperationDistribution.shippingList.tableData.list.map((item) => {
      return {
       // demand:this.state.value,
       // price:item.supplyPrice,
       safeNum:this.state.valueSafeNum, //发货数量
      // safeNum:this.state.value,  //安全数量
      // supplyPrice:item.supplyPrice,
       id:record.id,
       barcode:item.barcode,
      }
     })
     const c =b.find(item=>
       item.barcode===record.barcode
     )
   //  console.log('c',c) 

    if(this.state.valueSafeNum != ''){
      //if(record.safeNum != this.state.value){
    //    console.log('传数')
        this.props.dispatch({
          type: 'roleOperationDistribution/getChangeNum',
          //payload: params,
          payload: {
            barcode: c.barcode,
            safeNum: c.safeNum,
            id: c.id
          },
        }); 
      //}  
    }  
   }  


   

   //获取采购商

  handleSearch = (value) => {
    //console.log('handleSearch_value',value)
    fetch(value, data => this.setState({ data }));
  }

  handleChange = (value) => {
  //  console.log('value',value)
    this.setState({
      purchase:true,
      usercode:value,
    });    


  }


  renderForm(){
  const { roleOperationDistribution:{shippingList:{tableData:{list, pagination,item}}} } = this.props;

  const { publicDictionary:{purchaserArr} } = this.props;
  //console.log('XXXX',this.props.roleOperationDistribution.shippingList) 

  const { getFieldDecorator } = this.props.form;
  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...pagination,
  };
 
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
        dataIndex: 'country',
        key: 'country',
      }, {
        title: '生产商',
        dataIndex: 'brand',
        key: 'brand',
      }, {
        title: '零售价',
        dataIndex: 'rprice',
        key: 'rprice',
      }, {
        title: '供货价',
        dataIndex: 'pprice',
        key: 'pprice',
      }, {
        title: '当前库存数',
        dataIndex: 'pNum',
        key: 'pNum',
      }, {
        title: '发货数量',
        dataIndex: 'goodsNum',
        key: 'goodsNum',
        render: (val,record,e) =>{
          // console.log(2,record)
           // {record.supplierNumType ==2?<a onClick={()=>this.handleDetailsCheck(record)}>详情<br/></a>:<span></span>}
           return (
            
           <InputNumber 
             // onChange={this.onChange(record)} 
              onChange={this.onChangeNum}
              onBlur={()=>this.inputOnBlur(record) }
              //  onClick={(e) => this.handleDelCheck(e, record, index)}>
                min={parseInt(1)} 
               max={parseInt(record.pNum)+1} 
               defaultValue={record.goodsNum}
             />
           )
         }
      }, {
        title: '安全库存数',
        dataIndex: 'safeNum',
        key: 'safeNum',
        render: (val,record,e) =>{
          // console.log(2,record)
           // {record.supplierNumType ==2?<a onClick={()=>this.handleDetailsCheck(record)}>详情<br/></a>:<span></span>}
           return (
           <InputNumber 
             // onChange={this.onChange(record)} 
              onChange={this.onChangeSafeNum}
              onBlur={()=>this.inputOnBlurSafeNum(record) }
              min={parseInt(0)} 
              defaultValue={record.safeNum}
             />
           )
         }
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
              {getFieldDecorator('sendName', {
                initialValue: item.sendName,
                rules: [{ required: true, message: '请输入姓名' }],
              })(
                <Input placeholder="请输入姓名"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="发货人电话：  ">
              {getFieldDecorator('sendTel', {
                initialValue: item.sendTel,
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
              {getFieldDecorator('express', {
                initialValue: item.express,
                rules: [{ required: true, message: '请输入快递公司' }],
              })(
                <Input placeholder="请输入快递公司"/>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="运单号：">
              {getFieldDecorator('waybillNo', {
                initialValue: item.waybillNo,
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
               
                {getFieldDecorator('usercode',{
                  //initialValue:'1'
                  // initialValue:item.sendType==''?'1':item.sendType,
                  initialValue:'',
                 // placeholder:"请输入采购商",
                  rules: [{ required: true, message: '请输入采购商：' }],
                })(
                  <Select
                    showSearch
                   // value={this.state.value}
                    placeholder="请输入采购商"
                    defaultActiveFirstOption={false}
                    showArrow={false}
                    onSearch={this.handleSearch}
                    onChange={this.handleChange}
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                   // filterOption={false}
                   // notFoundContent={null}
                  >
                    {purchaserArr.map(val => <Option key={val.usercode} value={val.usercode} label={val.getName}>{val.getName}</Option>)}
                  </Select>
                )}
              
              


         


            </FormItem>      
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人：">
              {getFieldDecorator('contact', {
                initialValue: item.contact,
                rules: [{ required: true, message: '请输入联系人' }],
              })(
                <Input placeholder="请输入联系人"/>
              )}
            </FormItem>         
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="联系人电话：">
              {getFieldDecorator('getTel', {
                initialValue: item.getTel,
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
          <Button style={{ marginLeft: 8 }} type="" onClick={this.deliverGoods}>
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


