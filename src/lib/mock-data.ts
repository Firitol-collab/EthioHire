import { Job, UserProfile } from './types';

export const MOCK_USER_PROFILE: UserProfile = {
  name: 'Abebe Kebede',
  email: 'abebe.kebede@example.com',
  phone: '+251 911 223344',
  linkedin: 'https://linkedin.com/in/abebekebede',
  summary: 'Experienced Software Engineer with a passion for building scalable web applications. Strong background in React, Node.js, and cloud technologies.',
  skills: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'TypeScript', 'Tailwind CSS', 'AWS'],
  experience: [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'Ethio Tech Solutions',
      startDate: 'January 2021',
      endDate: 'Present',
      description: 'Leading the frontend team in developing a high-performance e-commerce platform. Improved page load times by 40%.',
    },
    {
      id: '2',
      title: 'Software Developer',
      company: 'Addis Softwares',
      startDate: 'June 2018',
      endDate: 'December 2020',
      description: 'Developed and maintained various web applications for local clients. Implemented responsive designs and integrated third-party APIs.',
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.Sc. in Computer Science',
      institution: 'Addis Ababa University',
      startDate: 'September 2014',
      endDate: 'July 2018',
      description: 'Focused on software engineering and database management systems.',
    }
  ]
};

export const MOCK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior Software Engineer',
    company: 'Safaricom Ethiopia',
    location: 'Addis Ababa, Ethiopia',
    description: 'We are looking for a Senior Software Engineer to join our core services team. You will be responsible for designing and implementing scalable backend systems.',
    url: 'https://linkedin.com/jobs/view/123456',
    status: 'saved',
    dateAdded: '2023-11-01',
    matchScore: 85,
  },
  {
    id: 'job-2',
    title: 'Product Manager',
    company: 'Ethio Telecom',
    location: 'Addis Ababa, Ethiopia',
    description: 'Ethio Telecom is seeking an experienced Product Manager to drive the development of new digital products and services.',
    url: 'https://linkedin.com/jobs/view/789012',
    status: 'applied',
    dateAdded: '2023-10-25',
    matchScore: 72,
  },
  {
    id: 'job-3',
    title: 'UI/UX Designer',
    company: 'Gebeya Inc.',
    location: 'Remote',
    description: 'Join our design team to create beautiful and intuitive user experiences for our global client base.',
    url: 'https://linkedin.com/jobs/view/345678',
    status: 'interview',
    dateAdded: '2023-11-05',
    matchScore: 92,
  }
];