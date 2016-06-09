package org.arsenij.comments.service;

import org.arsenij.comments.dao.AuthorDao;
import org.arsenij.comments.dao.CommentDao;
import org.arsenij.comments.model.db.Author;
import org.arsenij.comments.model.db.Comment;
import org.arsenij.comments.model.messages.CommentListResponse;
import org.arsenij.comments.model.messages.Order;
import org.joda.time.DateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
@Service("commentService")
@Transactional
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentDao commentDao;

    @Autowired
    private AuthorDao authorDao;

    @Override
    public void addComment(final String authorName, final String text) {
        commentDao.save(new Comment(text, DateTime.now(), findOrCreateAuthor(authorName)));
    }

    private Author findOrCreateAuthor(final String name) {
        final Author author = authorDao.findByName(name);
        if (author == null) {
            return new Author(name);
        } else {
            return author;
        }
    }

    @Override
    public long getCount() {
        return commentDao.getCount();
    }

    @Override
    public CommentListResponse getComments(final int limit, final int offset, final Order order) {

        return new CommentListResponse(
                commentDao.getComments(limit, offset, order),
                commentDao.getCount(),
                limit,
                offset
        );
    }
}
