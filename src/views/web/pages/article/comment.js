import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withRouter} from "react-router-dom";
import { connect } from 'react-redux'
import {Avatar, Button, Form, Input} from "antd";

import FormItem from '../../../admin/compoents/base/form-item'
import ArticleReply from './reply'

const TextArea = Input.TextArea;

@connect(state => ({
	userInfo: state.user.userInfo
}))
@withRouter
class ArticleComment extends Component {
	static propTypes = {
		articleId: PropTypes.number.isRequired,
		articleTitle: PropTypes.string.isRequired
	};

	state = {
		commentList: [],
		commentContent: null
	};

	getArticleCommentList = async () => {
		const {articleId} = this.props;
		let res = await this.$webApi.getArticleCommentList(articleId);
		if (res.flags === 'success') {
			this.setState({commentList: []});
			if (res.data && res.data.length) {
				this.setState({commentList: res.data.map(item => Object.assign({}, item, {isReply: false}))})
			}
		}
	};

	createArticleComment = async () => {
		const id = this.props.match.params.id;
		let res = await this.$webApi.createArticleComment(id, {content: this.state.commentContent});
		if (res.flags === 'success') {
			this.getArticleCommentList(id);
			this.setState({commentContent: null});
		}
	};

	updateCommentList = commentList => {
		this.setState({commentList})
	};

	componentDidMount = () => {
		this.getArticleCommentList();
	};

	componentWillReceiveProps = nextProps => {
		const {articleId} = nextProps;
		if (articleId !== this.props.articleId) {
			this.getArticleCommentList();
		}
	};



	render() {
		const {articleTitle, userInfo} = this.props;
		const {commentList} = this.state;
		return articleTitle ? <div className="comments">
			<FormItem labelWidth={40}>
				<div slot="label"><Avatar>{userInfo.username}</Avatar></div>
				<TextArea rows={4} value={this.state.commentContent} onInput={e => this.setState({commentContent: e.target.value})} />
			</FormItem>
			<Form.Item className="comment-confirm">
				<Button
					htmlType="submit"
					onClick={this.createArticleComment}
					type="primary">
					添加评论
				</Button>
			</Form.Item>
			<ArticleReply getCommentList={this.getArticleCommentList} updateCommentList={msg => this.updateCommentList(msg)} commentList={commentList} />
		</div> : null
	}
}

export default ArticleComment;