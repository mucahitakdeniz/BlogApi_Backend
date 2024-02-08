"use strict";

//-----------------------------------
module.exports = (req, res, next) => {
  const search = req.query?.search || {};
  for (let i in search) search[i] = { $regex: search[i], $options: "i" };

  const sort = req.query.sort || {};

  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

  let page = Number(req.query?.page);
  page = (page > 0 ? page : 1) - 1;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  req.getModelList = async (Model,populate =null) => {
    return await Model.find(search).sort(sort).skip(skip).limit(limit).populate(populate)
  };
  next();
};
