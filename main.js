
// Check if MetaMask is installed
if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    window.web3 = new Web3(window.ethereum)
    console.log("Metamask is installed")
} else {
    alert('Metamask is not installed. Install it from:','https://metamask.io/download.html')
}

let isRequestPending = false

// Function to connect to MetaMask
async function connectMetaMask() {
    if (isRequestPending) {
        document.getElementById("metamask_output").innerText = "MetaMask connection is already in progress. Please wait."
        return
    }
    isRequestPending = true
    
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        if (accounts && accounts.length > 0) {
          account = accounts[0]
          document.getElementById("metamask_output").innerText = "Metamask is connected: " + account
        }
        else {
          document.getElementById("metamask_output").innerText = "Metamask is disconnected"
        }
    } catch (error) {
        if (error.code === 4001) {
          document.getElementById("metamask_output").innerText = "User rejected Metamask connection request"
          console.error("Error connecting to Metamask", error)
        }
        else if (error.message) {
          document.getElementById("metamask_output").innerText = error.message
          console.error("Error connecting to Metamask", error)
        }
        else {
            document.getElementById("metamask_output").innerText = "Failed to connect to Metamask"
            console.error("Error connecting to Metamask", error)
        }
    } finally {
        isRequestPending = false
    }
}

// Function to get ETH balance
async function getETHBalance() {
    const walletAddress = document.getElementById("wallet").value
    if (!web3.utils.isAddress(walletAddress)) {
        document.getElementById("eth_output").innerText = "Invalid Ethereum wallet address"
        return
    }

    try {
        const balance = await web3.eth.getBalance(walletAddress)
        const ethBalance = web3.utils.fromWei(balance, 'ether')
        document.getElementById("eth_output").innerText = "ETH Balance for " + walletAddress + ": " + ethBalance + " ETH"
    } catch (error) {
        console.error("Error fetching ETH balance", error);
        document.getElementById("eth_output").innerText = "Failed to fetch ETH balance"
    }
}

// Function to get USDT balance
async function getUSDTBalance() {
    const walletAddress = document.getElementById("wallet").value
    if (!web3.utils.isAddress(walletAddress)) {
        document.getElementById("usdt_output").innerText = "Invalid Ethereum wallet address"
        return
    }

    // USDT contract address on Ethereum mainnet
    const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'

    // USDT contract ABI (only balanceOf function)
    const usdtAbi = [
        {
            "constant": true,
            "inputs": [{"name": "_owner", "type": "address"}],
            "name": "balanceOf",
            "outputs": [{"name": "balance", "type": "uint256"}],
            "type": "function"
        }
    ]

    try {
        const contract = new web3.eth.Contract(usdtAbi, usdtContractAddress)
        const balance = await contract.methods.balanceOf(walletAddress).call()
        const usdtBalance = web3.utils.fromWei(balance, 'mwei') // USDT uses 6 decimal places
        document.getElementById("usdt_output").innerText = "USDT Balance for " + walletAddress + ": " + usdtBalance + " USDT"
    } catch (error) {
        console.error("Error fetching USDT balance", error)
        document.getElementById("error_output").innerText = "Failed to fetch USDT balance"
    }
}

function clearAll() {
    document.getElementById("wallet").value = ''
    document.getElementById("eth_output").innerText = ''
    document.getElementById("usdt_output").innerText = ''
    document.getElementById("error_output").innerText = ''
}