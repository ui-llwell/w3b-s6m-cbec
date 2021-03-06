import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Input,Button,Table,Card,Form,Row,Col,Select,Upload,notification,Divider,Switch,Icon,DatePicker,Modal,Checkbox,Badge } from 'antd';
import styles from './selectProduct.less';
import moment from 'moment';
import {getCurrentUrl, getUploadUrl} from '../../../services/api'
import {getHeader, getToken} from "../../../utils/Global";
const userId = getToken().userId;
import {message} from "antd/lib/index";

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
@connect(({roleOperationDistribution,publicDictionary }) => ({
  roleOperationDistribution,publicDictionary
}))
// --------  --------------
    // 发货管理 - 选择发货
@Form.create()
export default class selectProduct extends Component {
  state={
    formValues:{},
    checked: true,
    disabled: false,
  }

  //****/
  init(){
    if(this.props.roleOperationDistribution.selectProduct.tableData.item.usercode == undefined){
      this.props.dispatch(routerRedux.push('/delivery/deliveryForm/' ));
    }
    this.props.dispatch({
      type: 'publicDictionary/getGoodsWareHouse',
      payload: {
        userId:userId,
      },
    });
  }
  componentDidMount() {
    this.init();
  }
  onSearch=(e)=>{
    e.preventDefault();
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
        type: 'roleOperationDistribution/getChooseShipmentData',
        payload: {
          ...values,
          usercode:this.props.roleOperationDistribution.selectProduct.usercode,
          id:this.props.roleOperationDistribution.selectProduct.tableData.item.id,
          isDelete:'0',
        },
      });
    });
  }
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.setState({
      formValues: {},
      sortedInfo: null,
    });
    this.init();
  }
  //翻页
  handleTableChange=(pagination, filters, sorter)=>{
   // console.log(11111,this.props.roleOperationDistribution.selectProduct.tableData.item.id)
    const params = {
      ...pagination,
      ...this.state.formValues,
    };
    this.props.dispatch({
      // type: 'roleOperationDistribution/Warehouse/DeliverOrderList',
      type: 'roleOperationDistribution/getChooseShipmentData',
      //payload: params,
      payload: {
        // ...values,
        current:params.current,
        pageSize:params.pageSize,
        usercode:this.props.roleOperationDistribution.selectProduct.usercode,
        id:this.props.roleOperationDistribution.selectProduct.tableData.item.id,
        isDelete:'0',
      },
    });
  }
  handleVisible = (flag,who) => {
    this.setState({
      visibleChildCheck:!!flag,
    });
  }

  //勾选
  Checklist = (e, record, index)=>{
    this.props.dispatch({
      type: 'roleOperationDistribution/getChecklist',
      payload: {
        id: this.props.roleOperationDistribution.selectProduct.tableData.item.id,
        usercode:this.props.roleOperationDistribution.selectProduct.usercode,
        ischoose:e.target.checked,
        barcode:record.barcode
      },
    });
  }
  //点击发货单
  handleInvoice = () => {
    this.props.dispatch({
      type: 'roleOperationDistribution/getPaging',
      payload: {
        id: this.props.roleOperationDistribution.selectProduct.tableData.item.id,
      },
    });
    //  this.props.dispatch(routerRedux.push('/delivery/deliveryForm/' ));
    this.props.dispatch(routerRedux.push('/delivery/returnDeliveryForm' ));  
  }

  renderForm(){
    const { roleOperationDistribution:{selectProduct:{dotNum,item}} } = this.props;
    const { roleOperationDistribution:{selectProduct:{tableData}} } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { publicDictionary:{wareHouseGoodsArr} } = this.props;
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={2} sm={24}>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="仓库：">
              {getFieldDecorator('warehouse',{
                })(
                  <Select
                    placeholder="请选择"
                    optionFilterProp="label"
                  >
                    {this.props.roleOperationDistribution.selectProduct.tableData.item.list.map(val => <Option key={val} value={val} label={val}>{val}</Option>)}
                  </Select>
                )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="供货商：">
              {getFieldDecorator('supplierName')(
                <Input style={{ width: '100%' }} placeholder="可输入供货商名称进行查询" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <FormItem label="商品：">
              {getFieldDecorator('select')(
                <Input style={{ width: '100%' }} placeholder="可输入商品条码，商品名称，商品品牌进行查询" />
              )}
            </FormItem>
          </Col>
          <Col md={5} sm={24}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
          <Col md={2} sm={24}>
          </Col>
        </Row>
        <Divider dashed />
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <div style={{ float: 'right' }}>
            <span>共查询出符合条件的数据：{tableData?tableData.pagination.total:0}条，</span>
          </div>
        </Row>
        <div className={styles.recordNum} style={{ marginBottom:10,fontSize:16 }}>
          <div className={styles.recordNum_w}  style={{ float: 'float' }}>
            <div className={styles.recordNum_num}>{ dotNum}</div>

            {/* <div className={styles.recordNum_num}>{ this.props.roleOperationDistribution.selectProduct.msg ==undefined?item.num:this.props.roleOperationDistribution.selectProduct.msg}</div> */}
            <div></div>
            <Button onClick={this.handleInvoice} type="primary" icon="form">发货单</Button>
          </div>
          
        </div>
      </Form>
    );
  }

  render() {
    const { roleOperationDistribution:{selectProduct:{tableData:{list, pagination}}} } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange
    };
    const columns = [
      {
        title: '选择',
        dataIndex: 'qq',
        key: 'qq',
        render: (text, record, index) => {
          return (
            <Fragment>
              {/* <a href="javascript:;" onClick={(e) => this.handleDelCheck(e, record, index)}>删除</a><br/> */}
              <Checkbox
                onChange={(e) => this.Checklist(e, record, index)}
                defaultChecked = {record.ischoose}
              >
              </Checkbox>
            </Fragment>
          )
        }
      },
    {
      title: '序号',
      dataIndex: 'keyId',
      key: 'keyId',
    }, {
      title: '供货商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    }, {
      title: '仓库',
      dataIndex: 'warehouse',
      key: 'warehouse',
    }, {
      title: '商品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',

    },{
      title: '商品条码',
      dataIndex: 'barcode',
      key: 'barcode',

    },{
      title: '规格',
      dataIndex: 'model',
      key: 'model',

    },{
        title: '原产地',
        dataIndex: 'country',
        key: 'country',
      },{
        title: '生产商',
        dataIndex: 'brand',
        key: 'brand',

      },{
        title: '库存数量',
        dataIndex: 'pNum',
        key: 'pNum',
      },{
        title: '零售价',
        dataIndex: 'rprice',
        key: 'rprice',
      },{
        title: '平台采购价',
        dataIndex: 'inprice',
        key: 'inprice',
      },{
        title: '库存同步时间',
        dataIndex: 'time',
        key: 'time',
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
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
          </div>
          <Table dataSource={list}
                 // scroll={{ x: 1500}}
                 rowKey={record => record.keyId}
                 columns={columns}
                 pagination={paginationProps}
                 onChange={this.handleTableChange}
          />
        </Card>
      </div>
    );
  }

}


