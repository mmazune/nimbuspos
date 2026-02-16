"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Index;
const react_1 = require("react");
const expo_router_1 = require("expo-router");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const react_native_1 = require("react-native");
function Index() {
    const router = (0, expo_router_1.useRouter)();
    (0, react_1.useEffect)(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        try {
            const token = await async_storage_1.default.getItem('authToken');
            if (token) {
                router.replace('/(tabs)');
            }
            else {
                router.replace('/login');
            }
        }
        catch (error) {
            console.error('Auth check error:', error);
            router.replace('/login');
        }
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.ActivityIndicator size="large" color="#0033FF"/>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEDF3',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
//# sourceMappingURL=index.js.map