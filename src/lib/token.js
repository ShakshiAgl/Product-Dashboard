const KEY = "accessToken";

export const tokenStore = {
    get(){
       if (typeof document === "undefined") return null;
       const found = document.cookie.split("; ").find((c)=>startsWith(`${KEY}=`));
       return found ? decodeURIComponent(found.slice(KEY.length + 1)) : null;
    }, 
    set(token){
       document.cookie = `${KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60}; SameSite=Lax`;
    },
    clear(){
        document.cookie = `${KEY}=; path=/; max-age=0`;
    },
};