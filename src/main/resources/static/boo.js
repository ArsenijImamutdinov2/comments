var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    {this.props.author}   { moment(this.props.date).format("DD.MM.YYYY") }
                </h2>
                {this.props.children}
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.comments.map(function(comment) {
            return (
                <Comment author={comment.author.name} date={comment.date} key={comment.id}>
                    {comment.text}
                </Comment>
            );
        });
        return (
            <div className="commentList">
                {commentNodes}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    getInitialState: function() {
        return {author: '', text: '', authorList: [{name: "asdf"}, {name: "bghn"}]};
    },
    handleAuthorChange: function(e) {
        this.setState({author: e.target.value});
    },
    handleTextChange: function(e) {
        this.setState({text: e.target.value});
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var author = this.state.author.trim();
        var text = this.state.text.trim();
        if (!text || !author) {
            return;
        }
        this.props.onCommentSubmit({authorName: author, text: text});
        this.setState({author: '', text: ''});
    },
    render: function() {
        var authors = this.state.authorList.map(function(author, idx){
            return (
                <option selected={idx === 0} value={author.name}>{author.name}</option>
            );
        });
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.handleAuthorChange}
                    />
                <select size="1">
                    {authors}
                </select>
                <input
                    type="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.handleTextChange}
                    />
                <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return {comments: []};
    },
    loadCommentsFromServer: function() {
        $.ajax({
            url: this.props.url,

            dataType: 'json',
            cache: false,
            success: function(response) {
                this.setState({comments: response.comments});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleCommentSubmit: function(comment) {
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(comment),
            success: function() {
                this.loadCommentsFromServer();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList comments={this.state.comments} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox url="/comments" pollInterval={2000}/>,
    document.getElementById('example')
);