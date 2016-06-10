var Comment = React.createClass({
    render: function() {
        return (
            <div className="comment">
                <h2 className="commentAuthor">
                    { moment(this.props.date).format("DD.MM.YYYY") }  {this.props.author}
                </h2>
                <p className="comment-par">{this.props.children}</p>
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
        var classes = "commentForm";
        if(!this.props.addComment) {
            classes += " hidden"
        }
        return (
            <form className={classes} onSubmit={this.handleSubmit}>
                <div>
                    <input
                        className="common-margins"
                        type="text"
                        placeholder="Имя автора"
                        value={this.state.author}
                        onChange={this.handleAuthorChange}
                        />
                    <select
                        className="common-margins"
                        size="1"
                        defaultValue={this.chooseDefaultAuthor()}
                        onChange={this.handleAuthorListChange}
                    >
                        {authors}
                    </select>
                </div>
                <div className="common-margins">
                    <textarea
                        placeholder="Текст"
                        value={this.state.text}
                        onChange={this.handleTextChange}
                        cols="60"
                        rows="5"/>
                </div>
                <div>
                    <input className="common-margins" type="submit" value="Добавить" />
                    <input className="common-margins" type="button" value="Закрыть" onClick={this.props.close}/>
                </div>
            </form>
        );
    }
});
//<input
//    type="text"
//    placeholder="Текст"
//    value={this.state.text}
//    onChange={this.handleTextChange}
//    multiline
//    />

// <Pages limit = {this.state.limit} offset={this.state.offset} total={this.state.total}/>
var Pages = React.createClass({
    totalPages: function() {
        if (this.props.total === 0) {
            return 0;
        } else {
            var hold = Math.floor(this.props.total / this.props.limit);
            if (this.props.total % this.props.limit != 0) {
                hold += 1;
            }
            return hold
        }
    },
    currentPage: function() {
        if (this.props.total === 0) {
            return 0;
        } else {
            return Math.floor(this.props.offset / this.props.limit) + 1;
        }
    },
    render: function() {
        return (
            <span> {this.currentPage()} / {this.totalPages()} </span>
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
            total: 0,
            addComment: false,
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
                this.onCloseAddClick()
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

    onAddClick: function() {
        this.setState({addComment: true})
    },

    onCloseAddClick: function() {
        this.setState({addComment: false})
    },

    render: function() {
        return (
            <div className="commentBox">
                <h1>Цитаты</h1>
                <CommentList comments={this.state.comments} />
                <div className="sort-control">
                    <div className="selecter">
                        <span>Сортировка по: </span>
                        <select size="1" defaultValue="DATE_DESC" onChange={this.onOrderChange}>
                            <option value="DATE_DESC">По дате (убыванию)</option>
                            <option value="DATE_ASC">По дате (возрастанию)</option>
                            <option value="AUTHOR_DESC">По по автору (убыванию)</option>
                            <option value="AUTHOR_ASC">По по автору (возрастанию)</option>
                        </select>
                    </div>
                    <input type="button" value="добавить" onClick={this.onAddClick}/>
                    <CommentForm
                        onCommentSubmit={this.handleCommentSubmit}
                        authorList={this.state.authorList}
                        addComment={this.state.addComment}
                        close={this.onCloseAddClick}
                    />
                </div>
                <div>
                    <input type="button" value="назад" onClick={this.onPreviousClick}/>
                    <Pages limit = {this.state.limit} offset={this.state.offset} total={this.state.total}/>
                    <input type="button" value="вперед" onClick={this.onNextClick}/>
                </div>

            </div>
        );
    }
});

ReactDOM.render(
    <CommentBox commentUrl="/comments" authorUrl="/authors" pollInterval={2000}/>,
    document.getElementById('example')
);