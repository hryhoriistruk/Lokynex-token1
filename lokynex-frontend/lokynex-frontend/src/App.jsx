import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Конфігурація токена Lokynex
const TOKEN_CONFIG = {
    address: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    abi: [
        "function name() view returns (string)",
        "function symbol() view returns (string)",
        "function totalSupply() view returns (uint256)",
        "function balanceOf(address) view returns (uint256)",
        "function transfer(address to, uint256 amount) returns (bool)",
        "function decimals() view returns (uint8)"
    ],
    rpcUrl: "http://127.0.0.1:8545"
};

// Акаунти з Anvil для тестування
const TEST_ACCOUNTS = [
    {
        address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        privateKey: "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        name: "👑 Основной аккаунт"
    },
    {
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        privateKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
        name: "💼 Тестовый 1"
    },
    {
        address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
        privateKey: "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
        name: "🚀 Тестовый 2"
    }
];

function App() {
    const [provider, setProvider] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [token, setToken] = useState(null);
    const [tokenInfo, setTokenInfo] = useState({});
    const [balance, setBalance] = useState("0");
    const [selectedAccount, setSelectedAccount] = useState(0);
    const [status, setStatus] = useState("🔌 Підключення до мережі...");
    const [transferTo, setTransferTo] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Ініціалізація
    useEffect(() => {
        initializeBlockchain();
    }, []);

    const initializeBlockchain = async () => {
        try {
            setIsLoading(true);
            setStatus("🔄 Підключення до локальної мережі...");

            const prov = new ethers.providers.JsonRpcProvider(TOKEN_CONFIG.rpcUrl);
            setProvider(prov);

            const wallet = new ethers.Wallet(TEST_ACCOUNTS[0].privateKey, prov);
            setWallet(wallet);

            const tokenContract = new ethers.Contract(TOKEN_CONFIG.address, TOKEN_CONFIG.abi, wallet);
            setToken(tokenContract);

            await loadTokenInfo(tokenContract);
            await loadBalance(tokenContract, wallet.address);

            setStatus("✅ Успішно підключено до Lokynex Token!");

        } catch (error) {
            setStatus(`❌ Помилка: ${error.message}`);
            console.error("Initialization error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const loadTokenInfo = async (tokenContract) => {
        try {
            const [name, symbol, totalSupply, decimals] = await Promise.all([
                tokenContract.name(),
                tokenContract.symbol(),
                tokenContract.totalSupply(),
                tokenContract.decimals ? tokenContract.decimals() : Promise.resolve(18)
            ]);

            setTokenInfo({
                name,
                symbol,
                totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
                decimals
            });
        } catch (error) {
            console.error("Error loading token info:", error);
        }
    };

    const loadBalance = async (tokenContract, address) => {
        try {
            const balance = await tokenContract.balanceOf(address);
            const decimals = tokenInfo.decimals || 18;
            setBalance(ethers.utils.formatUnits(balance, decimals));
        } catch (error) {
            console.error("Error loading balance:", error);
            setBalance("0");
        }
    };

    const switchAccount = async (accountIndex) => {
        try {
            setIsLoading(true);
            setStatus("🔄 Зміна акаунта...");
            setSelectedAccount(accountIndex);

            const newWallet = new ethers.Wallet(TEST_ACCOUNTS[accountIndex].privateKey, provider);
            setWallet(newWallet);

            const newToken = new ethers.Contract(TOKEN_CONFIG.address, TOKEN_CONFIG.abi, newWallet);
            setToken(newToken);

            await loadBalance(newToken, newWallet.address);
            setStatus(`✅ Переключено на ${TEST_ACCOUNTS[accountIndex].name}`);

        } catch (error) {
            setStatus(`❌ Помилка зміни акаунта: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTransfer = async () => {
        if (!token || !transferTo || !transferAmount) {
            setStatus("❌ Заповніть всі поля для трансферу");
            return;
        }

        try {
            setIsLoading(true);
            setStatus("⏳ Відправка транзакції...");

            const decimals = tokenInfo.decimals || 18;
            const amount = ethers.utils.parseUnits(transferAmount, decimals);

            const tx = await token.transfer(transferTo, amount);
            setStatus("⏳ Очікування підтвердження...");

            await tx.wait();

            await loadBalance(token, wallet.address);

            setStatus(`✅ Успішно відправлено ${transferAmount} ${tokenInfo.symbol}`);
            setTransferAmount("");
            setTransferTo("");

        } catch (error) {
            setStatus(`❌ Помилка трансферу: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const refreshBalance = async () => {
        if (token && wallet) {
            setStatus("🔄 Оновлення балансу...");
            await loadBalance(token, wallet.address);
            setStatus("✅ Баланс оновлено!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Анімований фон */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -inset-10 opacity-20">
                    <div
                        className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
                    <div
                        className="absolute top-1/3 right-1/4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
                    <div
                        className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
                </div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto py-8 px-4">
                {/* Заголовок */}
                <div className="text-center mb-12">
                    {/* Контейнер для логотипу - дуже маленький */}
                    <div
                        className="inline-flex items-center justify-center w-1 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-lg overflow-hidden">
                        <img
                            src="/assets/img.png"
                            alt="Lokynex Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        Lokynex Token
                    </h1>
                    <p className="text-gray-300 text-lg">Децентралізована платформа для управління токенами</p>
                </div>

                {/* Статус панель */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className={`w-4 h-4 rounded-full animate-pulse ${
                                status.includes('❌') ? 'bg-red-500' :
                                    status.includes('✅') ? 'bg-green-500' :
                                        'bg-yellow-500'
                            }`}></div>
                            <span className="text-white font-medium">{status}</span>
                        </div>
                        <button
                            onClick={refreshBalance}
                            disabled={isLoading}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            {isLoading ? '⏳' : '🔄'} Оновити
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Картка токена */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">💰</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Інформація про токен</h2>
                        </div>

                        <div className="space-y-4">
                            <div
                                className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-gray-300">Назва:</span>
                                <span
                                    className="font-semibold text-white text-lg">{tokenInfo.name || "Lokynex Token"}</span>
                            </div>
                            <div
                                className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-gray-300">Символ:</span>
                                <span className="font-bold text-cyan-400 text-lg">{tokenInfo.symbol || "LOKX"}</span>
                            </div>
                            <div
                                className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-gray-300">Загальна кількість:</span>
                                <span className="font-semibold text-white">{tokenInfo.totalSupply || "0"}</span>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-gray-300 block mb-2">Адреса контракту:</span>
                                <code
                                    className="text-cyan-300 font-mono text-sm break-all">{TOKEN_CONFIG.address}</code>
                            </div>
                        </div>
                    </div>

                    {/* Картка акаунта */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">👤</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Ваш акаунт</h2>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                                <span className="text-gray-300 block mb-1">Адреса:</span>
                                <code className="text-green-300 font-mono text-sm break-all">{wallet?.address}</code>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
                                <span className="text-white/80 block mb-1">Баланс:</span>
                                <span className="text-3xl font-bold text-white">{balance}</span>
                                <span className="text-white/90 font-semibold ml-2">{tokenInfo.symbol}</span>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold text-white mb-4 text-lg">Швидкий вибір акаунта:</h3>
                            <div className="space-y-3">
                                {TEST_ACCOUNTS.map((account, index) => (
                                    <button
                                        key={account.address}
                                        onClick={() => switchAccount(index)}
                                        disabled={isLoading}
                                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 border-2 ${
                                            selectedAccount === index
                                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-transparent text-white shadow-lg transform scale-105'
                                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 hover:text-white'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <div className="font-medium">{account.name}</div>
                                        <div
                                            className="text-sm opacity-80 mt-1">{account.address.slice(0, 12)}...{account.address.slice(-8)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Картка трансферу */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
                        <div className="flex items-center space-x-3 mb-6">
                            <div
                                className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">🚀</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">Переказ токенів</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-gray-300 mb-3 font-medium">Адреса отримувача:</label>
                                <input
                                    type="text"
                                    value={transferTo}
                                    onChange={(e) => setTransferTo(e.target.value)}
                                    placeholder="0x742d35Cc6634C0532925a3b844Bc454e4438f44e"
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-3 font-medium">
                                    Кількість <span className="text-cyan-400">{tokenInfo.symbol}</span>:
                                </label>
                                <input
                                    type="number"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(e.target.value)}
                                    placeholder="0.0"
                                    step="0.001"
                                    className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <button
                                onClick={handleTransfer}
                                disabled={!transferTo || !transferAmount || isLoading}
                                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div
                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Обробка...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>⚡</span>
                                        <span>Відправити токени</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Інструкція */}
                <div
                    className="mt-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl border border-yellow-500/30 p-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <span className="text-xl">💡</span>
                        </div>
                        <h3 className="text-2xl font-bold text-white">Як використовувати</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-yellow-100">
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold">1
                            </div>
                            <span>Запустіть локальну мережу: <code
                                className="bg-yellow-500/30 px-2 py-1 rounded">anvil</code></span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold">2
                            </div>
                            <span>Деплойте токен Lokynex на мережу</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold">3
                            </div>
                            <span>Переконайтесь у правильності адреси контракту</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div
                                className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center font-bold">4
                            </div>
                            <span>Використовуйте тестові акаунти для транзакцій</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

    export default App;