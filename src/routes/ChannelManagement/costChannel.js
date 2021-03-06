import React, { Component,Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux, Link } from 'dva/router';
import { message,Modal,Tabs,Input,Button,Table,Card,Form,Row,Col,Select,Upload,Pagination,Badge,notification,Divider,Switch,Icon,DatePicker } from 'antd';
import styles from './costChannel.less';
import moment from 'moment';
import {getToken} from "../../utils/Global";
const userId = getToken().userId;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
  },
};
@connect(({channelManagement,publicDictionary,  loading }) => ({
  channelManagement,publicDictionary,
  loading: loading.effects['channelManagement/supplierOrderTable'],
}))

@Form.create()
export default class costChannel extends Component {
  state={
    visible:false,
    formValues:{},
  }
  init(){
    this.props.dispatch({
      type: 'channelManagement/getCostChannelTable',
      payload: {},
    });
  }
  componentDidMount() {
    this.init();
  }
  handleTableChange=(pagination, filtersArg, sorter)=>{
    const params = {
      ...pagination,
    };

    this.props.dispatch({
      type: 'channelManagement/getCostChannelTable',
      payload: params,
    });
  }

  handleVisible = (flag) => {
      this.setState({
        visible:!!flag,
      });
  }
  handleChildEdit =(record)=>{
    this.props.dispatch({
      type: 'publicDictionary/getChannelType',
      payload: {},
    });
    this.props.dispatch({
      type: 'channelManagement/editCostChannel',
      payload: {...record},
    });
    setTimeout(()=>{
      this.handleVisible(true);
    },0)
  }

  render() {
    const { publicDictionary:{channelTypeArr,supplierArr} }= this.props;
    const { channelManagement:{costChannel:{tableData}} } = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...tableData.pagination,
    }
    const columns = [
      {
      title: '渠道商类型',
      dataIndex: 'platformType',
      key: 'platformType',
    }, {
      title: '渠道商',
      dataIndex: 'username',
      key: 'username',
        render:val=>val?val:''
    }, {
      title: '渠道商价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      render:val=>val?['','按订单售价计算','按供货价计算'][val*1]:''
    }, {
      title: '提点类型',
      dataIndex: 'platformCostType',
      key: 'platformCostType',

      render:val=>val?['','进价基础计算','售价基础计算'][val*1]:''
    }, {
      title: '平台提点',
      dataIndex: 'platformCost',
      key: 'platformCost',
    },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (val,record) =>
          <div>
            <a href="javascript:;" onClick={()=>this.handleChildEdit(record)}>编辑</a><br/>
          </div>
      }
    ];
    const {visible} = this.state;

    const Parent  = {
      visible:visible,
      handleVisible : this.handleVisible,
      channelTypeArr:channelTypeArr,
    };

    return (
      <div>
        <Card className={styles.mT10}>
          <Table
            dataSource={tableData.list}
                 rowKey={record => record.id}
                 columns={columns}
                 pagination={paginationProps}
                 onChange={this.handleTableChange}
                 // loading={submitting}
          />
        </Card>
        <ChildEdit
          parent = {Parent}
        />
      </div>
    );
  }
}

@connect(({ channelManagement,publicDictionary, loading }) => ({
  channelManagement,publicDictionary,
  // loading: loading.effects['goods/'],
}))
@Form.create()

class ChildEdit extends React.Component {

  handleOk = (e) => {
    const { publicDictionary:{purchaseArr,channelTypeArr,supplierArr} }= this.props;
    const {channelManagement:{costChannel:{childEdit}}} = this.props
    e.preventDefault();
    const that = this;
    this.props.form.validateFields((err, fieldsValue)=>{
      // console.log('fieldsValue',fieldsValue)
      if(!err){
        this.props.dispatch({
          type:'channelManagement/saveCostChannel',
          payload:{
            ...fieldsValue,
            // userId:userId,
            id:childEdit.id
          },
          callback:function () {
            that.props.parent.handleVisible(false)
            that.props.form.resetFields();
            that.props.dispatch({
              type: 'channelManagement/getCostChannelTable',
              payload: {},
            });
          }
        })
      }
    })
  }

  handleCancel = (e) => {
    this.props.parent.handleVisible(false,'childDelivery')
    this.props.form.resetFields();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const {channelManagement:{costChannel:{childEdit}}} = this.props
    return (
      <div>
        <Modal
          width={ '100%' }
          style={{maxWidth:1000}}
          title="渠道商费用及基础信息"
          visible={this.props.parent.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="1" onClick={this.handleCancel}>关闭</Button>,
            <Button key="3" type="primary" onClick={this.handleOk}>确定</Button>
          ]}
        >
        <div className={styles.tableListForm}>
          <Form onSubmit={this.handleOk} layout="inline">
            <Row type="flex" justify="space-around" gutter={8}>
              <Col span={11} >
                <FormItem
                  {...formItemLayout}
                  label="渠道商"
                >
                  {getFieldDecorator('username')(
                    <div>{childEdit.username}</div>
                    // <Input placeholder="请输入渠道商"/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} >
                <FormItem
                  {...formItemLayout}
                  label="渠道商类型"
                >
                  {getFieldDecorator('platformId')(
                    <div>{childEdit.platformType}</div>
                    // <Select
                    //   placeholder="请选择渠道商"
                    //   // onChange={this.handleSelectChange}
                    // >
                    //
                    //   {channelTypeArr.map(val => <Option key={val.platformId} value={val.platformId} label={val.platformType}>{val.platformType}</Option>)}
                    //
                    // </Select>
                  )}
                </FormItem>
              </Col>

            </Row>
            <Row type="flex" justify="space-around" gutter={8}>
              <Col span={11} >
                <FormItem
                  {...formItemLayout}
                  label="渠道商价格类型"
                >
                  {getFieldDecorator('priceType', {
                    initialValue: childEdit.priceType,
                    rules: [{ required: true, message: '请选择渠道商价格类型' }],
                  })(
                    <Select
                      placeholder="请选择渠道商价格类型"
                      // onChange={this.handleSelectChange}
                    >
                      <Option value="1">按订单售价计算</Option>
                      <Option value="2">按供货价计算</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={11} >
                <FormItem
                  {...formItemLayout}
                  label="提点类型"
                >
                  {getFieldDecorator('platformCostType',{
                    initialValue: childEdit.platformCostType,
                    rules: [{ required: true, message: '请选择提点类型' }],
                  })(
                    <Select
                      placeholder="请选择提点类型"
                      // onChange={this.handleSelectChange}
                    >
                      <Option value="1">进价基础计算</Option>
                      <Option value="2">售价基础计算</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row type="flex" justify="space-around" gutter={8}>
              <Col span={11} >
                <FormItem
                  {...formItemLayout}
                  label="平台提点（%）"
                >
                  {getFieldDecorator('platformCost', {
                    initialValue: childEdit.platformCost,
                    rules: [{ required: true, message: '请输入平台提点（%）' }],
                  })(
                    <Input placeholder="请输入平台提点（%）"/>
                  )}
                </FormItem>
              </Col>
              <Col span={11} >

              </Col>
            </Row>
          </Form>
        </div>
        </Modal>
      </div>
    );
  }
}
