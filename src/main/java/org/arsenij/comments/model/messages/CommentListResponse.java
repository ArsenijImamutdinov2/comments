package org.arsenij.comments.model.messages;

import org.arsenij.comments.model.db.Comment;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
public class CommentListResponse {
    private List<Comment> comments;
    private long total;
    private int limit;
    private int offset;

    public CommentListResponse() {
    }

    public CommentListResponse(List<Comment> comments, long total, int limit, int offset) {
        this.comments = comments;
        this.total = total;
        this.limit = limit;
        this.offset = offset;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }
}
