export interface SocialLink {
  label: string;
  href: string;
  handle: string;
}

export interface FocusArea {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  accent: 'red';
}

export interface ExperienceItem {
  role: string;
  organization: string;
  period: string;
  location: string;
  highlights: string[];
  tags: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string;
}

export interface VolunteeringItem {
  role: string;
  organization: string;
  period?: string;
}

export interface ProjectItem {
  title: string;
  category: 'Security & AI' | 'Tools & Labs' | 'Engineering';
  description: string;
  stack: string[];
  link: string;
  linkLabel: string;
  featured?: boolean;
}

export interface PublicationItem {
  title: string;
  venue: string;
  date: string;
  type: 'IEEE Paper' | 'Technical Write-up';
  summary: string;
  url: string;
  badge?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  date?: string;
  credentialId?: string;
  url?: string;
  highlight?: string;
}

export interface AwardItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export const PROFILE = {
  name: 'Roshan Reju',
  handle: '@C4PTR4',
  tagline: 'Associate Red Team Consultant @ Google · AI & LLM Security · AppSec · CSIRT',
  location: 'Chicago, IL',
  email: 'roshan.reju@gmail.com',
  aboutParagraphs: [
    'I am an Associate Red Team Consultant at Google in Chicago, emulating real-world adversaries to test enterprise security controls, cloud environments, detection engineering, and incident response readiness.',
    'My work incorporates Mandiant threat intelligence and real-world attacker TTPs across red team engagements, assumed breach exercises, internal/external network & web pentests, social engineering, and custom red team tool development.',
    'Previously, I earned my M.S. in Cybersecurity from Northeastern University’s Khoury College of Computer Sciences (where I also served as a Graduate Teaching Assistant), interned as a Security Consultant at Google, and spent over two years across Application Security and 24/7 CSIRT teams at H&R Block.',
    'I hold OffSec LLM Red Teaming, CompTIA PenTest+, and EC-Council CEH (Hall of Fame), published IEEE research on AI-based phishing detection, and volunteered as a Developer with Kerala Police Cyberdome.',
  ],
};

export const SOCIALS: SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/roshanreju', handle: 'roshanreju' },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/roshan-reju-98702a41',
    handle: 'roshan-reju',
  },
  { label: 'X / Twitter', href: 'https://twitter.com/C4PTR4', handle: '@C4PTR4' },
  { label: 'Medium', href: 'https://medium.com/@roshan.reju', handle: '@roshan.reju' },
  {
    label: 'IEEE Xplore',
    href: 'https://ieeexplore.ieee.org/document/9484929',
    handle: 'IEEE 2021',
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'red-team',
    title: 'Red Teaming & Adversary Emulation',
    summary:
      'Full-scope red team operations, assumed breach, and social engineering incorporating Mandiant threat intelligence and threat-actor TTPs.',
    tags: ['Adversary Emulation', 'Assumed Breach', 'Mandiant TTPs', 'Social Engineering'],
    accent: 'red',
  },
  {
    id: 'ai-security',
    title: 'AI & LLM Red Teaming',
    summary:
      'OffSec-certified LLM Red Teaming, adversarial AI testing, and deep-learning phishing detection research published with IEEE.',
    tags: ['OffSec LLM Red Teaming', 'AI Security', 'Deep Learning', 'Custom Tooling'],
    accent: 'red',
  },
  {
    id: 'appsec',
    title: 'Cloud, Network & AppSec VAPT',
    summary:
      'Internal/external network, web, API, Android, and thick-client penetration testing alongside cloud IAM privilege escalation assessments.',
    tags: ['Cloud IAM & Privesc', 'Web & API Pentest', 'Android VAPT', 'DevSecOps'],
    accent: 'red',
  },
  {
    id: 'csirt',
    title: 'CSIRT, Detection & Bug Bounty',
    summary:
      'Hands-on 24/7 incident response, malware analysis, SIEM detection tuning, and security research with Bugcrowd & HackerOne.',
    tags: ['CSIRT', 'CrowdStrike Falcon', 'Malware Analysis', 'Bugcrowd'],
    accent: 'red',
  },
];

