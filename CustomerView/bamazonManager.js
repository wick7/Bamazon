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
  
    var currentStock = []
    var currentChoices = [];

      for(var i in res) { 
        var final = `
        ${res[i].product_name} | $${res[i].price} | ID: ${res[i].item_id} | Dept: ${res[i].department_name} | Stock: ${res[i].stock_quantity}
      `
          
          console.log(final)
          currentChoices.push(res[i].product_name)
        //   currentStock = res[i].stock_quantity;

        currentStock.push({
              item: res[i].product_name,
              stock: res[i].stock_quantity
          })
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
        // console.log(currentStock)
        var newStock = parseInt(answers.stock);

        for(var i in currentStock) {
            if(answers.product === currentStock[i].item) {
                newStock = newStock + currentStock[i].stock
            }
        }
        
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
          );
          connection.end();
        });
        
    });
}


function addNewProduct() {
    console.log("Add New Product")
    inquirer.prompt([
        {
            type: "input",
            name: "itemId",
            message: "Enter 4 digit unique item id: ",      
        }, 
        {
            type: "input",
            name: "productName",
            message: "Enter product name: ",      
        }, 
        {
            type: "input",
            name: "deptName",
            message: "Enter department name: ",      
        }, 
        {
            type: "input",
            name: "price",
            message: "Enter price: ",      
        }, 
        {
            type: "input",
            name: "stockQ",
            message: "Enter initial stock quanitity: ",      
        }, 
    ]).then(function(answers) {
        var query = connection.query(
            "INSERT INTO products SET ?",
            {
              item_id: answers.itemId,
              product_name: answers.productName,
              department_name: answers.deptName,
              price: answers.price,
              stock_quantity: answers.stockQ,
      
            },
          );
          connection.end();
    });
  }






