import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-md">
                <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
                <p className="text-gray-600 mt-2">
                    You don&apos;t have permission to access this page.
                </p>
                <Link href="/">
                    <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Go to Login
                    </button>
                </Link>
            </div>
        </main>
    );
}
