/**
 * Color Configuration File
 * 
 * Centralized color system for the ReteamNow Employee Engagement App.
 * This file provides a consistent color palette that can be easily modified
 * across the entire application.
 * 
 * Color palette follows modern design principles with the specified brand colors:
 * - Primary: #6366F1 (Indigo)
 * - Secondary: #EC4899 (Pink) 
 * - Success: #10B981 (Green)
 */

export const colors = {
  // Brand Colors (as per requirements)
  primary: '#6366F1',       // Indigo - main brand color for buttons, headers, active states
  secondary: '#EC4899',     // Pink - accent color for highlights and secondary actions
  success: '#10B981',       // Green - success states, confirmations, positive feedback
  
  // System Colors
  warning: '#F59E0B',       // Amber - warning states and cautionary elements
  danger: '#EF4444',        // Red - error states and destructive actions
  error: '#EF4444',         // Alias for danger (commonly used)
  info: '#3B82F6',          // Blue - informational content and links
  
  // Background Colors
  background: '#F9FAFB',    // Light gray - main screen background
  surface: '#FFFFFF',       // White - card backgrounds and surfaces
  accent: '#E0E7FF',        // Light indigo - subtle accents and highlights
  
  // Text Colors
  text: '#1F2937',          // Dark gray - primary text content
  textSecondary: '#6B7280', // Medium gray - secondary text and descriptions
  textLight: '#9CA3AF',     // Light gray - disabled text and placeholders
  
  // Border and Divider Colors
  border: '#E5E7EB',        // Light gray - borders and dividers
  borderDark: '#D1D5DB',    // Medium gray - more prominent borders
  
  // Interactive Colors
  active: '#6366F1',        // Primary color for active states
  inactive: '#9CA3AF',      // Gray for inactive elements
  disabled: '#F3F4F6',      // Very light gray for disabled elements
  
  // Status Colors (semantic)
  online: '#10B981',        // Green - online status
  offline: '#6B7280',       // Gray - offline status
  pending: '#F59E0B',       // Amber - pending status
  
  // Transparency Variations (for overlays and subtle effects)
  overlay: 'rgba(0, 0, 0, 0.5)',           // Semi-transparent black overlay
  primaryLight: 'rgba(99, 102, 241, 0.1)', // Light primary for backgrounds
  successLight: 'rgba(16, 185, 129, 0.1)', // Light success for backgrounds
  warningLight: 'rgba(245, 158, 11, 0.1)', // Light warning for backgrounds
  dangerLight: 'rgba(239, 68, 68, 0.1)',   // Light danger for backgrounds
};

export default colors;
