package org.arsenij.comments.dao;

import org.arsenij.comments.model.db.Comment;
import org.arsenij.comments.model.messages.Order;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
public interface CommentDao {
    void save(Comment comment);
    
    long getCount();

    List<Comment> getComments(int limit, int offset, Order order);
}
