"use strict";

const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(User);
    res.status(200).send({
      error: false,
      data,
      details: res.getModelDetailList(User),
    });
  },
  create: async (req, res) => {
    req.body.is_staff = false;
    req.body.is_superadmin = false;
    const data = await User.create(req.body);
    res.status(201).send({
      error: false,
      data,
      body: req.body,
      //token
    });
  },
  read: async (req, res) => {
    const data = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await User.updateOne({ _id: req.params.id }, req.body);
    res.status(200).send({
      error: false,
      data,
    });
  },
  delete: async (req, res) => {
    const data = await User.delete({ _id: req.params.id });

    res.status(data.deletetCount ? 204 : 404).send({
      error: !data.deletetCount,
      data,
    });
  },
};
