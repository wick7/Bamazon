var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "clarks77",
  database: "bamazon"
});


  function readProducts() {
    // console.log("Selecting all products...\n");
    // connection.query("SELECT * FROM products", function(err, res) {
    //   if (err) throw err;
      // Log all results of the SELECT statement
    //   console.log(res);
    // var currentChoices = []
    //   for(var i in res) { 
    //       var final = `
    //         ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id}
    //       `
    //       console.log(final)
    //       currentChoices.push(res[i].product_name)
    //   }
    //});

    inquirer.prompt([
        {
            type: "list",
            name: "task",
            message: "Select one: ",
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        },  
    ]).then(function(answers) {
        
        switch (answers.task) {
            case 'View Products for Sale':
            viewSaleProducts()
              break; 
            case 'View Low Inventory':
            viewLowInventory()
              break;
            case 'Add to Inventory':
              addToInventory()
              break;
            case 'Add New Product':
            addNewProduct()
              break;
            default: 
            console.log("Idk what happened")
              break;
          }
          
    });
  }

readProducts()


function viewSaleProducts() {
    console.log("View Products for Sale")
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
    //   Log all results of the SELECT statement
    //   console.log(res);
      for(var i in res) { 
          var final = `
            ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id} | Dept: ${res[i].department_name} | Stock: ${res[i].stock_quantity}
          `
          console.log(final)
      }
      connection.end();
    });
}

function viewLowInventory() {
    console.log("View Low Inventory")
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
    //   Log all results of the SELECT statement
    //   console.log(res);
    var lowInv = []
      for(var i in res) { 
          var final = `
            ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id} | Dept: ${res[i].department_name} | Stock: ${res[i].stock_quantity}
          `
          if(res[i].stock_quantity < 5) {
            lowInv.push(final)
          }
      }

      if(lowInv.length <= 0) {
        console.log("\n All stock higher than 5 items \n")
      }else {
          for(var i of lowInv) {
              console.log(i)
          }
      }
      connection.end();
    });
}

function addToInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
    //   Log all results of the SELECT statement
    //   console.log(res);

    var currentStock;

    var currentChoices = []
      for(var i in res) { 
        var final = `
        ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id} | Dept: ${res[i].department_name} | Stock: ${res[i].stock_quantity}
      `
          console.log(final)
          currentChoices.push(res[i].product_name)
          currentStock = res[i].stock_quantity;
      }
      inquirer.prompt([
        {
            type: "list",
            name: "product",
            message: "Select product to update: ",
            choices: currentChoices
        },  
        {
            type: "input",
            name: "stock",
            message: "Enter amount of stock to add: "
        },
    ]).then(function(answers) {
        ///FIX HERE - STOCK NOT ADDING
        // var newStock = parsInt(currentStock) + parsInt(answers.stock);
        console.log(newStock)
        var query = connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              {
                  stock_quantity: newStock
              },
              {
                  product_name: answers.product
              }
            ],
            function(err, res) {
              console.log("\n" + res.affectedRows + " stock update!\n");
            }
          );
          connection.end();
    });
    });
}

function addNewProduct() {
    console.log("Add New Product")
}



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



