import {Entypo} from "@expo/vector-icons";
import {useState} from "react";
import {View, Text, TextInput, TouchableOpacity} from "react-native";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  custom,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles || ""}`}>
      <Text className="text-base font-bold">{title}</Text>

      <View
        className={`w-full px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex flex-row items-center ${
          custom ? "h-32" : "h-16"
        }`}
      >
        <TextInput
          className="flex-1 font-semibold text-base"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#000"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          style={{verticalAlign: "top"}}
          {...props}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Entypo name="eye" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