export const SKILL_GROUPS = [
  {
    category: 'Red Team & Offensive',
    items: [
      'Red Team Assessments',
      'Adversary Emulation (Mandiant TTPs)',
      'Assumed Breach & Social Engineering',
      'LLM Red Teaming',
      'Cloud IAM & Privilege Escalation',
      'Internal / External Network Pentest',
      'Web, API, Android & Thick-Client VAPT',
      'Custom Offensive Tooling',
    ],
  },
  {
    category: 'AppSec & CSIRT Defense',
    items: [
      'DevSecOps & SAST (SonarQube / Sonatype)',
      'CrowdStrike Falcon & Devo',
      'Palo Alto Networks & Netskope',
      'Cisco ASA & Email Security',
      'Malware Analysis & Incident Response',
      'OSINT & Zero-Day Research',
    ],
  },
  {
    category: 'Tools, Cloud & Code',
    items: [
      'Python',
      'Java',
      'Perl',
      'Bash',
      'Burp Suite',
      'Nessus & OWASP ZAP',
      'MobSF / Drozer / ADB / JDGUI',
      'AWS & Microsoft Azure',
      'Splunk & Imperva',
      'PowerBI',
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Associate Red Team Consultant',
    organization: 'Google',
    period: 'Jun 2025 — Present',
    location: 'Chicago, IL · Hybrid',
    highlights: [
      'Conduct full-scope red team assessments, emulating real-world adversaries to evaluate client security controls, detection engineering, and incident response.',
      'Perform internal and external penetration testing across enterprise networks and web applications.',
      'Assess cloud environments for misconfigurations, IAM weaknesses, and privilege escalation paths.',
      'Execute assumed breach and social engineering assessments incorporating Mandiant threat intelligence and threat-actor TTPs.',
      'Build custom scripts, tools, and offensive methodologies to streamline red team workflows and deliver executive-ready security recommendations.',
    ],
    tags: ['Red Teaming', 'Mandiant TTPs', 'Cloud Security', 'Assumed Breach', 'Tool Dev'],
  },
  {
    role: 'Graduate Teaching Assistant',
    organization: 'Khoury College of Computer Sciences · Northeastern University',
    period: 'Jan 2024 — May 2025',
    location: 'Boston, MA',
    highlights: [
      'Network Security Practices (CY5150) — Spring 2025 (Jan 2025 – May 2025).',
      'Foundations of Information Assurance (CY5010) — Spring 2024 (Jan 2024 – Apr 2024).',
      'Mentored graduate cybersecurity students through hands-on network defense, applied cryptography, and security lab assignments.',
    ],
    tags: ['CY5150 Network Security', 'CY5010 Info Assurance', 'Mentorship'],
  },
  {
    role: 'Security Consultant Intern',
    organization: 'Google',
    period: 'May 2024 — Aug 2024',
    location: 'Chicago, IL · Hybrid',
    highlights: [
      'Performed Web Application Pentests, API Pentests, Internal & External Red Team Assessments, and Social Engineering engagements.',
      'Developed custom tooling to support Red Team operations.',
    ],
    tags: ['Red Team', 'Web & API Pentest', 'Social Engineering', 'Tool Development'],
  },
  {
    role: 'Associate Security Engineer — Application Security',
    organization: 'H&R Block',
    period: 'May 2022 — Aug 2023',
    location: 'Trivandrum, Kerala, India',
    highlights: [
      'Performed VAPT across Android, Web Applications, APIs, Thick Clients, and Web Application Firewalls (WAFs).',
      'Implemented DevSecOps workflows with SonarQube & Sonatype SAST, dependency governance, and the Autogovernance Project.',
      'Partnered with the Red Team on external OSINT assessments, supported the bug bounty program, and built an executive PowerBI AppSec dashboard.',
    ],
    tags: ['Android & Web VAPT', 'DevSecOps', 'SonarQube', 'Sonatype', 'Burp Suite', 'OSINT'],
  },
  {
    role: 'Associate Security Engineer — CSIRT',
    organization: 'H&R Block',
    period: 'Jun 2021 — May 2022',
    location: 'Trivandrum, Kerala, India',
    highlights: [
      'Investigated 24/7 cybersecurity and network incidents under strict SLAs, diagnosing root causes and authoring remediation reports.',
      'Monitored cloud, endpoint, and email security telemetry using CrowdStrike Falcon, Devo, Palo Alto Networks, Netskope, Azure, and Cisco ASA.',
      'Authored new SIEM alert rules and validated 40 critical external cyber-risk findings reported by Black Kite.',
    ],
    tags: ['CSIRT', 'CrowdStrike Falcon', 'Devo', 'Palo Alto', 'Netskope', 'Malware Analysis'],
  },
  {
    role: 'Support Analyst Intern',
    organization: 'Capgemini',
    period: 'Sep 2019',
    location: 'Bengaluru, India',
    highlights: [
      'Studied IT, network, storage, and database security architecture in the banking domain using Imperva, Splunk, and Qualys.',
    ],
    tags: ['Banking Infrastructure', 'Imperva', 'Splunk', 'Qualys'],
  },
  {
    role: 'Medical IT Intern',
    organization: 'Ministry of Health Hospital',
    period: 'Jun 2018 — Jul 2018',
    location: 'United Arab Emirates',
    highlights: [
      'Supported hospital IT operations and core network administration.',
    ],
    tags: ['IT Operations', 'Network Administration'],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Master of Science (M.S.), Cybersecurity',
    institution: 'Khoury College of Computer Sciences · Northeastern University',
    period: 'Sep 2023 — May 2025',
    location: 'Boston, MA',
    details:
      'Graduate Teaching Assistant for Network Security Practices (CY5150) and Foundations of Information Assurance (CY5010). Graduate Leadership Institute recipient.',
  },
  {
    degree: 'Bachelor of Technology (B.Tech), Computer Science',
    institution: 'Rajagiri School of Engineering & Technology',
    period: '2017 — 2021',
    location: 'Kochi, India',
    details:
      'Published IEEE research on AI-based phishing detection, awarded KSCSTE Student Project Scheme funding, and built PHISHECTOR.',
  },
];

export const VOLUNTEERING: VolunteeringItem[] = [
  { role: 'Developer', organization: 'Kerala Police Cyberdome', period: 'Jul 2021 — Apr 2023' },
  { role: 'Security Researcher', organization: 'Bugcrowd' },
  { role: 'Volunteer', organization: 'Cyber Peace Foundation' },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: 'PHISHECTOR',
    category: 'Security & AI',
    description:
      'Deep-learning phishing detection engine analyzing both HTML content and URLs. Presented to Kerala Police Cyberdome and integrated into the BSafe anti-fraud app (featured in The Hindu).',
    stack: ['Python', 'Deep Learning', 'HTML/URL Analysis', 'Cyberdome'],
    link: 'https://www.linkedin.com/posts/roshan-reju-98702a41_security-phishing-cyberattacks-activity-6815219076705644544-mqSr/',
    linkLabel: 'View Project',
    featured: true,
  },
  {
    title: 'Nikto_capt.r4',
    category: 'Tools & Labs',
    description:
      'Customized web vulnerability scanner repository based on Nikto for automated web reconnaissance and misconfiguration auditing.',
    stack: ['Perl', 'Web Recon', 'Vulnerability Scanning'],
    link: 'https://github.com/roshanreju/Nikto_capt.r4',
    linkLabel: 'GitHub Repo',
    featured: true,
  },
  {
    title: 'CTF & Wargame Cheatsheet',
    category: 'Tools & Labs',
    description:
      'Personal offensive security reference covering CTF exploitation techniques, command shortcuts, and pentesting playbooks.',
    stack: ['Python', 'CTF', 'Offensive Security'],
    link: 'https://github.com/roshanreju/ctf-cheatsheet',
    linkLabel: 'GitHub Repo',
    featured: true,
  },
  {
    title: 'Facial Expression Recognition (Keras + Flask)',
    category: 'Security & AI',
    description:
      'Trained a convolutional neural network (CNN) in Keras and deployed it through a Flask web interface for real-time video stream and image inference.',
    stack: ['Python', 'Keras', 'CNN', 'Flask'],
    link: 'https://github.com/roshanreju/Facial-Expression-Recognition-with-Keras',
    linkLabel: 'GitHub Repo',
  },
  {
    title: 'CovKart — Quarantine Made Easy',
    category: 'Engineering',
    description:
      'Built for the CracktheCovid-19 national-level hackathon (NASSCOM & IBM) — an online essentials platform making safe local shopping effortless.',
    stack: ['Web App', 'NASSCOM × IBM Hackathon'],
    link: 'https://www.youtube.com/watch?v=L5S_8hD64Iw',
    linkLabel: 'Watch Demo',
  },
  {
    title: 'Trash Talker (IoT Alerting)',
    category: 'Engineering',
    description:
      'Smart waste-level monitor using Arduino Uno, HC-SR04 ultrasonic sensor, and Bolt Wi-Fi module with Python SMS alerts when thresholds are exceeded.',
    stack: ['Python', 'Arduino', 'Bolt IoT', 'HC-SR04'],
    link: 'https://github.com/roshanreju/TrashTalker',
    linkLabel: 'GitHub Repo',
  },
];

