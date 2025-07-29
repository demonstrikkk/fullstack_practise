import { authOptions as nextAuthOptions } from "@/app/api/auth/[...nextauth]/route";


export const authOptions = nextAuthOptions;
export const fetcher = (url) => fetch(url).then(res => res.json());