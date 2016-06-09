package org.arsenij.comments.controller;

import org.arsenij.comments.model.messages.CreateCommentRequest;
import org.arsenij.comments.model.messages.Order;
import org.arsenij.comments.service.AuthorService;
import org.arsenij.comments.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class CommentController {

    private static final Logger log = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    CommentService commentService;

    @Autowired
    AuthorService authorService;

    @RequestMapping(value = "/fill", method = RequestMethod.GET)
    public ResponseEntity<?> fill() {

        commentService.addComment("ars", "test");
        commentService.addComment("ars", "test2");
        commentService.addComment("ars1", "test3");

        log.debug("Comment count " + commentService.getCount());

        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @RequestMapping(value = "/comments", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getComments(
            @RequestParam(value="limit", defaultValue= "10")
            final int limit,
            @RequestParam(value="offset", defaultValue= "0")
            final int offset,
            @RequestParam(value="order", defaultValue = "DATE_DESC")
            final String orderVal
    ) {
        try {

            final Order order = Order.valueOf(orderVal);
            return new ResponseEntity<>( commentService.getComments(limit, offset, order), HttpStatus.OK);

        } catch (Throwable th) {

            log.error("", th);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }

    @RequestMapping(value = "/authors", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> getAuthors() {
        try {
            return new ResponseEntity<>( authorService.getAuthors(), HttpStatus.OK);
        } catch (Throwable th) {
            log.error("", th);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/comments", method = RequestMethod.POST, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity<?> createComment(
            @RequestBody CreateCommentRequest request
    ) {
        try {
            commentService.addComment(request.getAuthorName(), request.getText());
            return new ResponseEntity<>( null, HttpStatus.CREATED);
        } catch (Throwable th) {
            log.error("", th);
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
