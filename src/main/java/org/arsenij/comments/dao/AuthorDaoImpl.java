package org.arsenij.comments.dao;

import org.arsenij.comments.model.db.Author;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
@Repository("authorDao")
public class AuthorDaoImpl extends AbstractDao implements AuthorDao {
    @Override
    public Author findByName(String name) {
        Query query = getSession().createQuery("from Author author where author.name = :name");
        query.setString("name", name);
        return (Author) query.uniqueResult();
    }

    @Override
    public List<Author> getAuthors() {
        Query query = getSession().createQuery("from Author author");
        return (List<Author>) query.list();
    }
}
