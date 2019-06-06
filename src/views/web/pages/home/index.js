import React, { Component } from 'react'
import {withRouter} from "react-router-dom";
import {Divider, Icon, Spin, Pagination} from 'antd';
import {translateMarkdown} from '../../../../lib/utils'
import './index.scss'
import Tags from '../../compoents/base/tags'

@withRouter
class Home extends Component {
	state = {
		articleList: [],
		loading: false,
		limit: 10,
		offset: 0,
		current: 1,
		total: 0,
		pageSize: 10,
		defaultCurrent: 1
	};
	async getArticlePageList() {
		const {limit, offset} = this.state;
		this.setState({loading: true});
		let res = await this.$webApi.getArticlePageList({limit, offset});
		if (res.flags === 'success') {
			let result = res.data;
			this.setState({articleList: [], total: 0});
			if (result) {
				let items = result.items;
				if (items && items.length) {
					items.forEach(item => {
						let index = item.content.indexOf('<!--more-->');
						item.description = translateMarkdown(item.content.slice(0, index))
					});
					items.reverse();
				}
				this.setState({articleList: items, total: result.total})
			}
		}
		this.setState({loading: false});
	}

	onShowSizeChange =  async (current, pageSize) => {
		await this.setState({current, pageSize, limit: pageSize * current, offset: pageSize * (current - 1)});
		this.getArticlePageList();
	};
	changePaginationCurrent = async (current, pageSize) => {
		await this.setState({current, limit: pageSize * current, offset: pageSize * (current - 1)});
		this.getArticlePageList();
	};

	componentDidMount() {
		this.getArticlePageList();
	}

	render() {
		const {loading, articleList, total, defaultCurrent, pageSize, current} = this.state;
		return <div className="article-content">
			<Spin tip="Loading..." className="article-content-spin" size="large" spinning={loading}/>
			<ul className="article-content__wrapper">
				{articleList.map((item, index) => (<li key={index} className="article-content-list" onClick={e => {this.props.history.push(`/article/${item.id}`)}}>
						<Divider orientation="left">
							<span className="title">{item.title}</span>
							<span className="create-time">{item.updateTime}</span>
						</Divider>
						<div className="article-detail description" dangerouslySetInnerHTML={{ __html: item.description }} />
						<div className="list-item-action">
							<Icon type="message" style={{ marginRight: 7 }} />
							{item.comments}
							<Tags type="tags" list={item.tagIds} />
							<Tags type="categories" list={item.categories} />
						</div>
				</li>))}
			</ul>
			<div className="article-content__pagination">
				<Pagination
					showSizeChanger
					onChange={this.changePaginationCurrent}
					onShowSizeChange={this.onShowSizeChange}
					current={current}
					pageSize={pageSize}
					defaultCurrent={defaultCurrent}
					total={total}/>
			</div>
		</div>
	}
}
export default Home
