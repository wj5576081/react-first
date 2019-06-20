import React, {Component} from 'react';
import {Divider, Table, Drawer, Button, Input, Popconfirm } from 'antd'
import FormItem from '../../components/base/form-item'
import {getRandomColor} from '../../../../lib/utils'
import { connect } from 'react-redux'
import {getTags} from '../../../../redux/article/actions'

@connect(state => ({}), {getTags})
class TagList extends Component {
	constructor(props){
		super(props);
		this.state = {
			tableColumns : [
				{ title: 'id', dataIndex: 'id', align: 'center'},
				{ title: '名称', dataIndex: 'name', align: 'center'},
				{ title: '颜色', dataIndex: 'color', align: 'center',
					render: text => (<span style={{display: 'inline-block',backgroundColor: text, width: '12px', height: '12px', borderRadius: '50%'}}/>)},
				{ title: '更新时间', dataIndex: 'updateTime', align: 'center'},
				{ title: '创建时间', dataIndex: 'createTime', align: 'center'},
				{ title: '操作', align: 'center',  key: 'action',
					render: (value, record) => (<div>
						<button className="link-button" onClick={e => this.showEditDrawer(e, record)}>编辑</button>
						<Divider type="vertical" />
						<Popconfirm title={`确定删除标签"${record.name}"吗?`} onConfirm={this.deleteTag.bind(this, record.id)} okText="确定" cancelText="取消">
							<button className="link-button">删除</button>
						</Popconfirm>
						</div>)}],
			tableData: [],
			loading: false,
			visible: false,
			requestParams: {
				name: null,
				color: null,
				id: null
			}
		}
	}
	getTagAllList = async () => {
		this.setState({loading: true});
		let res = await this.props.getTags();
		if (res.flags === 'success') {
			let result = res.data;
			this.setState({tableData: []});
			if (result && result.length) {
				this.setState({tableData: result})
			}
		}
		this.setState({loading: false});
	};
	createTag = async () => {
		let res = await this.$webApi.createTag(this.state.requestParams);
		if (res.flags === 'success') {
			this.$toast.success('创建标签成功');
			this.getTagAllList();
			this.closeDrawer();
		}
	};

	editTag = async id => {
		let res = await this.$webApi.editTag(id, this.state.requestParams);
		if (res.flags === 'success') {
			this.$toast.success('编辑标签成功');
			this.getTagAllList();
			this.closeDrawer();
		}
	};

	deleteTag = async id => {
		let res = await this.$webApi.deleteTag(id);
		if (res.flags === 'success') {
			this.$toast.success('删除标签成功');
			this.getTagAllList();
		}
	};
	openDrawer = () => {

		this.setState({visible: true,});
	};
	closeDrawer = () => {
		this.setState({
			visible: false,
			requestParams: {
				name: null,
				color: null,
				id: null
			}
		});
	};
	saveDrawer = () => {
		let id = this.state.requestParams.id;
		if (id) {
			this.editTag(id);
			return
		}
		this.createTag();
	};

	showCreateDrawer = () => {
		this.setState({
			requestParams: Object.assign({}, this.state.requestParams, {color: getRandomColor()})
		});
		this.openDrawer()
	};

	showEditDrawer = (e, row) => {
		e.preventDefault();
		let {id, name, color} = row;
		this.setState({
			requestParams: Object.assign({}, this.state.requestParams, {id, name, color})
		});
		this.openDrawer()
	};

	componentDidMount() {
		this.getTagAllList();
	}

	render() {
		const { tableColumns, tableData, loading, visible, requestParams } = this.state;
		return <div>
			<p><Button onClick={this.showCreateDrawer} type="primary">新增标签</Button></p>
			<Table rowKey={record => record.id} columns={tableColumns} dataSource={tableData} bordered={true} loading={loading} />
			<Drawer
				title={`${requestParams.id ? '编辑' : '新增'}标签`}
				placement="right"
				width={350}
				maskClosable={false}
				onClose={this.closeDrawer}
				visible={visible}
			>
				<FormItem labelWidth={70}>
					<div slot="label">标签名称:</div>
					<Input onChange={ e => this.setState({requestParams: Object.assign({}, requestParams, {name: e.target.value})})} value={requestParams.name} placeholder="请输入标签名称" />
				</FormItem>
				<FormItem labelWidth={70}>
					<div slot="label">标签颜色:</div>
					<Input onChange={ e => this.setState({requestParams: Object.assign({}, requestParams, {color: e.target.value})})} value={requestParams.color} placeholder="请输入标签颜色" />
				</FormItem>
				<FormItem labelWidth={0}>
					<Button onClick={this.saveDrawer} type="primary">保存</Button>
					&nbsp;&nbsp;&nbsp;&nbsp;
					<Button onClick={this.closeDrawer}>取消</Button>
				</FormItem>
			</Drawer>
		</div>
	}
}

export default TagList;
