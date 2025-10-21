async function getData() {
    const response = await fetch('/get-data');
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

function agendar(dia, inicio, fim, sala, coisa) {
    fetch('/agendar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            dia: dia,
            inicio: inicio,
            fim: fim,
            sala: sala,
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