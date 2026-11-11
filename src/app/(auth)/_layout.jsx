import { Stack } from "expo-router";

export default function AuthLayout () {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="login" /><Stack.Screen name="recover" /><Stack.Screen name="guardian-register" /><Stack.Screen name="update-password" /><Stack.Screen name="guardian-claim" />
        </Stack>
    )
}