"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Alerts;
const react_1 = require("react");
const react_native_1 = require("react-native");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const expo_router_1 = require("expo-router");
const API_BASE_URL = 'http://localhost:4000';
function Alerts() {
    const [alerts, setAlerts] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const router = (0, expo_router_1.useRouter)();
    const fetchAlerts = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await async_storage_1.default.getItem('authToken');
            if (!token) {
                router.replace('/login');
                return;
            }
            // Fetch latest 50 anomaly events
            const response = await fetch(`${API_BASE_URL}/analytics/anomalies?limit=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 401) {
                await async_storage_1.default.clear();
                router.replace('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch alerts');
            }
            const data = await response.json();
            setAlerts(data);
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
        fetchAlerts();
    }, []);
    const getSeverityColor = (severity) => {
        switch (severity.toUpperCase()) {
            case 'HIGH':
                return '#E53935';
            case 'MEDIUM':
                return '#FB8C00';
            case 'LOW':
                return '#FDD835';
            default:
                return '#666';
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        }
        if (hours < 24) {
            return `${hours}h ago`;
        }
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };
    if (loading) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.ActivityIndicator size="large" color="#0033FF"/>
        <react_native_1.Text style={styles.loadingText}>Loading alerts...</react_native_1.Text>
      </react_native_1.View>);
    }
    if (error) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.Text style={styles.errorText}>Error: {error}</react_native_1.Text>
        <react_native_1.TouchableOpacity style={styles.button} onPress={fetchAlerts}>
          <react_native_1.Text style={styles.buttonText}>Retry</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>);
    }
    return (<react_native_1.ScrollView style={styles.container}>
      <react_native_1.View style={styles.header}>
        <react_native_1.Text style={styles.title}>Anomaly Alerts</react_native_1.Text>
        <react_native_1.TouchableOpacity onPress={fetchAlerts}>
          <react_native_1.Text style={styles.refreshText}>Refresh</react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>

      {alerts.length === 0 ? (<react_native_1.View style={styles.emptyState}>
          <react_native_1.Text style={styles.emptyText}>No alerts found</react_native_1.Text>
          <react_native_1.Text style={styles.emptySubtext}>All clear! 🎉</react_native_1.Text>
        </react_native_1.View>) : (<react_native_1.View style={styles.list}>
          {alerts.map((alert) => (<react_native_1.View key={alert.id} style={styles.alertCard}>
              <react_native_1.View style={styles.alertHeader}>
                <react_native_1.View style={styles.alertType}>
                  <react_native_1.View style={[
                    styles.severityDot,
                    { backgroundColor: getSeverityColor(alert.severity) },
                ]}/>
                  <react_native_1.Text style={styles.typeText}>{alert.type.replace(/_/g, ' ')}</react_native_1.Text>
                </react_native_1.View>
                <react_native_1.Text style={styles.timeText}>{formatDate(alert.createdAt)}</react_native_1.Text>
              </react_native_1.View>
              <react_native_1.Text style={styles.descriptionText}>{alert.description}</react_native_1.Text>
              <react_native_1.Text style={styles.severityText}>Severity: {alert.severity}</react_native_1.Text>
            </react_native_1.View>))}
        </react_native_1.View>)}

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
    refreshText: {
        color: '#0033FF',
        fontSize: 14,
        fontWeight: '600',
    },
    list: {
        padding: 16,
        paddingTop: 0,
    },
    alertCard: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    alertType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    typeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00033D',
        textTransform: 'capitalize',
    },
    timeText: {
        fontSize: 12,
        color: '#999',
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        lineHeight: 20,
    },
    severityText: {
        fontSize: 12,
        color: '#999',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#00033D',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
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
//# sourceMappingURL=alerts.js.map