var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var bodyParser = require('body-parser');

function sqlConnect() {
	return mysql.createConnection({
		multipleStatements: true,
		host: 'localhost',
		user: 'root',
		password: 'password',
		database: 'PACIFIC'
	});
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var connection = sqlConnect();
	var item_arr = [];
	var type_arr = [];

	// CONNECTING TO MYSQL DB
	connection.connect(function(err){
		if(err)
			console.error('Error connecting to database\n'+err.stack);
		//else
			//console.log('Connection succeeded');
	});

	// QUERIES FOR TYPE TABLE FILTER
	connection.query('SELECT DISTINCT Type FROM ITEM_TYPE', function(err, result, fields0){
		if(err) throw err;
		console.log('Query for category of items available: ', result);

		for(var i = 0; i < result.length; i++) {
			var type = {
				'item':result[i].Type
			}
			type_arr.push(type);
		}

		// QUERIES FOR ITEMS AVAILABLE FOR SALE TABLE
		connection.query('SELECT ItemName, Price, Quantity, SellerName, Type FROM INVENTORY, SELLER WHERE SELLER.SellerID = INVENTORY.SellerID AND INVENTORY.Quantity > 0', function(err, rows, fields1){
			console.log('My query: ', rows);

			for(var i = 0; i < rows.length; i++) {
				var item = {
					'name':rows[i].ItemName,
					'price':rows[i].Price,
					'quantity':rows[i].Quantity,
					'seller':rows[i].SellerName,
					'type':rows[i].Type
				}
				console.log(rows[i].Type);
				item_arr.push(item);
			}
			
			console.log(type_arr);
			res.render('index', {title: 'Pacific', item_arr: item_arr, type_arr: type_arr});
		});
	});
});

router.post('/', function(req, res, next){
	console.log('hi', req.body);



	var connection = sqlConnect();
	var itemPurchased = [];
	var totalCost = 0;
	connection.connect(function(err) {
		if(err) {
			throw err;
			console.log("Failed to connect to MySQL server --- index.js post req");
		} else{
			
			
			//added in loop for id
			var curCustomerID;
			connection.query('SELECT COUNT(CustomerID) FROM CUSTOMER', function(err, result0, field0){
		    console.log("num of customers in db: " + result0[0]['COUNT(CustomerID)']);
		    if(result0[0]['COUNT(CustomerID)'] != 0) {
			connection.query('SELECT MAX(CustomerID) FROM CUSTOMER', function(err, result1, field1){
			console.log("max id: " + result1[0]['MAX(CustomerID)']);
			curCustomerID = result1[0]['MAX(CustomerID)'] + 1; // NEXT AVAILABLE ID
			var firstName=req.body.first_name;
			var lastName=req.body.last_name;
			var address=req.body.address;
			var phoneNum=req.body.phone;
			var email=req.body.email;
			var sql = "INSERT INTO customer (CustomerID,FirstName, LastName, Address, PhoneNumber,EmailAddress) VALUES ('"+curCustomerID+"','"+firstName+"', '"+lastName+"','"+address+"','"+phoneNum+"','"+email+"')";
			connection.query(sql, function (err, result) {
  			if (err) throw err;
  			console.log("1 customer record inserted");
 			 });
			//START HERE--------ADDED IN CARD INFO ONCE CONNECTED 
			//check the components for valid inputs before putitng into database 
			var cardNum=req.body.card_number;
			var cardExpDate=req.body.card_expiry;
			if(req.body.card_type==1) {
				cardType='Debit Card';

				 var sql = "INSERT INTO payment (CustomerID,CardNumber, PaymentType, CardExpiryDate) VALUES ('"+curCustomerID+"','"+cardNum+"', 'Debit Card','"+cardExpDate+"')";
				 connection.query(sql, function (err, result) {
  				 if (err) throw err;
  			 	 console.log("1 paymethod info record inserted");
 				 });
			}
			if(req.body.card_type==2) {
				cardType='Credit Card';

				 var sql = "INSERT INTO payment (CustomerID,CardNumber, PaymentType, CardExpiryDate) VALUES ('"+curCustomerID+"','"+cardNum+"', 'Credit Card','"+cardExpDate+"')";
				 connection.query(sql, function (err, result) {
  				  if (err) throw err;
  				  console.log("1 record inserted");
 				 });
			}
		//END---------------
			});
		}
		});

			//console.log("Post Connection Succeeded");

			// QUERIES FOR LIST OF ITEMS AVAILABLE FOR SALE
			connection.query('SELECT ItemID, ItemName, Price, Quantity FROM INVENTORY WHERE Quantity > 0', function(err, result, fields0){
				for(var i = 0; i < result.length; i++) {
					
					// UPDATES DATABASE AFTER CUSTOMER PROCESSED TRANSACTION
					var updb_sql = mysql.format("UPDATE INVENTORY SET Quantity = ? WHERE ItemID = ?", [result[i].Quantity-req.body[result[i].ItemName], result[i].ItemID]);
					connection.query(updb_sql, function(err, result1, fields1){
						if(err) throw err;
					});
				}

				// QUERIES UPDATED DB
				connection.query('SELECT ItemID, ItemName, Price, Quantity FROM INVENTORY', function(err, result2, fields2){
					for(var i = 0; i < result2.length; i++) {
						if(req.body[result2[i].ItemName] > 0) {
							var item = {
								'name':result2[i].ItemName,
								'quantity':req.body[result2[i].ItemName],
								'price':result2[i].Price
							};
							itemPurchased.push(item);
							totalCost = totalCost + (result[i].Price*req.body[result[i].ItemName]);
					
						}
					}
							//ADD IN TOTAL IN SHIPMENT START
							var deliveryAddr=req.body.delivery_address
							var deliverySql = "INSERT INTO shipment (ShipmentID,CustomerID,DeliveryAddr,ShipmentCharge) VALUES ('"+curCustomerID+"','"+curCustomerID+"','"+deliveryAddr+"','"+totalCost+"')";
							connection.query(deliverySql, function (err, result) {
  							if (err) throw err;
  							console.log("1 delivery info record inserted");
 							});
 							
							//END============

					console.log("customer's purchase: ");
					console.log(itemPurchased);
					console.log(totalCost);
					res.render('thankyou', {totalCost: totalCost, itemPurchased: itemPurchased});
				});
			});
		}
	});
});

module.exports = router;
