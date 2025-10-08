import UserListItem from "@/src/components/UserListItem";
import { supabase } from "@/src/lib/supabase";
import { useAuth } from "@/src/providers/AuthProvider";
import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";

type Profile = {
    id: string;
    full_name: string;
    avatar_url?: string | null;
    [key: string]: any;
};

export default function UsersScreen() {
    const [users, setUsers] = React.useState<Profile[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .neq('id', user?.id); // exclude current user

            if (profiles) setUsers(profiles);
        };
        fetchUsers();
    }, []);

    return (
        <FlatList
            data={users}
            contentContainerStyle={{ gap: 5 }}
            renderItem={({ item }) => <UserListItem user={item} />}
        />
    );
}
