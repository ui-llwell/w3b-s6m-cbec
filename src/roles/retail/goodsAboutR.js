import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { Input,Button,Table,Card,Form,Row,Col,Select,Upload,notification,Divider,Switch,Icon,DatePicker } from 'antd';
import styles from './goodsAboutR.less';
import moment from 'moment';
import { getCurrentUrl } from '../../services/api'
import {getToken} from "../../utils/Global";
import GoodsAboutAEditModal from "./GoodsAboutAEditModal";
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const userId = getToken().userId;
@connect(({goodsManagement,publicDictionary, loading }) => ({
  goodsManagement,publicDictionary,
  loading: loading.effects['goodsManagement/getGoodsAboutData'],
}))

@Form.create()
export default class goodsAboutR extends Component {
  state={
    visible: false,
    formValues:{}
  }
  init(){
    this.props.dispatch({
      type: 'publicDictionary/getBrand',
      payload: {
        userId:userId,
      },
    });
    // this.props.dispatch({
    //   type: 'publicDictionary/getWareHouse',
    //   payload: {
    //     userId:userId,
    //   },
    // });
    this.props.dispatch({
      type: 'goodsManagement/getGoodsAboutData',
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
      // console.log('values',fieldsValue)

      if (err) return;
      const values = {
        ...fieldsValue,
      }

      this.setState({
        formValues: values,
      });
      this.props.dispatch({
        type: 'goodsManagement/getGoodsAboutData',
        payload: {
          userId:userId,
          ...values,
        },
      });
    });


  }
  handleFormReset =()=>{
    this.props.form.resetFields();
    this.init();
  }
  handleVisible = (flag) => {
    this.setState({
      visible:!!flag,
    });
  }
  handleEdit=(e, record, index)=>{
    this.props.dispatch({
      type: 'goodsManagement/getGoodsDetailsA',
      payload: {
        userId:userId,
        goodsId:record.id,
      },
    });
    this.handleVisible(true);
  }
  handleTableChange=(pagination, filtersArg, sorter)=>{
    const params = {
      ...pagination,
      ...this.state.formValues,
      userId:userId,
    };
    this.props.dispatch({
      type: 'goodsManagement/getGoodsAboutData',
      payload: params,
    });
  }
  renderAdvancedForm(){
    const { publicDictionary:{brandArr,wareHouseArr} } = this.props;
    const { goodsManagement:{goodsAboutData:{tableData:{list, pagination}}} } = this.props;
    const { getFieldDecorator } = this.props.form;
    
    return (
      <Form onSubmit={this.onSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status')(
                <Select
                  placeholder="请选择"
                  optionFilterProp="label"
                  // onChange={this.onSelectChange}
                >
                  <Option value="上架">上架</Option>
                  <Option value="下架">下架</Option>
                 
                </Select>
              )}
            </FormItem>
          </Col> */}
          <Col md={8} sm={24}>
            <FormItem label="商品编码">
              {getFieldDecorator('barcode')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>  

          <Col md={8} sm={24}>
            {/* <FormItem label="所属仓库">
              {getFieldDecorator('wid')(
                <Select
                  placeholder="请选择"
                  optionFilterProp="label"
                >
                   {wareHouseArr.map(val => <Option key={val.wid} value={val.wid} label={val.wname}>{val.wname}</Option>)}
                </Select>
              )}
            </FormItem> */}
            <FormItem label="发货方式">
              {getFieldDecorator('businessType')(
                <Select
                  placeholder="请选择"
                  optionFilterProp="label"
                  // onChange={this.onSelectChange}
                >
                  <Option value="">全部</Option>
                  <Option value="0">国内现货</Option>
                  <Option value="1">海外直邮</Option>
                  <Option value="2">保税</Option>

                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品名称">
              {getFieldDecorator('goodsName')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>

        </Row>
        
        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'left', marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </span>
        </div>
      </Form>
    );
  }

  render() {
    const { goodsManagement:{goodsAboutData:{tableData:{list, pagination},childCheckA}} } = this.props;

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
      title: '商品条码',
      dataIndex: 'barcode',
      key: 'barcode',
      render: (val,record) => (
        <div>
          <span>{val}</span>
          <img src={ record.slt} alt="" width={80} style={{marginLeft:8}}/>
        </div>
      )
    }, {
      title: '商品（SKU）',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '品牌',
      dataIndex: 'brand',
      key: 'brand',
    }, {
      title: '商品所在地',
      dataIndex: 'businessType',
      key: 'businessType',
    },{
        title: '库存',
        dataIndex: 'goodsnum',
        key: 'goodsnum',
      },{
        title: '供货价',
        dataIndex: 'price',
        key: 'price',
        render:val=>`¥${val}`
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, index) => {
          return (
            <Fragment>
              <a href="javascript:;" onClick={(e) => this.handleEdit(e, record, index)}>详情</a><br/>
            </Fragment>
          )
        }
      }
    ];
    const {visible} = this.state;
    const parent  = {
      visible:visible,
      handleVisible : this.handleVisible,
    };
    return (
      <div>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderAdvancedForm()}
            </div>
          </div>
        </Card>
        <Card className={styles.mT10}>
          <Table dataSource={list}
                 // scroll={{ x: 1500}}
                 rowKey={record => record.id}
                 columns={columns}
                 pagination={paginationProps}
                 onChange={this.handleTableChange}
                 // loading={submitting}
          />
        </Card>
        <GoodsAboutAEditModal
          parent = {parent}
        />
      </div>
    );
  }
}