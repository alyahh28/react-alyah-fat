import PageHeader from "../components/PageHeader";

export default function Customers() {
    return (
        <div className="p-4">
            <PageHeader title="Customer List" />
            <div className="bg-white p-6 rounded-3xl shadow-sm mt-4 text-stone-500">
                Daftar pelanggan LuxWood akan muncul di sini.
            </div>
        </div>
    );
}