const {
  appConfig: { responseFn, responseStr },
} = require("../config");

const { Bill, Config } = require("../models");

exports.findAll = async (req, res) => {
  try {
    const conditions = { user: req.authUser._id };
    if (req.query.customer) {
      conditions.customer = req.query.customer;
    }
    Bill.find(conditions)
      .then((data) => responseFn.success(res, { data }))
      .catch((err) => responseFn.error(res, {}, err.message));
  } catch (error) {
    return responseFn.error(res, {}, error.message, 500);
  }
};

exports.create = async (req, res) => {
  try {
    new Bill({
      ...req.body,
      unit: req.body.currentUnit,
      user: req.authUser._id,
    })
      .save()
      .then(async (data) => {
        return responseFn.success(res, { data });
      })
      .catch((err) => responseFn.error(res, {}, err.message));
  } catch (error) {
    return responseFn.error(res, {}, error.message, 500);
  }
};

exports.update = async (req, res) => {
  try {
    Bill.findOneAndUpdate(
      { _id: req.params.id, user: req.authUser._id },
      { ...req.body, unit: req.body.currentUnit },
      { new: true }
    )
      .then((data) => {
        return responseFn.success(res, { data }, responseStr.record_updated);
      })
      .catch((err) => responseFn.error(res, {}, err.message));
  } catch (error) {
    return responseFn.error(res, {}, error.message, 500);
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id && !req.body.ids?.length) {
      return responseFn.error(res, {}, responseStr.select_atleast_one_record);
    }
    Bill.deleteMany({
      _id: { $in: [...(req.body.ids || []), req.params.id] },
      user: req.authUser._id,
    })
      .then((num) => responseFn.success(res, {}, responseStr.record_deleted))
      .catch((err) => responseFn.error(res, {}, err.message, 500));
  } catch (error) {
    return responseFn.error(res, {}, error.message, 500);
  }
};
