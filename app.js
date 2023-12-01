const { createPool } = require("mysql2");
// const { parse } = require("path");
const bcrypt = require("bcrypt");
const readline = require("readline");
// const { start } = require("repl");

const pool = createPool({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "db",
});

const getUserInput = async (message) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(message, (choice) => {
      // Close the readline interface
      rl.close();
      resolve(choice);
    });
  });
};

var user = null;
var role = null;

const create_user = async () => {
  let name = await getUserInput("Name: ");
  let pwd = await getUserInput("Password: ");
  let access = await getUserInput("Role: ");
  await pool
    .promise()
    .query(
      `INSERT INTO EMPLOYEES(NAME,HASH_PWD,ROLE) VALUES('${name}','${pwd}','${access}')`
    );
  const [results, fields] = await pool
    .promise()
    .query(`SELECT last_insert_id()`);
  console.log(
    `-------------The new user has been created with id ${results[0]["last_insert_id()"]}------------------`
  );
};
const login = async () => {
  let empid = await getUserInput("Enter your ID: ");
  let pwd = await getUserInput("Enter your password: ");

  try {
    const [results, fields] = await pool
      .promise()
      .query(
        `SELECT * FROM employees WHERE empid = ${empid} AND hash_pwd = '${pwd}';`
      );
    if (results.length === 0) {
      console.log("Username or password incorrect!!");
      return;
    } else {
      user = results[0]["EMPID"];
      role = results[0]["ROLE"];
      console.log("Your role is: " + role);
      console.log("-----------Logged in successfully----------");
    }
  } catch (err) {
    console.error(err);
  }
};

const add_restaurant = async () => {
  let name = await getUserInput("Enter the name of the restaurant: ");
  let number = await getUserInput("Enter the phone no: ");
  let address = await getUserInput("Enter the address: ");
  try {
    await pool
      .promise()
      .query(
        `INSERT INTO RESTAURANT (RNAME, CONTACT_NO, ADDRESS) VALUES ('${name}',${parseInt(
          number
        )},'${address}');`
      );
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`);
    console.log(
      `-------------Successfully created a new restaurant.It's id is ${results[0]["last_insert_id()"]}-------------`
    );
  } catch (err) {
    console.error(err);
  }
};
const assign_table = async () => {
  let cusid = await getUserInput("Enter customer ID: ");
  try {
    const [results, fields] = await pool
      .promise()
      .query(`SELECT ASSIGN_TABLE(?) AS result`, [parseInt(cusid)]);
    if (results[0]["result"] == -1) {
      console.log("Put in waiting queue");
    } else {
      console.log(
        `------------Table no ${results[0].result} assigned---------------`
      );
    }
  } catch (err) {
    console.error(err);
  }
};

const add_customer = async () => {
  let name = await getUserInput("Enter Customer name: ");
  let number = await getUserInput("Enter the phone no: ");
  let rid = await getUserInput("Enter restaurant id ");
  try {
    await pool
      .promise()
      .query(
        `INSERT INTO CUSTOMER (CUSNAME, CONTACT_NO, RID) VALUES ('${name}',${number}, ${rid});`
      );
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`);
    console.log(
      `-------------The customer's id is ${results[0]["last_insert_id()"]}--------------`
    );
  } catch (err) {
    console.error(err);
  }
};
const add_waiter = async () => {
  let name = await getUserInput("Enter Waiter name: ");
  let number = await getUserInput("Enter the phone no: ");
  try {
    await pool
      .promise()
      .query(
        `INSERT INTO WAITER_INFO(WNAME,CONTACT_NO) VALUES('${name}',${number});`
      );
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`);
    console.log(
      `--------------The waiter's id is ${results[0]["last_insert_id()"]}-----------------`
    );
  } catch (err) {
    console.error(err);
  }
};

const update_order_status = async (id) => {
  await pool
    .promise()
    .query(
      `UPDATE ORDER_INFO SET STATUS = 'COMPLETED' WHERE ORDER_NO = ${id};`
    );
  console.log(`-----------Order ${id} has been completed-------------`);
};

