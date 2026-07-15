export default function Loading() {
    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-stone-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin"></div>
                <p className="text-stone-400 font-bold animate-pulse">Memuat FurnitureQ...</p>
            </div>
        </div>
    );
}