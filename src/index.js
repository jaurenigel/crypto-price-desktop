const electron = require('electron')
const path = require('path')
const BrowserWindow = electron.remote.BrowserWindow
const ipc = electron.ipcRenderer

const axios = require('axios')

const notifyBtn = document.getElementById('notifyBtn')

var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')

var targetPriceVal

const notification = {
    title: 'Crypto-Price Alert',
    body: 'BTC just reach your target price',
    icon: path.join(__dirname, '../assets/images/btc.png')
}


function getBTC(){
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
        const crypto = res.data.BTC.USD
        price.innerHTML = '$'+crypto.toLocaleString('en')

        if(targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD){
            const myNotification = new window.Notification(notification.title, notification)
        }
    })
}



getBTC()
setInterval(getBTC, 30000)

notifyBtn.addEventListener('click', function(event){
    const modalPath = path.join('file://', __dirname, 'add.html')
    let win = new BrowserWindow({frame:false, transparent: true, alwaysOnTop:true, width:400, height:200})
    win.on('close', function(){
        win = null
    })
    win.loadURL(modalPath)
    win.show()
})


ipc.on('targetPriceVal', function(event, arg){
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en')
})