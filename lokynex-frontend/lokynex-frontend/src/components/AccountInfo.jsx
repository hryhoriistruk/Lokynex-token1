export default function AccountInfo({ wallet, balance, onRefresh }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">👛 Ваш акаунт</h2>
            <div className="flex justify-between"><span>Адреса:</span><span className="text-xs">{wallet?.address || "-"}</span></div>
            <div className="flex justify-between"><span>Баланс:</span><span>{balance}</span></div>
            <button onClick={onRefresh} className="mt-3 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                🔄 Оновити баланс
            </button>
        </div>
    );
}
