export const authorizeRequest =  (req: any, url: any) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const uid = new URL(req.url).searchParams.get("uid");

    if (!token || !uid) {
        console.warn("Authorization Failed!");
        return false;
    }
    return true;
}