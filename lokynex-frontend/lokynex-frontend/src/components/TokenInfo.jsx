export default function TokenInfo({ data }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">📊 Інформація про токен</h2>
            <div className="space-y-2">
                <div className="flex justify-between"><span>Назва:</span><span>{data.name || "-"}</span></div>
                <div className="flex justify-between"><span>Символ:</span><span>{data.symbol || "-"}</span></div>
                <div className="flex justify-between"><span>Загальна кількість:</span><span>{data.total || "-"}</span></div>
                <div className="flex justify-between"><span>Адреса контракту:</span><span className="text-xs text-indigo-500">{TOKEN_ADDRESS}</span></div>
            </div>
        </div>
    );
}
