// interact.js
const { ethers } = require('ethers');

// Підключення до Anvil
const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');

// Приватний ключ з Anvil
const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);

// ABI вашого токену (мінімальний)
const tokenABI = [
    'function name() view returns (string)',
    'function symbol() view returns (string)',
    'function totalSupply() view returns (uint256)',
    'function balanceOf(address) view returns (uint256)',
    'function transfer(address to, uint256 amount) returns (bool)'
];

// ЗАМІНІТЬ на адресу вашого задеплоєного контракту!
const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

async function main() {
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenABI, wallet);

    console.log('=== Інформація про токен ===');
    console.log('Назва:', await token.name());
    console.log('Символ:', await token.symbol());
    console.log('Загальна кількість:', ethers.formatEther(await token.totalSupply()));

    console.log('\n=== Баланси ===');
    const balance = await token.balanceOf(wallet.address);
    console.log('Ваш баланс:', ethers.formatEther(balance));

    // Приклад переказу
    console.log('\n=== Переказ токенів ===');
    const recipient = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // Другий акаунт з Anvil
    const amount = ethers.parseEther('100'); // 100 токенів

    const tx = await token.transfer(recipient, amount);
    console.log('Транзакція відправлена:', tx.hash);

    await tx.wait();
    console.log('Транзакція підтверджена!');

    const newBalance = await token.balanceOf(wallet.address);
    const recipientBalance = await token.balanceOf(recipient);
    console.log('Ваш новий баланс:', ethers.formatEther(newBalance));
    console.log('Баланс отримувача:', ethers.formatEther(recipientBalance));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });