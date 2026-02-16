"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dashboard;
const react_1 = require("react");
const react_native_1 = require("react-native");
const expo_router_1 = require("expo-router");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const API_BASE_URL = 'http://localhost:4000';
function Dashboard() {
    const [data, setData] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, expo_router_1.useRouter)();
    const fetchKPIs = async () => {
        try {
            const token = await async_storage_1.default.getItem('authToken');
            if (!token) {
                router.replace('/login');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/owner/overview`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 401) {
                await async_storage_1.default.clear();
                router.replace('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch KPIs');
            }
            const kpis = await response.json();
            setData(kpis);
            setError(null);
        }
        catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchKPIs();
    }, []);
    const handleLogout = async () => {
        await async_storage_1.default.clear();
        router.replace('/login');
    };
    if (loading) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.ActivityIndicator size="large" color="#0033FF"/>
        <react_native_1.Text style={styles.loadingText}>Loading KPIs...</react_native_1.Text>
      </react_native_1.View>);
    }
    if (error) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.Text style={styles.errorText}>Error: {error}</react_native_1.Text>
        <react_native_1.TouchableOpacity style={styles.button} onPress={fetchKPIs}>
          <react_native_1.Text style={styles.buttonText}>Retry</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    if (!data) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.Text style={styles.errorText}>No data available</react_native_1.Text>
      </react_native_1.View>);
    }
    const momoTotal = data.paymentBreakdown.find((p) => p.method === 'MOMO')?.amount || 0;
    const cashTotal = data.paymentBreakdown.find((p) => p.method === 'CASH')?.amount || 0;
    const total = momoTotal + cashTotal;
    const momoPercent = total > 0 ? ((momoTotal / total) * 100).toFixed(1) : '0';
    const cashPercent = total > 0 ? ((cashTotal / total) * 100).toFixed(1) : '0';
    return (<react_native_1.ScrollView style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.title}>Dashboard</react_native_1.Text>
        <react_native_1.TouchableOpacity onPress={handleLogout}>
          <react_native_1.Text style={styles.logoutText}>Logout</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      <react_native_1.View style={styles.card}>
        <react_native_1.Text style={styles.cardTitle}>Sales Overview</react_native_1.Text>
        <react_native_1.View style={styles.row}>
          <react_native_1.View style={styles.metric}>
            <react_native_1.Text style={styles.metricLabel}>Today</react_native_1.Text>
            <react_native_1.Text style={styles.metricValue}>${data.salesToday.toFixed(2)}</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.metric}>
            <react_native_1.Text style={styles.metricLabel}>7 Days</react_native_1.Text>
            <react_native_1.Text style={styles.metricValue}>${data.sales7d.toFixed(2)}</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.card}>
        <react_native_1.Text style={styles.cardTitle}>Payment Breakdown</react_native_1.Text>
        <react_native_1.View style={styles.row}>
          <react_native_1.View style={styles.metric}>
            <react_native_1.Text style={styles.metricLabel}>MOMO</react_native_1.Text>
            <react_native_1.Text style={styles.metricValue}>${momoTotal.toFixed(2)}</react_native_1.Text>
            <react_native_1.Text style={styles.metricSubtext}>{momoPercent}%</react_native_1.Text>
          </react_native_1.View>
          <react_native_1.View style={styles.metric}>
            <react_native_1.Text style={styles.metricLabel}>CASH</react_native_1.Text>
            <react_native_1.Text style={styles.metricValue}>${cashTotal.toFixed(2)}</react_native_1.Text>
            <react_native_1.Text style={styles.metricSubtext}>{cashPercent}%</react_native_1.Text>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.View>

      <react_native_1.View style={styles.card}>
        <react_native_1.Text style={styles.cardTitle}>Top Items</react_native_1.Text>
        {data.topItems.slice(0, 5).map((item, idx) => (<react_native_1.View key={item.menuItemId} style={styles.listItem}>
            <react_native_1.Text style={styles.itemName}>
              {idx + 1}. {item.name}
            </react_native_1.Text>
            <react_native_1.Text style={styles.itemValue}>
              {item.quantity} sold · ${item.revenue.toFixed(2)}
            </react_native_1.Text>
          </react_native_1.View>))}
      </react_native_1.View>

      <react_native_1.View style={styles.card}>
        <react_native_1.Text style={styles.cardTitle}>Alerts</react_native_1.Text>
        <react_native_1.Text style={styles.alertText}>{data.anomaliesToday} anomalies today</react_native_1.Text>
      </react_native_1.View>

      <react_native_1.View style={styles.spacer}/>
    </react_native_1.ScrollView>);
}
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EAEDF3',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAEDF3',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00033D',
    },
    logoutText: {
        color: '#0033FF',
        fontSize: 14,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        margin: 16,
        marginTop: 0,
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#00033D',
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    metric: {
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    metricValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00033D',
    },
    metricSubtext: {
        fontSize: 12,
        color: '#0033FF',
        marginTop: 2,
    },
    listItem: {
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#EEE',
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#00033D',
        marginBottom: 4,
    },
    itemValue: {
        fontSize: 12,
        color: '#666',
    },
    alertText: {
        fontSize: 16,
        color: '#00033D',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#E53935',
        textAlign: 'center',
        marginBottom: 16,
    },
    button: {
        backgroundColor: '#0033FF',
        borderRadius: 8,
        padding: 12,
        paddingHorizontal: 24,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
    },
    spacer: {
        height: 20,
    },
});
//# sourceMappingURL=index.js.map