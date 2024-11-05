export const authorizeRequest =  (req: any) => {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const uid = new URL(req.url).searchParams.get("uid");

    if (token == "undefined" || uid == "undefined") {
        console.warn("Authorization Failed!");
        return false;
    }else{
        console.log("Authorization Success!");
        return true;
    }
}