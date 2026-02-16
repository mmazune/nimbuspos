"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StockCount;
const react_1 = require("react");
const react_native_1 = require("react-native");
const picker_1 = require("@react-native-picker/picker");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const expo_router_1 = require("expo-router");
const API_BASE_URL = 'http://localhost:4000';
function StockCount() {
    const [items, setItems] = (0, react_1.useState)([]);
    const [selectedItemId, setSelectedItemId] = (0, react_1.useState)('');
    const [quantity, setQuantity] = (0, react_1.useState)('');
    const [reason, setReason] = (0, react_1.useState)('');
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const router = (0, expo_router_1.useRouter)();
    const fetchItems = async () => {
        try {
            const token = await async_storage_1.default.getItem('authToken');
            if (!token) {
                router.replace('/login');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/inventory/items`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 401) {
                await async_storage_1.default.clear();
                router.replace('/login');
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch items');
            }
            const data = await response.json();
            setItems(data);
        }
        catch (error) {
            console.error('Fetch error:', error);
            react_native_1.Alert.alert('Error', 'Failed to load inventory items');
        }
        finally {
            setLoading(false);
        }
    };
    (0, react_1.useEffect)(() => {
        fetchItems();
    }, []);
    const handleSubmit = async () => {
        if (!selectedItemId) {
            react_native_1.Alert.alert('Error', 'Please select an item');
            return;
        }
        const qty = parseFloat(quantity);
        if (isNaN(qty) || qty === 0) {
            react_native_1.Alert.alert('Error', 'Please enter a valid quantity (positive to add, negative to remove)');
            return;
        }
        if (!reason.trim()) {
            react_native_1.Alert.alert('Error', 'Please enter a reason for this adjustment');
            return;
        }
        setSubmitting(true);
        try {
            const token = await async_storage_1.default.getItem('authToken');
            if (!token) {
                router.replace('/login');
                return;
            }
            const response = await fetch(`${API_BASE_URL}/inventory/adjustments`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    itemId: selectedItemId,
                    deltaQty: qty,
                    reason: reason.trim(),
                }),
            });
            if (response.status === 401) {
                await async_storage_1.default.clear();
                router.replace('/login');
                return;
            }
            if (!response.ok) {
                const error = await response.json();
                react_native_1.Alert.alert('Error', error.message || 'Failed to record adjustment');
                setSubmitting(false);
                return;
            }
            react_native_1.Alert.alert('Success', `Adjustment recorded: ${qty > 0 ? '+' : ''}${qty} units`, [
                {
                    text: 'OK',
                    onPress: () => {
                        setSelectedItemId('');
                        setQuantity('');
                        setReason('');
                    },
                },
            ]);
        }
        catch (error) {
            console.error('Submit error:', error);
            react_native_1.Alert.alert('Error', 'Failed to record adjustment');
        }
        finally {
            setSubmitting(false);
        }
    };
    if (loading) {
        return (<react_native_1.View style={styles.center}>
        <react_native_1.ActivityIndicator size="large" color="#0033FF"/>
        <react_native_1.Text style={styles.loadingText}>Loading items...</react_native_1.Text>
      </react_native_1.View>);
    }
    return (<react_native_1.ScrollView style={styles.container}>
      <react_native_1.View style={styles.content}>
        <react_native_1.Text style={styles.title}>Stock Count Adjustment</react_native_1.Text>
        <react_native_1.Text style={styles.subtitle}>
          Enter positive quantity to add stock, negative to remove
        </react_native_1.Text>

        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={styles.label}>Select Item</react_native_1.Text>
          <react_native_1.View style={styles.pickerContainer}>
            <picker_1.Picker selectedValue={selectedItemId} onValueChange={setSelectedItemId} enabled={!submitting}>
              <picker_1.Picker.Item label="-- Select an item --" value=""/>
              {items.map((item) => (<picker_1.Picker.Item key={item.id} label={`${item.name} (${item.sku})`} value={item.id}/>))}
            </picker_1.Picker>
          </react_native_1.View>
        </react_native_1.View>

        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={styles.label}>Quantity Adjustment</react_native_1.Text>
          <react_native_1.TextInput style={styles.input} placeholder="e.g., +10 or -5" keyboardType="numeric" value={quantity} onChangeText={setQuantity} editable={!submitting}/>
          <react_native_1.Text style={styles.hint}>Positive adds stock, negative removes</react_native_1.Text>
        </react_native_1.View>

        <react_native_1.View style={styles.section}>
          <react_native_1.Text style={styles.label}>Reason</react_native_1.Text>
          <react_native_1.TextInput style={[styles.input, styles.textArea]} placeholder="e.g., Physical count, received delivery, damaged goods" value={reason} onChangeText={setReason} multiline numberOfLines={3} editable={!submitting}/>
        </react_native_1.View>

        <react_native_1.TouchableOpacity style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
          <react_native_1.Text style={styles.buttonText}>
            {submitting ? 'Submitting...' : 'Record Adjustment'}
          </react_native_1.Text>
        </react_native_1.TouchableOpacity>
      </react_native_1.View>
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
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00033D',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#00033D',
        marginBottom: 8,
    },
    pickerContainer: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        overflow: 'hidden',
    },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    hint: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    button: {
        backgroundColor: '#0033FF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: '#AAA',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});
//# sourceMappingURL=stock.js.map