const create_order = async () => {
  let tableid = await getUserInput("Enter the table no. ");
  try {
    await pool
      .promise()
      .query(`INSERT INTO ORDER_INFO(TABLE_ID) VALUES(${tableid});`);
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`);
    console.log(
      `------------The order id is ${results[0]["last_insert_id()"]}-------------`
    );
    //now accept items for that order
    let id = parseInt(results[0]["last_insert_id()"]);
    let item_id = null;
    let max_time = 0;
    while (item_id != -1) {
      item_id = await getUserInput("Item Id(-1 to end): ");
      let quantity = await getUserInput("Quantity: ");
      if (item_id == -1) break;

      //taking time
      const [results, fields] = await pool
        .promise()
        .query(
          `SELECT PREPARATION_TIME FROM MENU WHERE ITEM_ID=${parseInt(
            item_id
          )};`
        );
      time = results[0]["PREPARATION_TIME"];
      if (time != null) {
        const [hours, minutes, seconds] = time.split(":").map(Number);
        max_time = Math.max(max_time, 60 * hours + minutes);
        //max_time=Math.max(max_time,3600*hours+60*minutes+seconds)
      }
      //done taking time
      try {
        const [results, fields] = await pool
          .promise()
          .query(`SELECT ADD_ORDER_ITEM(?,?,?,?) AS result`, [
            parseInt(id),
            parseInt(tableid),
            parseInt(item_id),
            parseInt(quantity),
          ]);
        console.log(`Item added to order ${id}`);
      } catch (err) {
        console.error(err);
      }
    }
    //now all items have been added, we now need to set the order as completed after timeout of the maximum
    console.log(
      "----------The order will be ready in" + max_time + "s----------------"
    );
    setTimeout(update_order_status, max_time * 1000, parseInt(id));
  } catch (err) {
    console.error(err);
  }
};

const add_menu_item = async () => {
  let name = await getUserInput("Name of the new dish: ");
  let price = await getUserInput("Price : ");
  let desc = await getUserInput("Description: ");
  try {
    await pool
      .promise()
      .query(
        `INSERT INTO MENU(ITEM_NAME,PRICE,DESCRIPTION) VALUES('${name}',${parseFloat(
          price
        )},'${desc}');`
      );
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`);
    console.log(results);
    console.log(
      `----------------The item id is ${results[0]["last_insert_id()"]}-----------------`
    );
  } catch (err) {
    console.error(err);
  }
};

const add_chef = async () => {
  let name = await getUserInput("Chef's name: ");
  try {
    await pool.promise().query(`INSERT INTO CHEF(CHEFNAME) VALUES('${name}')`); // WHERE empid = ? AND hash_pwd = ?`, [empid, pwd]);
    const [results, fields] = await pool
      .promise()
      .query(`SELECT last_insert_id()`); // WHERE empid = ? AND hash_pwd = ?`, [empid, pwd]);
    console.log(results);
    console.log(
      `-----------The chef's id is ${results[0]["last_insert_id()"]}-----------`
    );
  } catch (err) {
    console.error(err);
  }
};
const best_sellers = async () => {
  try {
    await pool.promise().query(`CALL UPDATE_TOP_SELLERS()`, []);
    console.log(`-----------The top sellers table has been updated----------`);
  } catch (err) {
    console.error(err);
  }
};

const get_revenue = async () => {
  let starttime = await getUserInput("Enter start datetime: ");
  let endtime = await getUserInput("Enter end datetime: ");
  try {
    const [results, fields] = await pool
      .promise()
      .query(`SELECT GET_REVENUE(?,?) AS result`, [starttime, endtime]);
    console.log(
      `-----------The revenue in this period is $${results[0].result}------------`
    );
  } catch (err) {
    console.error(err);
  }
};

