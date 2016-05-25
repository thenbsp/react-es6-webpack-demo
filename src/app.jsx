import $ from 'jquery';
import Mock from 'mockjs';
import React from 'react';
import ReactDOM from 'react-dom';

import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './css/app.css';

Mock.mock('/comments', {
  'result|5-50': [{
    "id|1000-9999": 1,
    "avatar": "@image('60x60', '@color')",
    "nickname": "@cname",
    "content": "@cparagraph(1, 50)",
    "created": "@datetime",
    "like|100-3000": 1,
    "reply|10-300": 1
  }]
});

var Like = React.createClass({
  getInitialState: function() {
    return {like: this.props.like};
  },
  handleClick: function() {
    var changed = this.state.liked
      ? {}
      : {like: this.state.like + 1, liked: true}
    this.setState(changed);
  },
  render: function() {
    return (
      <a href="javascript:;" onClick={this.handleClick}
        className={this.state.liked ? "liked" : "like"}>
        <i className="glyphicon glyphicon-heart"></i>
        {this.state.like}
      </a>
    );
  }
});

var CommentAction = React.createClass({
  getInitialState: function() {
    return {
      like: this.props.like,
      liked: false,
      reply: this.props.reply
    };
  },
  render: function() {
    return (
      <div className="comment-action">
        <Like like={this.state.like} />
        <a href="javascript:;">
          <i className="glyphicon glyphicon-comment"></i>
          {this.state.reply}
        </a>
        <a href="javascript:;">
          <i className="glyphicon glyphicon-flag"></i>
          举报
        </a>
      </div>
    );
  }
});

var CommentRow = React.createClass({
  render: function() {
    return (
      <li className="comment-item">
        <img src={this.props.data.avatar} className="comment-avatar" />
        <div className="comment-outer">
          <div className="comment-head">
            <h1><a href="#">{this.props.data.nickname}</a></h1>
            <time>发表于 {this.props.data.created}</time>
          </div>
          <div className="comment-body">
            {this.props.data.content}
          </div>
          <div className="comment-foot">
            <CommentAction like={this.props.data.like} reply={this.props.data.reply} />
          </div>
        </div>
      </li>
    );
  }
});

var CommentTable = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(response) {
        this.setState({ data: response.result });
      }.bind(this)
    });
  },
  render: function() {
    return (
      <ul className="comment-list">
        {this.state.data.map(function(el) {
          return <CommentRow key={el.id} data={el} />
        })}
      </ul>
    );
  }
});

var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="comment-box">
        <div className="comment-info">
          <h1>评论列表</h1>
          <p>共计 <strong>{this.props.count}</strong> 条评论</p>
        </div>
        <CommentTable url={this.props.url} />
      </div>
    );
  }
});

ReactDOM.render(
  <CommentBox url="/comments" count="65536" />,
  document.querySelector('#container')
);
