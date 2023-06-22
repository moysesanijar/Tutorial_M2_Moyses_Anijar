document.getElementById("readMoreBtn").addEventListener("click", function() {
    console.log("entrou")
    var moreText = document.getElementById("lerSobre");
    var computedStyle = window.getComputedStyle(moreText);
    if (computedStyle.display === "none") {
        moreText.style.display = "block";
        this.textContent = "Ler menos";
    } else {
        moreText.style.display = "none";
        this.textContent = "Ler sobre";
    }
});

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

let db = new sqlite3.Database('./db/contacts.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the contacts database.');
});

db.run('CREATE TABLE IF NOT EXISTS contacts(name TEXT, email TEXT, phone TEXT, reason TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/contacts', (req, res) => {
    db.run(`INSERT INTO contacts(name, email, phone, reason) VALUES(?, ?, ?, ?)`, [req.body.name, req.body.email, req.body.phone, req.body.reason], function(err) {
        if (err) {
            return console.log(err.message);
        }
        console.log('A row has been inserted');
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let reason = document.getElementById("reason").value;

    fetch('/contacts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, email: email, phone: phone, reason: reason }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
