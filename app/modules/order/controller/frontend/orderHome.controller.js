class OrderHomeController {
  async cartPage(req, res) {
    try {
      res.render("order/views/frontend/cart", {
        title: "Customer Orders List",
        data: req.admin,
        // orders: customerOrderData,
      });
    } catch (error) {
      console.log(`Error in getting cart page ${error}`);
    }
  }
}

module.exports = new OrderHomeController();
