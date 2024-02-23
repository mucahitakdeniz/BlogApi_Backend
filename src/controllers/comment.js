"use strict";

const Comment = require("../models/comment");
const Blog = require("../models/blog");

module.exports = {
  list: async (req, res) => {
    /*
           #swagger.tags = ["Comments"]
           #swagger.summary = "List Comments"
          
       */
    const data = await Comment.find();
    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Create Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "content": "...comment...",
                    "author_id": "user_id",
                    "blog_id": "blog_id",
                }
            }
        */
    req.body.author_id = req?.user?._id;
    const data = await Comment.create(req.body);
    if (data) {
      const updateBlog = await Blog.updateOne(
        { _id: data.blog_id },
        {
          $inc: { comment_count: 1 },
        }
      );
    }
    res.status(201).send({
      error: false,
      result: data,
      send: req.body,
    });
  },
  update: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Update Comment"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "content": "...comment...",
                    "author": "user_id",
                    "blog_id": "blog_id",

                }
            }
        */

    const currentComment = await Comment.findOne({
      _id: req.params.id,
    });
    if (req.user._id == currentComment._id || req.user.is_admin) {
      const data = await Comment.updateOne({ _id: req.params.id }, req.body);
      res.status(202).send({
        error: false,
        result: data,
        send: req.body,
        newedata: await Comment.findOne({ _id: req.params.id }),
      });
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "Uyarı ! Yalnızca admin veya yorum sahibi bu işlemi yapabilir"
      );
    }
  },
  delete: async (req, res) => {
    /*
            #swagger.tags = ["Comments"]
            #swagger.summary = "Delete Comment"
        */

    const currentComment = await Comment.findOne({ _id: req.params.id });
    if (req.user._id == currentComment._id || req.user.is_admin) {
      const data = await Comment.deleteOne({ _id: req.params.id });
      if (data.deletedCount >= 1) {
        await Blog.updateOne(
          { _id: currentComment.blog_id },
          {
            $inc: { comment_count: -1 },
          }
        );
      }

      res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "Uyarı ! Yalnızca admin veya yorum sahibi bu işlemi yapabilir"
      );
    }
  },
};
