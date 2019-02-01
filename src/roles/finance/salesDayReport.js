import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Input,Button,Table,Card,Form,Row,Col,Select,Upload,notification,Divider,Switch,Icon,DatePicker,Modal } from 'antd';
import styles from './salesDayReport.less';
import moment from 'moment';
import {getCurrentUrl, getUploadUrl} from '../../services/api'
import {getHeader, getToken} from "../../utils/Global";
const userId = getToken().userId;
import {message} from "antd/lib/index";

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
@connect(({roleFinanceManagement }) => ({
  roleFinanceManagement,
}))
// --------  --------------
    // 报表管理 - 销售日报表
@Form.create()
export default class salesDayReport extends Component {
  state={
    formValues:{},
    visible: false,
    visibleChildCheck:false,
  }

  //****/
  init(){
    this.props.dispatch({
      type:'roleFinanceManagement/salesDayReport',
      payload:{

      }
    })
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
        type: 'roleFinanceManagement/salesDayReport',
        payload: {
          ...values,
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
    const params = {
      ...pagination,
      ...this.state.formValues,
    };
    this.props.dispatch({
      type: 'roleFinanceManagement/salesDayReport',
      payload: params,
    });
  }



  renderForm(){
    const { roleFinanceManagement:{salesDayReport:{tableData:{item}}} } = this.props;
    const { roleFinanceManagement:{salesDayReport:{tableData}} } = this.props;
    console.log('item',item)
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="">
              {getFieldDecorator('date')(
                <RangePicker style={{ width: '100%' }}  placeholder={['起始时间', '终止时间']} />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="渠道商名称：">
              {getFieldDecorator('supplierName')(
                <Input style={{ width: '100%' }} placeholder="请输入供货商名称" />
              )}
            </FormItem>
          </Col>

          <Col md={8} sm={24}>
            <FormItem label="订单编号：">
              {getFieldDecorator('select')(
                <Input style={{ width: '100%' }} placeholder="可输入商品条码，商品名称进行查询" />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
        </Row>
        <Divider dashed />
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <div style={{ overflow: 'hidden',marginBottom:10,fontSize:16 }}>
            <div style={{ float: 'right' }}>
              <span>共查询出符合条件的数据：{tableData?tableData.pagination.total:0}条，</span>
            </div>
          </div>
        </Row>
        <Row gutter={{ md: 12, lg: 24, xl: 48 }}>
          <div style={{ overflow: 'hidden',marginBottom:10,fontSize:16 }}>
            <div style={{ float: 'right' }}>
              <span>销售收入合计(元)：{item.a}{item.a}{item.a}{item.a}{item.a}{item.a}不含税收入(元)：{item.b}运费(元)：0.00服务费(元)：0.00</span>
            </div>
          </div>
        </Row>
      </Form>
    );
  }
  render() {
    const { roleFinanceManagement:{salesDayReport:{tableData:{list, pagination}}} } = this.props;
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
        render:val=>`¥${val}`
      },{
        title: '平台采购价',
        dataIndex: 'inprice',
        key: 'inprice',
        render:val=>`¥${val}`
      },{
        title: '操作',
        dataIndex: 'time',
        key: 'time',
        render: (val,record) =>
        <div>
            {/* {<a onClick={(e) => this.handleDel(e, record)}>删除</a>} */}
        </div>
      }
    ];

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
                 // loading={submitting}
          />
        </Card>
      </div>
    );
  }
   //删除
   handleDel = (e, record)=>{
    // console.log('record',record)
    this.props.dispatch({
      type: 'roleFinanceManagement/deleteList',
      payload: {
       purchasesn:record.barcode,
        //barcode:record.barcode,
        //index:index
      },
    });
  }
}


