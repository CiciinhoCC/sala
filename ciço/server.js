const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// This one line does all the magic
// It serves all static files (html, js, css, images) from the current directory
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/save-data', (req, res) => {
    const formData = req.body;
    console.log(formData)
});

app.post('/push-data', (req, res) => {
    const newData = req.body;

    fs.readFile('data.json', function (err, data) {
        if (err) {
            // If file doesn't exist, start with empty array
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                console.error("Error reading file:", err);
                return res.status(500).send("Error reading file");
            }
        }

        try {
            var json = JSON.parse(data);
            json.push(newData);

            fs.writeFile("data.json", JSON.stringify(json, null, 2), function (err) {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Error writing file");
                }
                res.send("Data saved successfully");
            });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Error parsing JSON");
        }
    });
});

app.post('/agendar', (req, res) => {
    const body = req.body;
    // {dia,inicio,fim}
    const dia = body.dia;
    const inicio = body.inicio;
    const fim = body.fim;

    fs.readFile('data.json', function (err, data) {
        if (err) {
            // If file doesn't exist, start with empty array
            if (err.code === 'ENOENT') {
                data = '[]';
            } else {
                console.error("Error reading file:", err);
                return res.status(500).send("Error reading file");
            }
        }

        try {
            var json = JSON.parse(data);
            json.forEach(elem => {
                if(elem.dia === dia) {
                    
                } 
            });

            fs.writeFile("data.json", JSON.stringify(json, null, 2), function (err) {
                if (err) {
                    console.error("Error writing file:", err);
                    return res.status(500).send("Error writing file");
                }
                res.send("Data saved successfully");
            });
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            res.status(500).send("Error parsing JSON");
        }
    });
})

app.get('/get-data', (req, res) => {
    let obj;
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) { obj = []; throw err; }
        else { obj = JSON.parse(data); }
        res.json(obj);
    });
})

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});