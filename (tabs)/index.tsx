import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useRef, useState } from "react";
import {
  Animated,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import 'react-native-reanimated';
import BubblePop from "./BubblePop";


interface Task {
  id: string;
  name: string;
  dueDate?: string;
}

export default function TodoScreen() {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [poppingBubbles, setPoppingBubbles] = useState<
  { x: number; y: number; id: string }[]
  >([]);


  

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(false); // hide after selection
    if (date) {
      setSelectedDate(date);
      setDueDate(date.toDateString()); // optional: store formatted string
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleAddTask = () => {
    if (taskName.trim() === "") return; // don’t allow empty task names

    const newTask: Task = {
      id: Date.now().toString(), // unique ID
      name: taskName,
      dueDate: dueDate.trim() !== "" ? dueDate : undefined,
    };

    setTasks((prev) => [newTask, ...prev]); // add to list
    setTaskName("");
    setDueDate("");
    setModalVisible(false);
  };

  const handleDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

const renderTask = ({ item, drag, isActive }: RenderItemParams<Task>) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const handleSwipeRight = () => {
    Animated.timing(translateX, {
      toValue: 500, // move bubble off-screen to the right
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Remove task from state
      setTasks((prev) => prev.filter((t) => t.id !== item.id));
    });
  };

  return (
    <Swipeable
      renderLeftActions={() => (
        <View
          style={{
            flex: 1,
            height: 60,
            backgroundColor: "rgba(244, 83, 83, 1)",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingLeft: 20,
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#ffffffff" />
        </View>
      )}
      leftThreshold={40}
      onSwipeableOpen={handleSwipeRight}
    >
      <Animated.View
        style={[
          styles.taskBubble,
          isActive && { backgroundColor: "#eee" },
          { transform: [{ translateX }] },
        ]}
      >
        <View style={styles.taskContent}>
          <View>
            <Text style={styles.taskText}>{item.name}</Text>
            {item.dueDate && <Text style={styles.dueDateText}>Due: {item.dueDate}</Text>}
          </View>
          <TouchableOpacity onLongPress={drag}>
            <Ionicons name="reorder-three-outline" size={28} color="gray" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Swipeable>
  );
};







  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bubble Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      </View>

      {/* Task List */}
      <DraggableFlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        onDragEnd={({ data }) => setTasks(data)} // update state
      />

        {/* Bubble Pop Overlay */}
      {poppingBubbles.map((bubble) => (
        <BubblePop
          key={bubble.id}
          x={bubble.x}
          y={bubble.y}
          onComplete={() =>
            setPoppingBubbles((prev) => prev.filter((p) => p.id !== bubble.id))
          }
        />
      ))}

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>

            <TextInput
              placeholder="Task name"
              value={taskName}
              onChangeText={setTaskName}
              style={styles.input}
            />
<TouchableOpacity
  style={styles.dateButton}
  onPress={() => setShowDatePicker(true)}
>
  <Text style={styles.dateButtonText}>
    {selectedDate ? selectedDate.toDateString() : "Pick a due date"}
  </Text>
</TouchableOpacity>

{showDatePicker && (
  <DateTimePicker
    value={selectedDate || new Date()}
    mode="date"
    display="default"
    onChange={handleDateChange}
  />)

  }


            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#aaa" }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                <Text style={styles.buttonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButton: {
    padding: 5,
    position: "absolute",
    right: 0,
  },
  taskBubble: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  taskText: {
    fontSize: 18,
    fontWeight: "500",
  },
  dueDateText: {
    fontSize: 14,
    color: "gray",
    marginTop: 4,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  dateButton: {
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  padding: 12,
  marginBottom: 12,
  justifyContent: "center",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  taskContent: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  },
  deleteBox: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
    borderRadius: 20,
  },
});
