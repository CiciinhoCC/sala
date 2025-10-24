async function getData() {
    const response = await fetch('/get-data');
    const data = await response.json();

    return data;
}

async function getDia(dia) {
    const response = await fetch(`/get-dia?dia=${dia}`, {
        method: 'GET',
    });
    const data = await response.json();

    return data;
}

async function getDias() {
    const response = await fetch(`/get-dias`, {
        method: 'GET',
    });
    const data = await response.json();

    return data;
}

// function pushData(newData) {
//     fetch('/push-data', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(newData)
//     })
//         .then(response => response.text())
//         .then(data => {
//             console.log("Server response:", data);
//         })
//         .catch(error => {
//             console.error("Error:", error);
//         });
// }
const salasLista = ["sala1", "sala2", "sala3"];

function criarDia() {
    const arrayPadrao = Array(30).fill("");
    let object = {};
    salasLista.forEach(elem => {
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
    let stunden = (((vaga - (vaga % 2)) / 2) + 7).toString().padStart(2, "0");
    return stunden + minuten;
}

function agendar(dia, sala, inicio, fim, coisa) {
    fetch('/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dia: dia,
            sala: sala,
            inicio: inicio,
            fim: fim,
            coisa: coisa
        })
    })
        .then(response => response.text())
        .then(data => {
            console.log("Server response:", data);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

// const horarios = {
//     manha: ["7:30", "8:30", "9:20", "Intervalo", "9:50", "10:30", "11:30"],
//     tarde: ["13:30", "14:30", "15:20", "Intervalo", "15:50", "16:30", "17:30"],
//     noite: ["18:30", "19:30", "20:20", "Intervalo", "20:50", "21:30"]
// };

function criarHorarios(len) {
    let arr = [];
    for (i = 0; i <= len; i++) { arr.push(vagaToHora(i)) }
    return arr;
}

const horarios = criarHorarios(30);


const tabelaHorarios = document.getElementById("linhaHorarios");
const corpoTabela = document.getElementById("corpoTabela");
const selectTurno = document.getElementById("turno");
selectTurno.innerHTML = "";

getDias().then(data => {
    data.sort((a, b) => new Date(a) - new Date(b)).forEach(dia => {
        selectTurno.innerHTML += `<option value="${dia}">${dia}</option>`
    });
});

async function getTabela(dia) {
    let agendamentos = await getData();
    const tabela = agendamentos[dia];
    return tabela;
}

async function gerarTabela(tabela) {
    tabelaHorarios.innerHTML = "<th></th>" + horarios.map(h => `<th>${h}</th>`).join("");

    corpoTabela, innerHTML = ""

    for (let i = 0; i < salasLista.length; i++) {
        const sala = tabela[salasLista[i]];
        console.log(sala);

        const celulas = sala.map(h => {
            if (h == "") {
                return `<td class="aberto">Aberto</td>`;
            }
            else {
                return `<td class="ocupado">${h}</td>`;
            }
        }).join("");

        corpoTabela.innerHTML += `<tr><td class="sala">${i}</td>${celulas}</tr>`
    }
}

let hoje = new Date().toJSON().slice(0, 10);;
let vagasHoje;
getData().then(data => {
    if (!(hoje in data)) {
        vagasHoje = criarDia();
    }
    else {
        vagasHoje = data[hoje];
    }
});

gerarTabela(hoje);

// Alterna entre turnos
selectTurno.addEventListener("change", e => {
    gerarTabela(getTabela(e.target.value));
});

