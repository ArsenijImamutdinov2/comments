package org.arsenij.comments.service;

import org.arsenij.comments.model.db.Author;

import java.util.List;

/**
 * Created by ars on 08.06.16.
 */
public interface AuthorService {
    List<Author> getAuthors();
}
