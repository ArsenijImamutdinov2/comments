package org.arsenij.comments.dao;

import org.arsenij.comments.model.db.Author;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */

public interface AuthorDao {
    Author findByName(String name);

    List<Author> getAuthors();
}
