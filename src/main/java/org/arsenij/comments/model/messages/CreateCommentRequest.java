package org.arsenij.comments.model.messages;

/**
 * Created by ars on 08.06.16.
 */
public class CreateCommentRequest {
    private String authorName;
    private String text;

    public CreateCommentRequest() {
    }

    public CreateCommentRequest(String authorName, String text) {
        this.authorName = authorName;
        this.text = text;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
