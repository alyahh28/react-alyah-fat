import PageHeader from "../components/PageHeader";

export default function Orders() {
    return (
        <div className="p-4">
            <PageHeader title="Orders List" />
            <div className="bg-white p-6 rounded-3xl shadow-sm mt-4 text-stone-500">
                Belum ada pesanan furniture masuk.
            </div>
        </div>
    );
}