function horaToVaga(hora){
    let stunden = hora.split(":")[0];
    let minuten = hora.split(":")[1];
}

async function getData() {
    const response = await fetch('/get-data');
    const data = await response.json();

    return data;
}

function pushData(newData) {
    fetch('/push-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Server response:", data);
    })
    .catch(error => {
        console.error("Error:", error);
    });
}