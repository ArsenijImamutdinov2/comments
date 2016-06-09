package org.arsenij.comments.service;

import org.arsenij.comments.model.messages.Order;
import org.arsenij.comments.model.messages.CommentListResponse;

/**
 * Created by ars on 08.06.16.
 */
public interface CommentService {
    void addComment(String authorName, String text);

    long getCount();

    CommentListResponse getComments(int limit, int offset, Order order);
}
