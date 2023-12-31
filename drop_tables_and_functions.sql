


DROP TABLE IF EXISTS MENU_DETAILS;
DROP TABLE IF EXISTS CUISINE;
DROP TABLE IF EXISTS WAITER_ASSIGNED;
DROP TABLE IF EXISTS ORDER_ITEMS;
DROP TABLE IF EXISTS CHEF_ASSIGNED;
DROP TABLE IF EXISTS BILL_DTLS; 
DROP TABLE IF EXISTS ORDER_INFO;
DROP TABLE IF EXISTS BILL;
DROP TABLE IF EXISTS TABLE_ASSIGNED;
DROP TABLE IF EXISTS TABLES;
DROP TABLE IF EXISTS WAITING_CUSTOMERS;
DROP TABLE IF EXISTS CUSTOMER; 
DROP TABLE IF EXISTS RESTAURANT;
DROP TABLE IF EXISTS CHEF;
DROP TABLE IF EXISTS TOP_SELLERS;
DROP TABLE IF EXISTS MENU;
DROP TABLE IF EXISTS CATEGORY;
DROP TABLE IF EXISTS WAITER_INFO;
DROP TABLE IF EXISTS LOGS;
DROP TABLE IF EXISTS SUGGESTION;
DROP TABLE IF EXISTS EMPLOYEES;






DROP FUNCTION IF EXISTS ADD_CUSTOMER;
DROP FUNCTION IF EXISTS ADD_MENU_ITEM;
DROP FUNCTION IF EXISTS ADD_ORDER;
DROP FUNCTION IF EXISTS ADD_ORDER_ITEM;
DROP FUNCTION IF EXISTS ADD_RESTAURANT;
DROP FUNCTION IF EXISTS ADD_WAITER;
DROP FUNCTION IF EXISTS ALTER_RESTAURANT;
DROP FUNCTION IF EXISTS ADD_CHEF;
DROP FUNCTION IF EXISTS ASSIGN_CHEF;
DROP FUNCTION IF EXISTS ASSIGN_TABLE;
DROP FUNCTION IF EXISTS ASSIGN_WAITER;
DROP FUNCTION IF EXISTS GET_REVENUE;
DROP PROCEDURE IF EXISTS UPDATE_TOP_SELLERS;
DROP PROCEDURE IF EXISTS SUGGEST_MEAL;
DROP FUNCTION IF EXISTS GET_ORDER_AMOUNT;
DROP FUNCTION IF EXISTS GET_CUSTOMER;
DROP PROCEDURE IF EXISTS SUGGEST_MEAL;
DROP PROCEDURE IF EXISTS UPDATE_TOP_SELLERS;
DROP FUNCTION IF EXISTS SUGGEST_MEAL;








DROP TRIGGER IF EXISTS ON_ASSIGN_TABLE;
DROP TRIGGER IF EXISTS ON_TABLE_FREE;
DROP TRIGGER IF EXISTS ON_ORDER_COMPLETE;
DROP TRIGGER IF EXISTS ON_ORDER_INFO_ASSIGN_CHEF;
DROP TRIGGER IF EXISTS UPDATE_POPULARITY;
