import { useAuth } from '@/context/AuthContext';

interface DashboardFeatures {
  [key: string]: {
    title: string;
    description: string;
    features: string[];
  };
}

const dashboardFeatures: DashboardFeatures = {
  first_responder: {
    title: 'First Responder Dashboard',
    description: 'Monitor and respond to emergency situations',
    features: [
      'View prioritized emergency tasks',
      'Real-time incident reports',
      'Resource deployment tools',
      'Team coordination',
    ],
  },
  volunteer: {
    title: 'Volunteer Dashboard',
    description: 'Track assignments and report field updates',
    features: [
      'Current assignments',
      'Field update submission',
      'Training resources',
      'Volunteer schedule',
    ],
  },
  affected_individual: {
    title: 'Help Request Center',
    description: 'Submit and track assistance requests',
    features: [
      'Submit help requests',
      'Track request status',
      'Access emergency resources',
      'Contact support team',
    ],
  },
  government: {
    title: 'Government Help Centre',
    description: 'System-wide coordination and oversight',
    features: [
      'Resource allocation',
      'Incident overview',
      'Response analytics',
      'Policy management',
    ],
  },
};
