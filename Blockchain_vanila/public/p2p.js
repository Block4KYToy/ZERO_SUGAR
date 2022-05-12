let ipAddress;
let port;
let msg;
let sentDiv;
let receivedDiv;

function handleSubmit(e) {
    
    ipAddress = document.getElementById("ipAddress").value;
    port = document.getElementById("port").value;
    let fullAddress = "ws://" + ipAddress + ":" + port;
    alert(fullAddress)
    e.preventDefault()

}

const onClickHandler = (e) => {
    // console.log(e)


    switch (e.target.id) {
        case 'connect':
            ipAddress = document.getElementById("ipAddress").value;
            port = document.getElementById("port").value;
            console.log(`ipAddress: ${ipAddress}, port: ${port}`)
            // console.log(ipAddress)
            // console.log(port)

            let fullAddress = "ws://" + ipAddress + ":" + port;
            console.log(fullAddress)

            break
        case 'enter':
            msg = document.getElementById("inputValue").value
            console.log(msg)
            document.getElementById("senderMsg").innerText = msg //이걸 addelement로
            sentDiv = document.createElement("div");
            break
    }
}

document.getElementById("connect").onclick = onClickHandler;
// document.getElementById("enter").onclick = onClickHandler;





