"use strict";

const { BlogCategory, BlogPost } = require("./models/blogModel");
const User = require("../models/user");

module.exports = async () => {
  //   const blogCategory = await BlogCategory.findOne();

  //   if (blogCategory) {
  //     const isUpdated = await BlogPost.updateMany(
  //       {
  //         'blogCategoryId': { $exists: false },
  //       },
  //       {
  //         'blogCategoryId': blogCategory._id,
  //       }
  //     ).catch((err) => console.log(err));
  //   }
  //   const user = await User.findOne();

  //   if (user) {
  //     BlogPost.updateMany(
  //       {
  //         'userId': { $exists: false }
  //       },
  //       { 'userId': user._id }
  //     ).catch((err) => console.log(err));
  //   }

  //!Exaple Data
  await User.deleteMany().then(() => console.log(" - User deleted All"));
  await BlogCategory.deleteMany().then(() =>
    console.log(" - BlogCategory Deleted All")
  );
  await BlogPost.deleteMany().then(() =>
    console.log(" - BlogPost Deleted All")
  );
  //! Example User:
  const user = await User.create({
    email: "test@test.com",
    password: "12345678",
    firstName: "Test",
    lastName: "Test"
})
//! Example Category:
const blogCategory = await BlogCategory.create({
  name: 'Test Category'
})
//! Example Posts:
    for (let key in [...Array(200)]) {
        await BlogPost.create({
            userId: user._id,
            blogCategoryId: blogCategory._id,
            title: `test ${key} title`,
            content: `test ${key} content`,
            published: Boolean(key%2)
        })
    }

  console.log("*** Synchronised ***");
};
