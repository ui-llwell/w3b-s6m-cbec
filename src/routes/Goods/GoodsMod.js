import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux, Link, withRouter } from 'dva/router';
import { Input, Button, notification,Table,Card,Form,Row, Col,Divider,Switch  } from 'antd';
import styles from '../../utils/utils.less'
import { getToken ,getAuthority} from '../../utils/Global';


const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  }
};



@connect(({ goods, loading }) => ({
  goods,
  submitting: loading.effects['goods/list'],
}))

@Form.create()

export default class GoodsList extends Component {
  state = {
    formValues: {
    },
    pagination: {
      current: 1,
      total: 10,
      pageSize: 10,
    },
  }

  componentDidMount() {
    const { formValues, pagination } = this.state;

    this.props.dispatch({
      type: 'goods/list',
      payload: {
        ...formValues,
        ...pagination,
      },
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, submitting, dispatch } = this.props;
    const { pagination } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
      };

      this.setState({
        formValues: values,
      });
      console.log(values);
      dispatch({
        type: 'goods/list',
        payload: {
          ...values,
          ...pagination,
        },
      });
    });

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      // ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'goods/list',
      payload: params,
    });
  }

  handleChangeStatus= (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/updateStatus',
      payload: {
        id: record.id,
        flag: record.flag,
      },
      callback: this.onChangeStatusCallback,
    });
  }
  onChangeStatusCallback = (params) => {
    const { formValues,pagination } = this.state;
    const { dispatch } = this.props;

    const msg = params.msg;
    if(params.type==="0"){
      notification.error({
        message: "提示",
        description: msg,
      });
    }else {
      notification.success({
        message: "提示",
        description: msg,
      });
    }

    dispatch({
      type: 'goods/list',
      payload: {
        ...formValues,
        ...pagination,
      },
    });
  }
  render(){
    const { getFieldDecorator } = this.props.form;
    const { quote: { list, pagination }, submitting }  = this.props;
    const columns = [
      {
        title: '商品编号',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '图片',
        dataIndex: 'slt',
        key: 'slt',
        render : (text, record) => <img src={`${text}`} style={{width:100,height:100}}/>
      },
      {
        title: '条码',
        dataIndex: 'barcode',
        key: 'barcode',
      },
      {
        title: '商品名称',
        dataIndex: 'goodsname',
        key: 'goodsname',
      },
      {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render:(text, record)=>
        <div>
          <Link to={`/goods/info/mod/${record.id}`}>编辑</Link>
          <Divider type="vertical" />
          {/*<Switch checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="cross" />} defaultChecked />*/}

          <Switch checkedChildren="上架"
                  unCheckedChildren="下架"
                  defaultChecked={record.flag==="0"?false:true}
                  onChange={()=>this.handleChangeStatus(record)}/>
        </div>

    }];

    return(
      <div>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <Row>
              <Row>
                <Col  xs={24} sm={24} md={24} lg={24} xl={24} >
                  <FormItem
                    {...formItemLayout}
                    label ='查询信息'
                  >
                    {getFieldDecorator('seach')(
                      <Input  placeholder="请输入商品条码，商品名称或品牌名" />)
                    }
                  </FormItem>
                </Col>
              </Row>

            </Row>
            <Row>
              <Col span={20}></Col>
              <Col span={4}><Button type="primary"
                                    className={styles.submit}
                                    htmlType="submit">搜索</Button></Col>
            </Row>
          </Form>
        </Card>
        <Card className={styles.mT10}>
          <Table dataSource={list}
                 columns={columns}
                 pagination={pagination}
                 rowKey={record => record.id}
                 onChange={this.handleStandardTableChange}
                 loading={submitting}/>
        </Card>
      </div>
    )

  }
}
