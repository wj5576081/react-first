import React, {FC, memo, ReactElement, useCallback} from "react";
import {message} from "antd";
import {CommentInfo, CommentReplyInfo, CreateArticleCommentReplyRequestBody} from "../../../../types/article";
import ArticleCommentTemp from "./articleCommentTemp";
import {
    createArticleCommentReply,
    deleteArticleComment,
    deleteArticleCommentReply
} from "../../../../service/article";

interface ArticleReplyListProps {
    id: string;
    comments: CommentInfo[];
    onSuccess: () => Promise<void>;
}

const MemoArticleCommentTemp = memo(ArticleCommentTemp);

const formatterCommentInfo = (comment: CommentInfo) => {
    const {id,userName, userId, userProfilePicture, createTime, content, reply: {likes, dislikes}} = comment;
    return {id, commentId: id, userName, userId, userProfilePicture, createTime, likes, dislikes, content}
};

const formatterReplyInfo = (reply: CommentReplyInfo) => {
    const {id, commentId, userName, userId, userProfilePicture, toUserName, createTime, likes, dislikes, content} = reply;
    return {id, commentId, userName, userId, userProfilePicture, toUserName, createTime, likes, dislikes, content}
};

const ArticleReplyList: FC<ArticleReplyListProps> = ({id, onSuccess, comments}: ArticleReplyListProps): ReactElement => {

    const fetchCreateArticleCommentReply = async (commentId: number, data: CreateArticleCommentReplyRequestBody) => {
        const {flags} = await createArticleCommentReply(commentId, {articleId: id, ...data});
        const isSuccess = flags === 'success';
        if (isSuccess && data.type === 30) {
            message.success('回复成功');
        }
        return isSuccess;
    };

    const fetchDeleteArticleComment = async (deleteCommentId: number) => {
        const {flags} = await deleteArticleComment(deleteCommentId);
        const isSuccess = flags === 'success';
        if (isSuccess) {
            message.success('删除成功');
        }
        return isSuccess;
    };

    const fetchDeleteArticleCommentReply = async (deleteReplyId: number) => {
        const {flags} = await deleteArticleCommentReply(deleteReplyId);
        const isSuccess = flags === 'success';
        if (isSuccess) {
            message.success('删除成功');
        }
        return isSuccess;
    };

    const createReplyList = (replyList: CommentReplyInfo[]) => {
        return (
            <>
                {
                    replyList.map((reply: CommentReplyInfo) => (
                        <MemoArticleCommentTemp
                          type="reply"
                          data={formatterReplyInfo(reply)}
                          onSubmit={useCallback(fetchCreateArticleCommentReply, [])}
                          onSuccess={useCallback(onSuccess, [])}
                          onDelete={useCallback(fetchDeleteArticleCommentReply, [])}
                        />
                    ))
                }
            </>
        )
    };

    const CommentList = (): ReactElement => {
        return (
            <>
                {
                    comments.map((comment: CommentInfo) => (
                        <MemoArticleCommentTemp
                          type="comment"
                          data={formatterCommentInfo(comment)}
                          onSubmit={useCallback(fetchCreateArticleCommentReply, [])}
                          onSuccess={useCallback(onSuccess, [])}
                          onDelete={useCallback(fetchDeleteArticleComment, [])}
                        >
                            {createReplyList(comment.reply.replyList)}
                        </MemoArticleCommentTemp>
                    ))
                }
            </>
        )
    };

    return (
        <CommentList />
    )
};

export default ArticleReplyList;
