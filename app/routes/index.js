module.exports = function (app) {
  require("./user.routes")(app);
  require("./customer.routes")(app);
  require("./bill.routes")(app);
  require("./config.routes")(app);
};
