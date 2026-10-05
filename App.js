import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  // स्टेट (डेटा सेव रखने के लिए)
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [receivables, setReceivables] = useState([]);
  const [payables, setPayables] = useState([]);

  // मोडल (पॉपअप) स्टेट्स
  const [modalType, setModalType] = useState(null); // 'EXPENSE', 'INCOME', 'RECEIVE', 'PAY'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  // लाइव कैलकुलेशन
  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalReceivable = receivables.reduce((sum, item) => sum + item.amount, 0);
  const totalPayable = payables.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalIncome - totalExpense;

  // नया डेटा जोड़ने का फंक्शन
  const handleSave = () => {
    const numAmount = parseFloat(amount);
    if (!title || isNaN(numAmount) || numAmount <= 0) {
      alert('कृपया सही नाम और राशि भरें');
      return;
    }

    const newItem = { id: Date.now().toString(), title, amount: numAmount };

    if (modalType === 'EXPENSE') setExpenses([newItem, ...expenses]);
    if (modalType === 'INCOME') setIncomes([newItem, ...incomes]);
    if (modalType === 'RECEIVE') setReceivables([newItem, ...receivables]);
    if (modalType === 'PAY') setPayables([newItem, ...payables]);

    setTitle('');
    setAmount('');
    setModalType(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* हेडर */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>DailyCalculation</Text>
          <Text style={styles.headerSubtitle}>आपका पूरा हिसाब, एक जगह।</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea}>
        {/* मुख्य बैलेंस कार्ड */}
        <View style={styles.balanceCard}>
          <Text style={styles.cardLabel}>आज का शुद्ध शेष (Net Balance)</Text>
          <Text style={[styles.mainAmount, { color: netBalance >= 0 ? '#4ADE80' : '#F87171' }]}>
            ₹{netBalance.toLocaleString('en-IN')}
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.subText}>कुल आय: ₹{totalIncome.toLocaleString('en-IN')}</Text>
            <Text style={styles.subText}>कुल खर्च: ₹{totalExpense.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* उधारी सारांश कार्ड */}
        <View style={styles.row}>
          <View style={[styles.ledgerCard, { backgroundColor: '#064E3B' }]}>
            <Text style={styles.ledgerLabelGreen}>मुझे लेना है</Text>
            <Text style={styles.ledgerAmount}>₹{totalReceivable.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.ledgerCard, { backgroundColor: '#7F1D1D' }]}>
            <Text style={styles.ledgerLabelRed}>मुझे देना है</Text>
            <Text style={styles.ledgerAmount}>₹{totalPayable.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* क्विक एक्शन बटन्स */}
        <Text style={styles.sectionHeading}>त्वरित जोड़ें</Text>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalType('EXPENSE')}>
            <Ionicons name="trending-down" size={24} color="#EF4444" />
            <Text style={styles.btnText}>+ खर्च</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalType('INCOME')}>
            <Ionicons name="trending-up" size={24} color="#10B981" />
            <Text style={styles.btnText}>+ आय</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalType('RECEIVE')}>
            <Ionicons name="arrow-down-circle" size={24} color="#38BDF8" />
            <Text style={styles.btnText}>+ लेना है</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => setModalType('PAY')}>
            <Ionicons name="arrow-up-circle" size={24} color="#F59E0B" />
            <Text style={styles.btnText}>+ देना है</Text>
          </TouchableOpacity>
        </View>

        {/* हाल के खर्च की लिस्ट */}
        <Text style={[styles.sectionHeading, { marginTop: 24 }]}>हाल के खर्चे</Text>
        {expenses.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>अभी कोई खर्च दर्ज नहीं है</Text>
          </View>
        ) : (
          expenses.map(item => (
            <View key={item.id} style={styles.listItem}>
              <Text style={styles.listTitle}>{item.title}</Text>
              <Text style={styles.expenseAmount}>-₹{item.amount.toLocaleString('en-IN')}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* एंट्री जोड़ने के लिए पॉपअप (Modal) */}
      <Modal visible={modalType !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {modalType === 'EXPENSE' && 'नया खर्च जोड़ें'}
              {modalType === 'INCOME' && 'नई आय जोड़ें'}
              {modalType === 'RECEIVE' && 'उधार लेना दर्ज करें'}
              {modalType === 'PAY' && 'उधार देना दर्ज करें'}
            </Text>

            <TextInput
              placeholder="विवरण / नाम (उदा. चाय, राशन, रमेश)"
              placeholderTextColor="#94A3B8"
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              placeholder="राशि (₹)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
            />

            <View style={styles.row}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#334155' }]} 
                onPress={() => setModalType(null)}
              >
                <Text style={styles.modalBtnText}>रद्द करें</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#2563EB' }]} 
                onPress={handleSave}
              >
                <Text style={styles.modalBtnText}>सुरक्षित करें</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { padding: 18, borderBottomWidth: 1, borderColor: '#1E293B' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#F8FAFC' },
  headerSubtitle: { fontSize: 13, color: '#94A3B8', marginTop: 2 },
  scrollArea: { padding: 16 },
  balanceCard: { backgroundColor: '#1E293B', padding: 18, borderRadius: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  cardLabel: { color: '#94A3B8', fontSize: 13 },
  mainAmount: { fontSize: 32, fontWeight: 'bold', marginVertical: 6 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  subText: { color: '#CBD5E1', fontSize: 13 },
  row: { flexDirection: 'row', gap: 10, marginTop: 4 },
  ledgerCard: { flex: 1, padding: 14, borderRadius: 14, marginBottom: 20 },
  ledgerLabelGreen: { color: '#A7F3D0', fontSize: 12, fontWeight: '600' },
  ledgerLabelRed: { color: '#FECDD3', fontSize: 12, fontWeight: '600' },
  ledgerAmount: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF', marginTop: 4 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: '#F8FAFC', marginBottom: 10 },
  actionBtn: { width: '23%', backgroundColor: '#1E293B', alignItems: 'center', paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  btnText: { color: '#F8FAFC', fontSize: 11, fontWeight: '600', marginTop: 6 },
  emptyCard: { backgroundColor: '#1E293B', padding: 20, borderRadius: 12, alignItems: 'center', marginTop: 6 },
  emptyText: { color: '#64748B', fontSize: 14 },
  listItem: { backgroundColor: '#1E293B', padding: 14, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  listTitle: { color: '#F8FAFC', fontSize: 15 },
  expenseAmount: { color: '#F87171', fontSize: 15, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1E293B', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#F8FAFC', marginBottom: 14 },
  input: { backgroundColor: '#0F172A', color: '#F8FAFC', padding: 12, borderRadius: 8, marginBottom: 12, fontSize: 14, borderWidth: 1, borderColor: '#334155' },
  modalBtn: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' },
  modalBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
});
