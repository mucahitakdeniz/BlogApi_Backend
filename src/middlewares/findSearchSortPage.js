"use strict";

module.exports = (req, res, next) => {
  let search = req.query?.search || {};
  for (let i in search)
    search[i] = {
      $regex: search[key],
      $options: "i",
    };
  // $options: "i" Büyük küçük harf duyarsız bir metin arama sorgusu oluşturacaktır

  const sort = req.query?.sort || {};

  let limit = Number(req.query?.limit);

  limit = limit > 0 ? limit : Number(process.env?.PAGE_SIZE || 20);

  let page = Number(req.query?.page);
  page = (page > 0 ? page : 1) - 1;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  res.getModelList = async function (Model, filters = {}, populate = null) {
    const filterAndSearch = { ...filters, ...search };

    return await Model.find(filterAndSearch)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };
  res.getModelDetailList = async function (Model, filters = {}) {
    const filterAndSearch = { ...filters, ...search };
    const dataCount = await Model.count(filterAndSearch);

    let details = {
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previos: (page > 1 ? page : false),
        current: page + 1,
        total: Math.ceil(dataCount / limit),
        next: (current >= total ? false : page + 2),
      },
      totalRecords:dataCount
    };

    return await details
  };
};
