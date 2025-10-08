import UserListItem from "@/src/components/UserListItem";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";



export default function UsersScreen() {
    const [users, setUsers] = React.useState([]);
    const {user} = useAuth();
    

    useEffect(() => {
        const fetchUsers = async () => {
            let { data: profiles, error } = await supabase
                .from('profiles') 
                .select('*')
                .neq('id', user?.id); //exclude current user
            setUsers(profiles);    
        }
        fetchUsers();


    }, [])
    return (

        <FlatList
            data={users}
            contentContainerStyle={{gap:5}}
            renderItem={({ item }) => <UserListItem user={item} />}


        />
    );

}