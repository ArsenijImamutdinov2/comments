var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    { moment(this.props.date).format("DD.MM.YYYY") }  {this.props.author}
                </h2>
                {this.props.children}
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var commentNodes = this.props.comments.map(function(comment, idx) {
            return (
                <Comment author={comment.author.name} date={comment.date} key={idx}>
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
        return {author: '', text: ''};
    },

    handleAuthorListChange: function(e) {
        console.log("author list changed");
        console.log(e.target.value);
        this.setState({author: e.target.value});
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

    chooseDefaultAuthor: function() {
      if(this.props.authorList.includes(this.state.author)) {
          return this.state.author
      } else if(this.props.authorList.length < 1) {
          return "";
      } else {
          return this.props.authorList[0];
      }
    },

    render: function() {
        var authors = this.props.authorList.map(function(author, idx){
            return (
                <option value={author.name} key={idx}>{author.name}</option>
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
                <select size="1" defaultValue={this.chooseDefaultAuthor()} onChange={this.handleAuthorListChange}>
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
        return {
            comments: [],
            authorList: [],
            order: "DATE_DESC",
            limit: 3,
            offset: 0,
            total: 0
        };
    },

    loadCommentsFromServer: function() {
        this.loadCommentsFromServerWithStep(this.state.offset, this.state.order);
    },

    loadCommentsFromServerWithStep: function(newOffset, newOrder) {
        console.log("get comments offset " + newOffset);
        console.log("get comments order " + newOrder);
        $.ajax({
            url: this.props.commentUrl,
            data: {
                order: newOrder,
                limit: this.state.limit,
                offset: newOffset,
            },
            dataType: 'json',
            cache: false,
            success: function(response) {
                console.log('limit ' + response.limit);
                console.log('offset ' + response.offset);
                console.log('total ' + response.total);
                this.setState({
                    comments: response.comments,
                    limit: response.limit,
                    offset: response.offset,
                    total: response.total
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.commentUrl, status, err.toString());
            }.bind(this)
        });
    },

    loadAuthorsFromServer: function() {
        $.ajax({
            url: this.props.authorUrl,
            dataType: 'json',
            cache: false,
            success: function(response) {
                this.setState({authorList: response});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.authorUrl, status, err.toString());
            }.bind(this)
        });
    },

    handleCommentSubmit: function(comment) {
        $.ajax({
            url: this.props.commentUrl,
            type: 'POST',
            contentType:'application/json',
            data: JSON.stringify(comment),
            success: function() {
                this.loadCommentsFromServer();
                this.loadAuthorsFromServer();
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.commentUrl, status, err.toString());
            }.bind(this)
        });
    },

    onOrderChange: function(e) {
        console.log("order list changed");
        console.log(e.target.value);
        this.setState({order: e.target.value});
        this.loadCommentsFromServerWithStep(this.state.offset, e.target.value);
    },
    
    componentDidMount: function() {
        console.log("mount");
        this.loadCommentsFromServer();
        this.loadAuthorsFromServer();
        setInterval(this.loadCommentsFromServer, this.props.pollInterval);
    },

    onNextClick: function(e) {
        var newOffset = this.state.offset + this.state.limit;
        console.log("next click newOffset " + newOffset + " total " + this.state.total);
        if( newOffset <= this.state.total ) {
            this.loadCommentsFromServerWithStep(newOffset, this.state.order);
        }
    },

    onPreviousClick: function(e) {
        var newOffset = this.state.offset - this.state.limit;
        console.log("next click newOffset " + newOffset + " total " + this.state.total);
        if( newOffset < 0 ) {
            newOffset = 0;
        }
        this.loadCommentsFromServerWithStep(newOffset, this.state.order);
    },

    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList comments={this.state.comments} />
                <div>
                    <select size="1" defaultValue="DATE_DESC" onChange={this.onOrderChange}>
                        <option value="DATE_DESC">По дате (убыванию)</option>
                        <option value="DATE_ASC">По дате (возрастанию)</option>
                    </select>
                    <input type="submit" value="вперед" onClick={this.onNextClick}/>
                    <input type="submit" value="назад" onClick={this.onPreviousClick}/>
                </div>
                <CommentForm onCommentSubmit={this.handleCommentSubmit} authorList={this.state.authorList} />
            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox commentUrl="/comments" authorUrl="/authors" pollInterval={2000}/>,
    document.getElementById('example')
);