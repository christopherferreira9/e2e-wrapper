import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Switch,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [counter, setCounter] = useState(0);
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: 'Learn React Native', completed: false },
    { id: 2, text: 'Setup E2E Testing', completed: true },
    { id: 3, text: 'Write Tests', completed: false },
  ]);

  const handleIncrement = () => {
    setCounter(counter + 1);
  };

  const handleDecrement = () => {
    setCounter(counter - 1);
  };

  const handleSubmit = () => {
    setDisplayText(inputText);
    setInputText('');
  };

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Loading completed!');
    }, 3500);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = () => {
    if (inputText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setInputText('');
    }
  };

  const renderTodoItem = ({ item }: { item: TodoItem }) => (
    <View style={styles.todoItem} testID={`todo-item-${item.id}`}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        testID={`todo-text-${item.id}`}
      >
        {item.text}
      </Text>
      <TouchableOpacity
        style={[styles.toggleButton, item.completed && styles.completedButton]}
        testID={`toggle-button-${item.id}`}
        onPress={() => toggleTodo(item.id)}
      >
        <Text style={styles.toggleButtonText}>
          {item.completed ? '✓' : '○'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#007AFF" />
      
      <ScrollView style={styles.scrollView} testID="main-scroll-view">
        <View style={styles.header}>
          <Text style={styles.title} testID="app-title">
            E2E Testing App
          </Text>
          <Text style={styles.subtitle} testID="app-subtitle">
            Test your e2e-wrapper framework
          </Text>
        </View>

        {/* Counter Section */}
        <View style={styles.section} testID="counter-demo-section">
          <Text style={styles.sectionTitle} testID="counter-title">
            Counter Demo
          </Text>
          <View style={styles.counterContainer}>
            <TouchableOpacity
              style={[styles.button, styles.decrementButton]}
              testID="decrement-button"
              onPress={handleDecrement}
            >
              <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.counterText} testID="counter-display">
              {counter}
            </Text>
            
            <TouchableOpacity
              style={[styles.button, styles.incrementButton]}
              testID="increment-button"
              onPress={handleIncrement}
            >
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} testID="input-title">
            Text Input Demo
          </Text>
          <TextInput
            style={styles.textInput}
            testID="text-input"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Enter some text..."
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            testID="submit-button"
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          {displayText ? (
            <Text style={styles.displayText} testID="display-text">
              You entered: {displayText}
            </Text>
          ) : null}
        </View>

        {/* Loading Demo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} testID="loading-title">
            Loading Demo
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.loadingButton]}
            testID="loading-button"
            onPress={handleLoadingDemo}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Loading...' : 'Start Loading'}
            </Text>
          </TouchableOpacity>
          {isLoading && (
            <Text style={styles.loadingText} testID="loading-indicator">
              Please wait...
            </Text>
          )}
        </View>

        {/* Switch Demo Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle} testID="switch-title">
            Switch Demo
          </Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel} testID="switch-label">
              Enable Feature: {isEnabled ? 'ON' : 'OFF'}
            </Text>
            <Switch
              testID="feature-switch"
              value={isEnabled}
              onValueChange={setIsEnabled}
            />
          </View>
        </View>

        {/* Modal Demo Section */}
        <View style={styles.section} testID="modal-demo-section">
          <Text style={styles.sectionTitle} testID="modal-section-title">
            Modal Demo
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.modalButton]}
            testID="open-modal-button"
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.buttonText}>Open Modal</Text>
          </TouchableOpacity>
        </View>

        {/* Todo List Section */}
        <View style={styles.section} testID="todo-list-section">
          <Text style={styles.sectionTitle} testID="todo-title">
            Todo List Demo
          </Text>
          <View style={styles.todoInputContainer}>
            <TextInput
              style={[styles.textInput, styles.todoInput]}
              testID="todo-input"
              value={inputText}
              onChangeText={setInputText}
              placeholder="Add a new todo..."
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              testID="add-todo-button"
              onPress={addTodo}
            >
              <Text style={styles.buttonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={todos}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id.toString()}
            testID="todo-list"
            style={styles.todoList}
            scrollEnabled={false}
            nestedScrollEnabled={true}
          />
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        testID="test-modal"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle} testID="modal-title">
              Test Modal
            </Text>
            <Text style={styles.modalText} testID="modal-text">
              This is a test modal for e2e testing.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.closeButton]}
              testID="close-modal-button"
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  section: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
    marginHorizontal: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  decrementButton: {
    backgroundColor: '#FF3B30',
    width: 50,
    height: 50,
  },
  incrementButton: {
    backgroundColor: '#34C759',
    width: 50,
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    marginTop: 10,
  },
  loadingButton: {
    backgroundColor: '#FF9500',
  },
  modalButton: {
    backgroundColor: '#5856D6',
  },
  addButton: {
    backgroundColor: '#34C759',
    marginLeft: 10,
  },
  closeButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  displayText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF9500',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  todoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  todoInput: {
    flex: 1,
  },
  todoList: {
    maxHeight: 200,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  todoText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  toggleButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedButton: {
    backgroundColor: '#34C759',
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default App;
