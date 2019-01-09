var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});


  function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
    //   console.log(res);
    var currentChoices = []
      for(var i in res) { 
          var final = `
            ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id}
          `
          console.log(final)
          currentChoices.push(res[i].product_name)
      }
      
        inquirer.prompt([
            {
                type: "list",
                name: "product",
                message: "Please select your item: ",
                choices: currentChoices
            }, 
            {
                type: "input",
                name: "units",
                message: "Enter number of units you would like: "
            }, 
        ]).then(function(answers) {
            // console.log(answers.product)
            // console.log(answers.units)
            connection.query(`SELECT stock_quantity FROM products WHERE product_name = "${answers.product}"`, function(err, res) {
                if (err) throw err;
                console.log(res[0].stock_quantity);
                if(res[0].stock_quantity < answers.units) {
                    console.log("Insufficient quantity left! Please choose less.");
                    readProducts();
                }else if(res[0].stock_quantity >= answers.units) {
                    var newStock = res[0].stock_quantity - answers.units;
                    // console.log("Updating all " + answers.product + " quantities...\n");
                    // console.log("Previous " + answers.product + " stock " + res[0].stock_quantity);
                    // console.log("---------------------------------------")
                    // console.log("New " + answers.product + " stock " + newStock);

                   console.log(`Updating all ${answers.product} quantities...\n
                    Previous ${answers.product} stock ${res[0].stock_quantity}
                    ---------------------------------------------------
                    New ${answers.product} stock ${newStock}`);

                    updateProducts(newStock, answers.product, answers.units)
                }
              });
        });
    });
  }

readProducts()

// select * from products

function updateProducts(stockUpdate, product, quantity) {
    
    var query = connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
            stock_quantity: stockUpdate
        },
        {
            product_name: product
        }
      ],
      function(err, res) {
        console.log("\n" + res.affectedRows + " stock update!\n");
      }
    );
    // console.log(query.sql);
    connection.query(`SELECT price FROM products WHERE product_name = "${product}"`, function(err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.log(`Total Due = $${quantity * res[0].price} \n`);
        connection.end();
      });
  }



