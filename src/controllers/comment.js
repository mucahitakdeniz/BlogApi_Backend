"use strict";

const Comment = require("../models/comment");

module.exports = {
  list: async (req, res) => {
    /*
           #swagger.tags = ["Comments"]
           #swagger.summary = "List Comments"
           #swagger.description = `
               You can send query with endpoint for search[], sort[], page and limit.
               <ul> Examples:
                   <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                   <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
                   <li>URL/?<b>page=2&limit=1</b></li>
               </ul>
           `
       */
    // const data = await req.getModelList(Comment);
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
    const data = await Comment.create(req.body);
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

    const currentComment = await Comment.findOne({ _id: req.params.id });
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
        "You must be the admin or this comment must belong to you"
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

      res.sendStatus(data.deletedCount >= 1 ? 204 : 404);
    } else {
      res.errorStatusCode = 403;
      throw new Error(
        "You must be the admin or this comment must belong to you"
      );
    }
  },
};
