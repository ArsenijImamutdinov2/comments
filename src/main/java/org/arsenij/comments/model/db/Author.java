package org.arsenij.comments.model.db;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by ars on 07.06.16.
 */
@Entity
@Table(name="Author")
public class Author {

    public Author() {
    }

    @Id
    @Column(name = "name", unique = true, nullable = false, columnDefinition = "TEXT")
    private String name;

    public Author(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
