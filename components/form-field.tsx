import {Entypo} from "@expo/vector-icons";
import {useState} from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface FormFieldProps {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  custom?: any;
  type?: "password";
}

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  custom,
  type,
  ...props
}: FormFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className={`space-y-2 ${otherStyles || ""}`}>
          <Text className="text-base font-bold">{title}</Text>
          <View
            className={`w-full px-4 rounded-2xl border-2 border-black-200 flex flex-row items-center ${
              custom ? "h-32" : "h-16"
            }`}
          >
            <TextInput
              className="flex-1 font-semibold text-base"
              value={value}
              placeholder={placeholder}
              placeholderTextColor="#000"
              onChangeText={handleChangeText}
              secureTextEntry={type === "password" && !showPassword}
              style={{verticalAlign: "top"}}
              multiline={custom && true}
              numberOfLines={custom && 10}
              textAlignVertical="top"
              {...props}
            />
            {type === "password" && (
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Entypo name="eye" size={24} color="black" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default FormField;
