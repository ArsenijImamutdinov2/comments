package org.arsenij.comments.dao;

import org.arsenij.comments.model.db.Author;
import org.arsenij.comments.model.db.Comment;
import org.arsenij.comments.model.messages.Order;
import org.hibernate.Query;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
@Repository("commentDao")
public class CommentDaoImpl extends AbstractDao implements CommentDao {

    final static private Logger log = LoggerFactory.getLogger(CommentDaoImpl.class);

    final static private String GET_QUERY = "select comment from Comment comment ";
    final static private String ORDER_DATE_ASC = " order by comment.date asc";
    final static private String ORDER_DATE_DESC = " order by comment.date desc";

    @Override
    public void save(final Comment comment) {
        persist(comment);
    }

    @Override
    public long getCount() {
        Query query = getSession().createQuery("select count(comment) from Comment comment");
        return (Long) query.uniqueResult();
    }

    @Override
    public List<Comment> getComments(final int limit, final int offset, final Order order) {

        String orderClause = "";

        switch (order) {
            case DATE_ASC:
                orderClause = ORDER_DATE_ASC;
                break;
            case DATE_DESC:
                orderClause = ORDER_DATE_DESC;
                break;
        }

        final String queryStr = GET_QUERY + orderClause;
        log.debug("HQL query " + queryStr);
        System.out.println("HQL query " + queryStr);
        Query query = getSession().createQuery(queryStr);
        query.setFirstResult(offset);
        query.setMaxResults(limit);
        return (List<Comment>) query.list();
    }
}
