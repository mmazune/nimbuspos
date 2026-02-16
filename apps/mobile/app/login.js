"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Login;
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const API_BASE_URL = 'http://localhost:4000'; // TODO: Move to env config
function Login() {
    const [username, setUsername] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(false);
    const router = (0, expo_router_1.useRouter)();
    const handleLogin = async () => {
        if (!username || !password) {
            react_native_1.Alert.alert('Error', 'Please enter username and password');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) {
                const error = await response.json();
                react_native_1.Alert.alert('Login Failed', error.message || 'Invalid credentials');
                setLoading(false);
                return;
            }
            const data = await response.json();
            await async_storage_1.default.setItem('authToken', data.access_token);
            await async_storage_1.default.setItem('userId', data.userId);
            await async_storage_1.default.setItem('orgId', data.orgId);
            await async_storage_1.default.setItem('branchId', data.branchId);
            router.replace('/(tabs)');
        }
        catch (error) {
            console.error('Login error:', error);
            react_native_1.Alert.alert('Error', 'Failed to connect to server');
        }
        finally {
            setLoading(false);
        }
    };
    return (<react_native_1.View style={styles.container}>
      <react_native_1.Text style={styles.title}>ChefCloud Mobile</react_native_1.Text>
      <react_native_1.Text style={styles.subtitle}>Manager Login</react_native_1.Text>

      <react_native_1.View style={styles.form}>
        <react_native_1.TextInput style={styles.input} placeholder="Username" value={username} onChangeText={setUsername} autoCapitalize="none" editable={!loading}/>
        <react_native_1.TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry editable={!loading}/>
        <react_native_1.TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          <react_native_1.Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEDF3',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00033D',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#0033FF',
        marginBottom: 40,
    },
    form: {
        width: '100%',
        maxWidth: 400,
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0033FF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#AAA',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
//# sourceMappingURL=login.js.map