export const PUBLICATIONS: PublicationItem[] = [
  {
    title: 'Survey and Analysis on AI Based Phishing Detection Techniques',
    venue: 'IEEE — ICCIS · Published Jul 20, 2021',
    date: 'Jul 2021',
    type: 'IEEE Paper',
    summary:
      'Evaluates three major AI-driven phishing detection paradigms — HTML content analysis, URL feature detection, and visual similarity approaches.',
    url: 'https://ieeexplore.ieee.org/document/9484929',
    badge: 'IEEE Xplore · 14+ Citations',
  },
  {
    title: 'Penetration Testing Your Web Application Firewall: A Step-by-Step Guide',
    venue: 'Medium (@C4PTR4)',
    date: 'Feb 2023',
    type: 'Technical Write-up',
    summary:
      'Hands-on guide to fingerprinting, testing, and bypassing Web Application Firewall rulesets during offensive engagements.',
    url: 'https://medium.com/@roshan.reju/penetration-testing-your-web-application-firewall-a-step-by-step-guide-325cebb66915',
  },
  {
    title: 'Rowhammer Attacks: Exploiting DRAM Vulnerabilities in Modern Systems',
    venue: 'Medium (@C4PTR4)',
    date: 'Hardware Security',
    type: 'Technical Write-up',
    summary:
      'Technical deep dive into hardware-level DRAM bit flips, exploitation primitives, and modern memory defenses.',
    url: 'https://medium.com/@roshan.reju',
  },
  {
    title: 'Attacking JSON Web Tokens',
    venue: 'Medium (@C4PTR4)',
    date: 'AppSec & Crypto',
    type: 'Technical Write-up',
    summary:
      'Practical breakdown of JWT cryptographic misconfigurations, algorithm confusion attacks, and hardening recommendations.',
    url: 'https://medium.com/@roshan.reju',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: 'OffSec LLM Red Teaming',
    issuer: 'OffSec',
    date: 'Apr 2026',
    credentialId: '180675831',
    highlight: 'Latest · AI Red Team',
  },
  {
    name: 'CompTIA PenTest+ (PT0-003)',
    issuer: 'CompTIA',
    date: 'Jul 2025 — Jul 2028',
    credentialId: '683F7MD5VFQ4QDR2',
    highlight: 'Offensive',
  },
  {
    name: 'Certified Ethical Hacker (CEH)',
    issuer: 'EC-Council',
    credentialId: 'ECC49126577512',
    url: 'https://aspen.eccouncil.org/VerifyBadge?type=certification&a=MKzKWUTWF90CKqiac6WYkzx5fGkkdwc+KdC7BlTn2rk=',
    highlight: 'Verified Badge',
  },
  {
    name: 'AWS Academy Graduate — Cloud Architecting, ML & CI/CD',
    issuer: 'Amazon Web Services (AWS)',
    date: 'Mar — Apr 2025',
  },
  {
    name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    date: 'Aug 2022',
  },
  {
    name: 'Graduate Leadership Institute & Google IT Support',
    issuer: 'Northeastern University · Google',
    date: '2020 — 2023',
  },
];

