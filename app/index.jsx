import { Text, View } from "react-native";
import { Link } from "expo-router"
import "../global.css";
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Aora</Text>
      <Link href="/home" style={{color:'blue'}}>Home</Link>
    </View>
  );
}
