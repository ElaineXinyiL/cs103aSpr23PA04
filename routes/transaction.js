/*
  todo.js -- Router for the ToDoList
*/
const express = require("express");
const router = express.Router();
const TransactionItem = require("../models/TransactionItem");
const User = require("../models/User");

/*
this is a very simple server which maintains a key/value
store using an object where the keys and values are lists of strings

*/

isLoggedIn = (req, res, next) => {
  if (res.locals.loggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
};

// get the value associated to the key
router.get("/transaction/", isLoggedIn, async (req, res, next) => {
  const sortBy = req.query.sortBy;
  let items = [];
  if (sortBy == "category") {
    items = await TransactionItem.find({ userId: req.user._id }).sort({
      category: 1,
      date: 1,
      amount: 1,
    });
  } else if (sortBy == "amount") {
    items = await TransactionItem.find({ userId: req.user._id }).sort({
      amount: 1,
    });
  } else if (sortBy == "description") {
    items = await TransactionItem.find({ userId: req.user._id }).sort({
      description: 1,
    });
  } else if (sortBy == "date") {
    items = await TransactionItem.find({ userId: req.user._id }).sort({
      date: 1,
    });
  } else {
    items = await TransactionItem.find({ userId: req.user._id }).sort({
      date: 1,
    });
  }
  res.render("transactionList", { items, sortBy });
});

/* add the value in the body to the list associated to the key */
router.post("/transaction", isLoggedIn, async (req, res, next) => {
  const transaction = new TransactionItem({
    description: req.body.description,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date,
    userId: req.user._id,
  });
  await transaction.save();
  res.redirect("/transaction");
});

router.get(
  "/transaction/remove/:itemId",
  isLoggedIn,
  async (req, res, next) => {
    console.log("inside /transaction/remove/:itemId");
    await TransactionItem.deleteOne({ _id: req.params.itemId });
    res.redirect("/transaction");
  }
);

router.get("/transaction/edit/:itemId", isLoggedIn, async (req, res, next) => {
  console.log("inside /transaction/edit/:itemId");
  const item = await TransactionItem.findById(req.params.itemId);
  res.render("transactionEdit", { item });
});

router.post(
  "/transaction/updateTransactionItem",
  isLoggedIn,
  async (req, res, next) => {
    const { itemId, description, amount, category, date } = req.body;
    console.log("inside /transaction/updateTransactionItem");
    await TransactionItem.findOneAndUpdate(
      { _id: itemId },
      { $set: { description, amount, category, date } }
    );
    res.redirect("/transaction");
  }
);

// router.get("/todo/byUser", isLoggedIn, async (req, res, next) => {
//   let results = await ToDoItem.aggregate([
//     {
//       $group: {
//         _id: "$userId",
//         total: { $count: {} },
//       },
//     },
//     { $sort: { total: -1 } },
//   ]);
//   //replace id with name
//   results = await User.populate(results, {
//     path: "_id",
//     select: ["username", "age"],
//   });

//   //res.json(results)
//   res.render("summarizeByUser", { results });
// });

// //count completed todos
// router.get("/todo/byComplete", isLoggedIn, async (req, res, next) => {
//   let results = await ToDoItem.aggregate([
//     { $match: { completed: true } },
//     {
//       $group: {
//         _id: "$userId",
//         total: { $count: {} },
//       },
//     },
//     { $sort: { total: -1 } },
//   ]);
//   //replace id with name
//   results = await User.populate(results, {
//     path: "_id",
//     select: ["username", "age"],
//   });

//   //res.json(results)
//   res.render("summarizeByUser", { results });
// });

// //count the number of times each item appears on some users
// router.get("/todo/byDesicription", isLoggedIn, async (req, res, next) => {
//   let results = await ToDoItem.aggregate([
//     { $match: { completed: true } },
//     {
//       $group: {
//         _id: "$item",
//         total: { $count: {} },
//       },
//     },
//     { $sort: { total: -1 } },
//   ]);

//   res.json(results)
//   //res.render("summarizeByUser", { results });
// });

module.exports = router;
