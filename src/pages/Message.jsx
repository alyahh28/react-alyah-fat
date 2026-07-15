import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import { FaReply, FaCheck } from "react-icons/fa";

export default function Message() {
    const [messages, setMessages] = useState([]);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem("admin_messages");
        if (stored) {
            setMessages(JSON.parse(stored));
        } else {
            const initial = [
                { id: 1, user: "Budi Santoso", msg: "Apakah bisa request ukuran meja makan 200x100cm?", time: "10:30 AM", unread: true },
                { id: 2, user: "Santi Rahayu", msg: "Terima kasih, lemari jatinya sudah sampai dengan selamat.", time: "Yesterday", unread: false, reply: "Sama-sama Bu Santi!" },
            ];
            setMessages(initial);
            localStorage.setItem("admin_messages", JSON.stringify(initial));
        }
    }, []);

    const saveMessages = (newMessages) => {
        setMessages(newMessages);
        localStorage.setItem("admin_messages", JSON.stringify(newMessages));
    };

    const handleMarkAsRead = (id) => {
        const updated = messages.map(m => m.id === id ? { ...m, unread: false } : m);
        saveMessages(updated);
    };

    const handleReplySubmit = (e, id) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        const updated = messages.map(m => m.id === id ? { ...m, unread: false, reply: replyText } : m);
        saveMessages(updated);
        setReplyingTo(null);
        setReplyText("");
    };

    return (
        <div className="p-4 md:p-8 font-poppins">
            <PageHeader title="Customer Messages" />
            <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mt-6">
                {messages.length === 0 ? (
                    <p className="p-8 text-center text-stone-500">Belum ada pesan.</p>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className="border-b border-stone-50 last:border-0">
                            <div 
                                onClick={() => handleMarkAsRead(m.id)}
                                className={`p-5 flex flex-col md:flex-row md:items-center justify-between hover:bg-stone-50 transition-colors cursor-pointer ${m.unread ? 'bg-amber-50/30' : ''}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-stone-200 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-stone-500">
                                        {m.user.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-stone-800">{m.user}</h4>
                                        <p className="text-sm text-stone-600 mt-1">{m.msg}</p>
                                        
                                        {m.reply && (
                                            <div className="mt-3 bg-stone-100 p-3 rounded-xl border border-stone-200 relative">
                                                <div className="absolute -top-2 left-4 w-4 h-4 bg-stone-100 border-l border-t border-stone-200 transform rotate-45"></div>
                                                <p className="text-xs font-bold text-stone-500 mb-1 flex items-center gap-1"><FaCheck size={10}/> Balasan Anda:</p>
                                                <p className="text-sm text-stone-700">{m.reply}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4 md:mt-0 text-right flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                                    <span className="text-[11px] text-stone-400 font-medium">{m.time}</span>
                                    {m.unread ? (
                                        <span className="w-2 h-2 bg-amber-600 rounded-full"></span>
                                    ) : (
                                        !m.reply && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); setReplyingTo(m.id); setReplyText(""); }} 
                                                className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg"
                                            >
                                                <FaReply size={10} /> Balas
                                            </button>
                                        )
                                    )}
                                </div>
                            </div>
                            
                            {replyingTo === m.id && (
                                <div className="p-4 bg-stone-50 border-t border-stone-100">
                                    <form onSubmit={(e) => handleReplySubmit(e, m.id)} className="flex gap-3">
                                        <input 
                                            type="text" 
                                            autoFocus
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            placeholder="Tulis balasan Anda..."
                                            className="flex-1 px-4 py-2 text-sm border border-stone-300 rounded-xl outline-none focus:border-indigo-500"
                                        />
                                        <button type="button" onClick={() => setReplyingTo(null)} className="px-4 py-2 text-sm font-bold text-stone-500 bg-stone-200 rounded-xl hover:bg-stone-300">Batal</button>
                                        <button type="submit" className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md">Kirim</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}