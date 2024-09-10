export default function Home() {
    return (
        <main className="flex min-w-full min-h-screen flex-col items-center justify-center">
            <div className="px-12 py-8">
                <h1 className="text-4xl font-bold">NEVER PANEL</h1>
                <p className="text-sm font-light text-slate-500">NEVER ADMIN PANEL FOR MANAGING NEVERBE WEBSITE.</p>

                <div className="mt-4 w-full flex-row flex">
                    <form className="flex flex-col gap-5 w-full">
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-lg">Email</span>
                            <input type="email" required placeholder="Email" className="bg-slate-200 rounded h-[7vh] px-4 py-2"/>
                        </label>
                        <label className="flex-col flex gap-1">
                            <span className="font-medium text-lg">Password</span>
                            <input type="password" required placeholder="Password" className="bg-slate-200 rounded h-[7vh] px-4 py-2"/>
                        </label>
                        <button type="submit" className="bg-black rounded-lg text-white px-4 py-2 font-bold hover:bg-gray-900 hover:scale-105 transition-all duration-300">Login</button>
                    </form>
                </div>
            </div>
            <footer>
                <p className="text-sm text-slate-500">© {new Date().getFullYear().toString()} NEVERBE. All Rights Reserved.</p>
            </footer>
        </main>
    );
}
