"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabLayout;
const expo_router_1 = require("expo-router");
function TabLayout() {
    return (<expo_router_1.Tabs screenOptions={{
            tabBarActiveTintColor: '#0033FF',
            tabBarStyle: {
                backgroundColor: '#FFF',
            },
        }}>
      <expo_router_1.Tabs.Screen name="index" options={{
            title: 'KPIs',
            headerTitle: 'Dashboard',
        }}/>
      <expo_router_1.Tabs.Screen name="stock" options={{
            title: 'Stock',
            headerTitle: 'Stock Count',
        }}/>
      <expo_router_1.Tabs.Screen name="alerts" options={{
            title: 'Alerts',
            headerTitle: 'Anomaly Alerts',
        }}/>
    </expo_router_1.Tabs>);
}
//# sourceMappingURL=_layout.js.map