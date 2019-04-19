import React, { Component } from 'react'
import {Divider, Icon} from 'antd';
import {translateMarkdown} from '../../../../lib/utils'
import './index.scss'
import Tags from '../../compoents/base/tags'
class Home extends Component {
	state = {
		articleList: [],
		total: 0,
		loading: false
	};

	async getArticleAllList() {
		let res = await this.$webApi.getArticleAllList();
		if (res.flags === 'success') {
			let result = res.data;
			this.setState({articleList: []});
			if (result && result.length) {
				result.forEach(item => {
					let index = item.content.indexOf('<!--more-->');
					item.description = translateMarkdown(item.content.slice(0, index))
				});
				this.setState({articleList: result})
			}
		}
	}

	componentDidMount() {
		this.getArticleAllList();
	}

	render() {
		const articleList = this.state.articleList;
		return <div className="article-content">
			<ul>
				{articleList.map((item, index) => <li key={index} className="article-content-list">
					<Divider orientation="left">
                        <span className="title">{item.title}</span>
						<span className="create-time">{item.createTime}</span>
					</Divider>
					<div className="article-detail description" dangerouslySetInnerHTML={{ __html: item.description }} />
					<div className="list-item-action">
						<Icon type="message" style={{ marginRight: 7 }} />
						1
						<Tags type="tags" list={item.tagIds.split(',')} />
						<Tags type="categories" list={item.categories.split(',')} />
					</div>
				</li>)}
			</ul>
		</div>
	}
}
export default Home
