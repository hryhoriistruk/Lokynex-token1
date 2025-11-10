import { useState } from "react";

export default function TransferForm({ onTransfer }) {
    const [to, setTo] = useState("");
    const [amount, setAmount] = useState("");

    return (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">💸 Перевести токени</h2>
            <input type="text" placeholder="Адреса отримувача (0x...)" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border rounded-lg p-2 mb-2" />
            <input type="number" placeholder="Кількість токенів" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full border rounded-lg p-2 mb-2" />
            <button onClick={() => onTransfer(to, amount)} className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                Відправити
            </button>
        </div>
    );
}
