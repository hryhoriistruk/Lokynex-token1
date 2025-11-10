export default function AccountSelector({ accounts, onSelect }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">🔑 Швидкий вибір акаунта</h2>
            <div className="grid grid-cols-2 gap-3">
                {accounts.map((a, i) => (
                    <button key={a.addr} onClick={() => onSelect(i)} className="p-3 bg-white border rounded-lg hover:bg-indigo-100 text-sm">
                        {a.addr.slice(0, 10)}...{a.addr.slice(-6)}
                    </button>
                ))}
            </div>
        </div>
    );
}
