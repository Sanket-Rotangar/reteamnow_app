import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  interpolate,
  type SharedValue,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type ProgressRingsProps = {
  move: number;
  exercise: number;
  stand: number;
  size?: number; // Optional size prop
};

// Local hook to generate animatedProps for a ring in a rules-of-hooks safe way
const useRingAnimatedProps = (
  progressValue: SharedValue<number>,
  circumference: number
) =>
  useAnimatedProps(() => ({
    strokeDashoffset:
      circumference -
      circumference * interpolate(progressValue.value, [0, 1], [0, 1]),
  }));

const ProgressRings: React.FC<ProgressRingsProps> = ({ move, exercise, stand, size = 180 }) => {
  // Config
  const ringSize = size; // Use prop or default to 180
  const strokeWidth = Math.max(10, size * 0.08); // Proportional stroke width
  const center = ringSize / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  // Max values for each ring
  const maxMove = 10000;       // steps count
  const maxExercise = 2500;    // calories burnt
  const maxStand = 170;        // heart rate

  // Shared values
  const moveProgress = useSharedValue(0);
  const exerciseProgress = useSharedValue(0);
  const standProgress = useSharedValue(0);

  // Animate on mount
  useEffect(() => {
    moveProgress.value = withTiming(move / maxMove, { duration: 1500 });
    exerciseProgress.value = withTiming(exercise / maxExercise, { duration: 1500 });
    standProgress.value = withTiming(stand / maxStand, { duration: 1500 });
  }, [
    move,
    exercise,
    stand,
    maxMove,
    maxExercise,
    maxStand,
    moveProgress,
    exerciseProgress,
    standProgress,
  ]);

  // Animated props for each ring (use custom hook to satisfy Rules of Hooks)
  const moveAnimatedProps = useRingAnimatedProps(moveProgress, circumference);
  const exerciseAnimatedProps = useRingAnimatedProps(exerciseProgress, circumference);
  const standAnimatedProps = useRingAnimatedProps(standProgress, circumference);

  return (
    <View style={styles.container}>
      <Svg width={ringSize} height={ringSize}>
        <Defs>
          {/* Gradients for each ring */}
          <LinearGradient id="moveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#ff2d55" />
            <Stop offset="100%" stopColor="#ff2d55" />
          </LinearGradient>
          <LinearGradient id="exerciseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#5cff00" />
            <Stop offset="100%" stopColor="#5cff00" />
          </LinearGradient>
          <LinearGradient id="standGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#00c7ff" />
            <Stop offset="100%" stopColor="#00c7ff" />
          </LinearGradient>
        </Defs>
{/* '#ff2d55', '#5cff00', '#00c7ff' */}
        {/* Background circles */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(158, 142, 142, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius - strokeWidth - 4}
          stroke="rgba(158, 142, 142, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius - (strokeWidth + 4) * 2}
          stroke="rgba(158, 142, 142, 0.15)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress rings */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke="url(#moveGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={moveAnimatedProps}
          fill="none"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius - strokeWidth - 4}
          stroke="url(#exerciseGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={exerciseAnimatedProps}
          fill="none"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius - (strokeWidth + 4) * 2}
          stroke="url(#standGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={standAnimatedProps}
          fill="none"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressRings;
