const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: 'root',
    host: 'localhost',
    port : 3306,
    password: '',
    database: 'onlinemarket'
});

app.get('/users/:id', (req, res) => {

    db.query('Select * FROM users WHERE id = ' + req.params.id,
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.status(201).send(result);
        }
    });
});

app.get('/users/:userId/cart', (req, res) => {
    const userId = req.params.userId;

    db.query('SELECT c.id, i.name, i.price FROM items i INNER JOIN cart c ON i.id = c.item_id WHERE c.user_id = ? ORDER by id DESC',[userId],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.status(201).send(result);
        }
    });
});

app.get('/market/items', (req, res) => {

    db.query('Select * FROM items',
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.status(201).send(result);
        }
    });
});

app.patch('/market/:userId/buy/', (req, res) => {
    const userId = req.params.userId;
    const itemId = req.body.itemId;
    const itemPrice = req.body.itemPrice;
    const userMoney = req.body.userMoney;
    var totalMoney = userMoney - itemPrice;

    if (totalMoney < 0) {
        res.status(201).send(false);
    } else {
        db.query("UPDATE `users` SET `money`= ? WHERE id = ?", [totalMoney, userId],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log("Your money balance: " + totalMoney);
            }
        });
    
        db.query("INSERT INTO cart(user_id, item_id) VALUES (?,?)", [userId,itemId],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.status(201).send("Post Sucess");
            }
        });
    }
   
});

app.patch('/market/:userId/sell/', (req, res) => {
    const userId = req.params.userId;
    const itemId = req.body.itemId;
    const itemPrice = parseInt(req.body.itemPrice);
    const userMoney = parseInt(req.body.userMoney);
    var totalMoney = userMoney + itemPrice;

    console.log(totalMoney);

    db.query("UPDATE `users` SET `money`= ? WHERE id = ?", [totalMoney, userId],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            console.log("Your money balance: " + totalMoney);
        }
    });

    db.query("DELETE FROM cart WHERE cart.id = ?", [itemId],
    (err, result) => {
        if (err) {
            console.log(err)
        } else {
            res.status(201).send("Delete Sucess");
        }
    });
    

});

app.listen(3001, () => {
    console.log("Your server is running UwU");
})