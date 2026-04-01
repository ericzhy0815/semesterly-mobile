import { useThemeColors } from "@/hooks/useThemeColors";
import { Modal, Pressable, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

type DatePickerModalProps = {
  visible: boolean;
  selectedDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
};

export function DatePickerModal({
  visible,
  selectedDate,
  onSelect,
  onClose,
}: DatePickerModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface }]}
          onPress={() => {}}
        >
          <Calendar
            current={selectedDate}
            onDayPress={(day) => {
              onSelect(day.dateString);
              onClose();
            }}
            markedDates={{ [selectedDate]: { selected: true } }}
            theme={{
              calendarBackground: colors.surface,
              textSectionTitleColor: colors.textMuted,
              selectedDayBackgroundColor: colors.buttonBg,
              selectedDayTextColor: colors.text,
              todayTextColor: colors.text,
              todayBackgroundColor: colors.todayContainerBg,
              dayTextColor: colors.text,
              textDisabledColor: colors.textMuted,
              dotColor: colors.buttonBg,
              monthTextColor: colors.text,
              arrowColor: colors.icon,
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 340,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
});