const meal_suggestion = async () => {
  let customerBudget = await getUserInput("Budget: ");
  customerBudget = parseFloat(customerBudget);
  const currentTime = new Date();

  // Format the current time as 'HH:mm:ss'
  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour12: false,
  });
  try {
    // Create a connection from the pool
    //const connection = await pool.getConnection();
    // Call the stored procedure
    await pool
      .promise()
      .query("SELECT SUGGEST_MEAL(?,?)", [customerBudget, formattedTime]);

    // Fetch the values of OUT parameters
    const [results, fields] = await pool
      .promise()
      .query("SELECT * FROM SUGGESTION;");

    console.log(results);

    // Extract the values from the result
    // const app = outResults[0]["@app"];
    // const main = outResults[0]["@main"];
    // const dessert = outResults[0]["@dessert"];
    // const beverage = outResults[0]["@beverage"];

    // // Log or use the retrieved values
    // console.log("Suggested Appetizer:", app);
    // console.log("Suggested Main Course:", main);
    // console.log("Suggested Dessert:", dessert);
    // console.log("Suggested Beverage:", beverage);
  } catch (err) {
    console.error(err);
  } finally {
    // Be sure to release the connection when done
    //pool.end();
    return;
  }
};

const main = async () => {
  const pool = createPool({
    host: "localhost",
    user: "root",
    password: "nishad@",
    database: "CS301",
  });
  //initial login
  console.log("Login first before accessing database");
  await login();
  //
  let choice = null;
  while (choice !== "-1") {
    console.log("#############################################");
    console.log("Choose action:");
    console.log("1. Change user");
    console.log("2. Assign table");
    console.log("3. Add a new restaurant");
    console.log("4. Add a new customer");
    console.log("5. Add a new waiter");
    console.log("6. Create a new order");
    console.log("7. Add item to menu");
    console.log("8. Add a chef");
    console.log("9. Get the top sellers");
    console.log("10. Get revenue for a time period");
    console.log("11. Suggest meal according to budget and time of order");
    console.log("12. Create a new user for the database");
    console.log("-1 to exit program");

    choice = await getUserInput("Enter your choice: ");
    // console.log("Your choice was "+ choice)
    if (choice === "-1") {
      console.log("Exiting...");
      break;
    }

    switch (choice) {
      case "1":
        await login();
        break;
      case "2":
        if (role == "OWNER" || role == "MANAGER" || role == "CASHIER") {
          await assign_table();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "3":
        if (role == "OWNER") {
          await add_restaurant();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "4":
        if (role == "OWNER" || role == "MANAGER" || role == "CASHIER") {
          await add_customer();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "5":
        if (role == "OWNER" || role == "MANAGER") {
          await add_waiter();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "6":
        if (
          role == "OWNER" ||
          role == "MANAGER" ||
          role == "CASHIER" ||
          role == "WAITER"
        ) {
          await create_order();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "7":
        if (role == "OWNER" || role == "CHEF" || role == "MANAGER") {
          await add_menu_item();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "8":
        if (role == "OWNER" || role == "MANAGER") {
          await add_chef();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "9":
        if (
          role == "OWNER" ||
          role == "CHEF" ||
          role == "MANAGER" ||
          role == "CASHIER" ||
          role == "WAITER"
        ) {
          await best_sellers();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "10":
        if (
          role == "OWNER" ||
          role == "CHEF" ||
          role == "MANAGER" ||
          role == "CASHIER" ||
          role == "WAITER"
        ) {
          await get_revenue();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "11":
        if (
          role == "OWNER" ||
          role == "CHEF" ||
          role == "MANAGER" ||
          role == "CASHIER" ||
          role == "WAITER"
        ) {
          await meal_suggestion();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      case "12":
        if (role == "OWNER") {
          await create_user();
        } else {
          console.log("You don't have the permission to perform this action.");
        }
        break;
      default:
        console.log("Please enter a valid choice");
        break;
    }
  }
  pool.end((err) => {
    if (err) throw err;
    console.log("Connection pool closed");
  });
};

main();
