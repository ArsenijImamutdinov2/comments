package org.arsenij.comments.service;

import org.arsenij.comments.dao.AuthorDao;
import org.arsenij.comments.model.db.Author;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
@Service("authorService")
@Transactional
public class AuthorServiceImpl implements AuthorService {

    @Autowired
    private AuthorDao authorDao;

    @Override
    public List<Author> getAuthors() {
        return authorDao.getAuthors();
    }
}
