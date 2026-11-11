import { Blobatar } from "@blobatar/react-native";
import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export default function Avatar ({ name, size=24 }) {

    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [floatAnim]);

    const translateY = floatAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -9],
    });

    const rotate = floatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ["-3deg", "2deg", "-3deg"],
    });

    const scale = floatAnim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [1, 1.04, 1],
    });

    return (
        <Animated.View style={{transform: [{ translateY }, { rotate }, { scale }],}}>
            <Blobatar name={name} size={size} />
        </Animated.View>
    )
}