const orderRepositories = require("../../repositories/order.repositories");


class OrderController {

  async getAllOrders(req,res) {
    try {
        const allOrderData=await orderRepositories.allOrders()
        
        if(allOrderData) {
            return res.render('order/views/backend/orderList', {
                title: "All Orders List",
                data: req.admin,
                orders: allOrderData
            })
        }
    } catch (error) {
        console.log(`Error in getting all orders ${error}`);
    }
  }


  async getCustomerWiseOrders(req,res) {
    try {
        const customerOrderData=await orderRepositories.custWiseOrders(req.params.id)
        if(customerOrderData) {
            return res.render('order/views/backend/customerWiseList', {
                title: "Customer Orders List",
                data: req.admin,
                orders: customerOrderData
            })
        }
    } catch (error) {
        console.log(`Error in getting all orders ${error}`);
    }
  }

}

module.exports = new OrderController();
