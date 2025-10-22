import AntDesign from '@expo/vector-icons/AntDesign';
import { Tabs } from "expo-router";
import { Text } from 'react-native';
export default function TabsNavigator(){
        const TAB_BAR_HEIGHT = 90;
    
    // Define your colors
    const ACTIVE_COLOR = '#24786D';
    const INACTIVE_COLOR = '#797C7B';

    // A helper function to define the icon for each tab
    const getTabBarIcon = (name: string, focused: boolean, color: string, size: number) => {
        // The 'color' prop passed here will already be the active/inactive color 
        // set by the tab bar, but we can override it directly for control.
        const iconColor = focused ? ACTIVE_COLOR : INACTIVE_COLOR;
        
        // Use a suitable icon from Ionicons (or any other icon library you prefer)
        let iconName;
        if (name === 'index') {
            iconName = focused ? 'message' : 'message';
        } else if (name === 'users') {
            iconName = focused ? 'user-add' : 'user-add';
        } else if (name === 'profile') {
            iconName = focused ? 'setting' : 'setting';
        }
        
        // Pass a larger, fixed size for bigger icons
        return <AntDesign name={iconName} size={26} color={iconColor} />; 
    };

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                
                // --- Shared Tab Bar Styles (for height and structure) ---
                tabBarStyle: {
                    height: TAB_BAR_HEIGHT,
                    paddingTop: 10,
                    backgroundColor: 'white',
                },
                tabBarItemStyle: {
                    justifyContent: 'center', 
                    alignItems: 'center',
                },
            }}
        >

            {/* --- Screen 1: Home (index) --- */}
            <Tabs.Screen
                name='index'
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text 
                            style={{ 
                                fontSize: 16,
                                fontWeight: '400',
                                color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, // <-- COLOR LOGIC HERE
                                marginBottom: 5,
                            }}
                        >
                            Chats
                        </Text>
                    ),
                    tabBarIcon: ({ focused, color, size }) => getTabBarIcon('index', focused, color, size), // <-- ICON LOGIC HERE
                }}
            />

            {/* --- Screen 2: Users --- */}
            <Tabs.Screen
                name='users'
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text 
                            style={{ 
                                fontSize: 16,
                                fontWeight: '400',
                                color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, // <-- COLOR LOGIC HERE
                                marginBottom: 5,
                            }}
                        >
                            Users
                        </Text>
                    ),
                    tabBarIcon: ({ focused, color, size }) => getTabBarIcon('users', focused, color, size), // <-- ICON LOGIC HERE
                }}
            />

            {/* --- Screen 3: Profile --- */}
            <Tabs.Screen
                name='profile'
                options={{
                    tabBarLabel: ({ focused }) => (
                        <Text 
                            style={{ 
                                fontSize: 16,
                                fontWeight: '400',
                                color: focused ? ACTIVE_COLOR : INACTIVE_COLOR, // <-- COLOR LOGIC HERE
                                marginBottom: 5,
                            }}
                        >
                            Settings
                        </Text>
                    ),
                    tabBarIcon: ({ focused, color, size }) => getTabBarIcon('profile', focused, color, size), // <-- ICON LOGIC HERE
                }}
            />
        </Tabs>
    );
}