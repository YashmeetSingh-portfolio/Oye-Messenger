import { Tabs } from "expo-router";

export default function TabsNavigator(){
    return <Tabs>

        <Tabs.Screen name='index' options={{title: 'Chats'}}/>
        <Tabs.Screen name='profile' options={{title: 'Me'}}/>
        
       </Tabs>
}