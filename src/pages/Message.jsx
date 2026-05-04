import PageHeader from "../components/PageHeader";
import { FaReply } from "react-icons/fa";

export default function Message() {
    const messages = [
        { id: 1, user: "Budi Santoso", msg: "Apakah bisa request ukuran meja makan 200x100cm?", time: "10:30 AM", unread: true },
        { id: 2, user: "Santi Rahayu", msg: "Terima kasih, lemari jatinya sudah sampai dengan selamat.", time: "Yesterday", unread: false },
    ];

    return (
        <div className="p-4">
            <PageHeader title="Customer Messages" />
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mt-6">
                {messages.map((m) => (
                    <div key={m.id} className={`p-5 flex items-center justify-between border-b border-stone-50 hover:bg-stone-50 transition-colors cursor-pointer ${m.unread ? 'bg-amber-50/30' : ''}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-stone-500">
                                {m.user.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800">{m.user}</h4>
                                <p className="text-sm text-stone-500 truncate max-w-md">{m.msg}</p>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end gap-2">
                            <span className="text-[11px] text-stone-400 font-medium">{m.time}</span>
                            {m.unread ? (
                                <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                            ) : (
                                <FaReply className="text-stone-300 text-xs" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}