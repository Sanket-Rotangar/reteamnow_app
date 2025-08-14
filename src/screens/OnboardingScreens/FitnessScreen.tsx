import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../config/colors';
import { fontSizes, fontWeights } from '../../config/typography';

const FitnessScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          {/* Split view: Fitness progress rings on left, trophy podium on right */}
          <View style={styles.leftSection}>
            <Text style={styles.sectionLabel}>Progress</Text>
            <View style={styles.progressRings}>
              <View style={[styles.ring, styles.ring1]}>
                <View style={[styles.ringInner, styles.ring1Inner]} />
              </View>
              <View style={[styles.ring, styles.ring2]}>
                <View style={[styles.ringInner, styles.ring2Inner]} />
              </View>
              <View style={[styles.ring, styles.ring3]}>
                <View style={[styles.ringInner, styles.ring3Inner]} />
              </View>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.rightSection}>
            <Text style={styles.sectionLabel}>Leaderboard</Text>
            <View style={styles.podium}>
              <View style={[styles.podiumStep, styles.step2]}>
                <Text style={styles.podiumNumber}>2</Text>
              </View>
              <View style={[styles.podiumStep, styles.step1]}>
                <Text style={styles.podiumNumber}>1</Text>
                <Text style={styles.trophy}>🏆</Text>
              </View>
              <View style={[styles.podiumStep, styles.step3]}>
                <Text style={styles.podiumNumber}>3</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Track & Rank Up</Text>
        <Text style={styles.subtitle}>Reach your goals while climbing the leaderboard.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  illustrationContainer: {
    flex: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  illustration: {
    width: 300,
    height: 200,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  leftSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '80%',
    backgroundColor: colors.border,
    marginHorizontal: 15,
  },
  sectionLabel: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  progressRings: {
    position: 'relative',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 50,
    borderWidth: 6,
  },
  ring1: {
    width: 80,
    height: 80,
    borderColor: colors.primaryLight,
  },
  ring2: {
    width: 60,
    height: 60,
    borderColor: colors.successLight,
  },
  ring3: {
    width: 40,
    height: 40,
    borderColor: colors.warningLight,
  },
  ringInner: {
    position: 'absolute',
    top: -6,
    left: -6,
    borderRadius: 50,
    borderWidth: 6,
    borderColor: 'transparent',
  },
  ring1Inner: {
    width: 80,
    height: 80,
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
    transform: [{ rotate: '0deg' }],
  },
  ring2Inner: {
    width: 60,
    height: 60,
    borderTopColor: colors.success,
    borderRightColor: colors.success,
    borderBottomColor: colors.success,
    transform: [{ rotate: '45deg' }],
  },
  ring3Inner: {
    width: 40,
    height: 40,
    borderTopColor: colors.warning,
    borderRightColor: colors.warning,
    borderBottomColor: colors.warning,
    borderLeftColor: colors.warning,
    transform: [{ rotate: '90deg' }],
  },
  podium: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  podiumStep: {
    width: 25,
    borderRadius: 4,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
  },
  step1: {
    height: 60,
    backgroundColor: colors.primary,
  },
  step2: {
    height: 45,
    backgroundColor: colors.secondary,
  },
  step3: {
    height: 35,
    backgroundColor: colors.warning,
  },
  podiumNumber: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    color: colors.surface,
  },
  trophy: {
    fontSize: 16,
    marginTop: 2,
  },
  contentContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: fontSizes.h2,
    fontWeight: fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});

export default FitnessScreen;