export const AWARDS: AwardItem[] = [
  {
    title: 'EC-Council CEH Hall of Fame (2025) · 2023 & 2021 Finalist',
    issuer: 'EC-Council',
    date: '2021 · 2023 · 2025',
    description:
      'By-invitation global recognition honoring top CEH certified practitioners and offensive security impact.',
  },
  {
    title: 'Featured in The Hindu — Cyberdome BSafe Integration',
    issuer: 'The Hindu · Kerala Police Cyberdome',
    date: 'Sep 2021',
    description:
      'National press coverage for integrating deep-learning phishing detection into Kerala Police Cyberdome’s BSafe anti-fraud app.',
  },
  {
    title: 'Going Extra Mile Award',
    issuer: 'H&R Block',
    date: 'Jun 2023',
    description:
      'Awarded for proactive initiatives and high-impact security engineering contributions across the organization.',
  },
  {
    title: 'Quarterly Block Stars',
    issuer: 'H&R Block',
    date: 'Feb 2023',
    description:
      'Recognized for external OSINT collaboration with the Red Team and building the executive PowerBI AppSec dashboard.',
  },
  {
    title: 'Thank You Award',
    issuer: 'H&R Block',
    date: 'Aug 2022',
    description:
      'Recognized for validating 40 critical external cyber-risk findings surfaced by Black Kite.',
  },
  {
    title: 'Beyond the Call of Duty & KSCSTE Research Funding',
    issuer: 'H&R Block · KSCSTE',
    date: 'Oct 2021',
    description:
      'Recognized for Kerala Police Cyberdome collaboration and awarded state funding under the Student Project Scheme.',
  },
];
