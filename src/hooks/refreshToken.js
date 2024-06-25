import { jwtDecode } from "jwt-decode";
import axios from "../api/axios"
import { useAuth } from "./auth"

export const RefreshToken = () => {
    const { setData } = useAuth();

    const REFRESHTOKEN_URL = '/auth/refresh-token'

    const refresh = async () => {
        const boss = localStorage.getItem('random')
        if(boss) {
            const URL = `${REFRESHTOKEN_URL}/${boss}`
            try{
                const response = await axios.get(URL);

                const user = jwtDecode(response.data)

                setData(prev => {
                    return {
                        ...prev,
                        accessToken: response.data,
                        userName: user.userName
                    }
                });
                return response.data
            } catch (err) {
                throw err;
            }
        }
    }

    return refresh
}