const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// This one line does all the magic
// It serves all static files (html, js, css, images) from the current directory
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function criarDia() {
    const salas = ["sala1", "sala2", "sala3"];
    const arrayPadrao = Array(30).fill("");
    let object = {};
    salas.forEach(elem => {
        object[elem] = [...arrayPadrao];
    });

    return object;
}

function horaToVaga(hora) {
    let stunden = hora.split(":")[0];
    let minuten = hora.split(":")[1];
    return (stunden - 7) * 2 + (minuten == 30 ? 1 : 0) - 1;
}

function vagaToHora(vaga) {
    let minuten = vaga % 2 == 1 ? ":30" : ":00";
    let stunden = (((vaga - (vaga % 2)) / 2)+7).toString().padStart(2, "0");
    return stunden + minuten
}

app.post('/save-data', (req, res) => {
    const formData = req.body;
    console.log(formData)
});

// app.post('/push-data', (req, res) => {
//     const newData = req.body;

//     fs.readFile('data.json', function (err, data) {
//         if (err) {
//             // If file doesn't exist, start with empty array
//             if (err.code === 'ENOENT') {
//                 data = '[]';
//             } else {
//                 console.error("Error reading file:", err);
//                 return res.status(500).send("Error reading file");
//             }
//         }

//         try {
//             var json = JSON.parse(data);
//             json.push(newData);

//             fs.writeFile("data.json", JSON.stringify(json, null, 2), function (err) {
//                 if (err) {
//                     console.error("Error writing file:", err);
//                     return res.status(500).send("Error writing file");
//                 }
//                 res.send("Data saved successfully");
//             });
//         } catch (parseError) {
//             console.error("Error parsing JSON:", parseError);
//             res.status(500).send("Error parsing JSON");
//         }
//     });
// });

app.post('/agendar', (req, res) => {
    const body = req.body;
    // {dia,inicio,fim}
    const DIA = body.dia;
    const SALA = body.sala;
    const INICIO = body.inicio;
    const FIM = body.fim;
    const COISA = body.coisa;

    fs.readFile('./data.json', function (err, data) {
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
            if (!(DIA in json)) {
                json[DIA] = criarDia();
            }
            const dia = json[DIA];
            const sala = dia[SALA];
            let pode = true;
            for (i = INICIO; i <= FIM && pode; i++) {
                if (sala[i] != "") {
                    pode = false;
                    return res.status(500).send("Não dá pra agendar nesse período, às " + vagaToHora(i) + " tem " + sala[i]);
                }
            }
            if (pode) {
                for (i = INICIO; i <= FIM; i++) {
                    sala[i] = COISA;
                }
            }
            fs.writeFile("./data.json", JSON.stringify(json, null, 2), function (err) {
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
        if (err) { obj = {}; throw err; }
        else { obj = JSON.parse(data); }
        res.json(obj);
    });
});

app.get('/get-dias', (req, res) => {
    let obj;
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) { obj = {}; res.json([]); throw err;}
        else { obj = JSON.parse(data); res.json(Object.keys(obj));}
    });
});

app.get('/get-dia', (req, res) => {
    const DIA = req.query.dia;
    let obj;
    fs.readFile('./data.json', 'utf8', function (err, data) {
        if (err) { obj = {}; throw err; }
        else { obj = JSON.parse(data); }
        res.json(obj[DIA]);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});