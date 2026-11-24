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
  accent: 'emerald' | 'cyan' | 'violet' | 'amber';
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
  type: 'IEEE Paper' | 'Technical Write-up' | 'Press Feature';
  summary: string;
  url: string;
  badge?: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  url?: string;
  highlight?: string;
}

export interface AwardItem {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export const BOX_META = {
  hostname: 'ROSHAN-01',
  ip: '10.10.11.24',
  domain: 'roshanreju.github.io',
  os: 'Linux 6.8 (Ubuntu / Chicago-DC)',
  difficulty: 'Medium · Real-World Portfolio',
  userFlag: 'HTB{c4ptr4_appsec_t0_r3d_t34m}',
  rootFlag: 'HTB{r00t_4cc3ss_4i_llm_s3cur1ty_pwn3d}',
};

export const PROFILE = {
  name: 'Roshan Reju',
  handle: '@C4PTR4',
  tagline: 'Red Teamer · AI Security · CSIRT · AppSec',
  location: 'Chicago, IL',
  availability: 'Red Teamer · AI Security Researcher · AppSec',
  email: 'roshan.reju@gmail.com',
  avatarUrl: 'https://avatars.githubusercontent.com/u/48003536?v=4',
  heroHeadline: 'Target Acquired: ROSHAN-01',
  heroBio:
    'AppSec Engineer turned Red Teamer & AI Security Researcher based in Chicago. Experience spanning Google, H&R Block (AppSec & 24/7 CSIRT), and Northeastern University — focused on offensive security, LLM red teaming, VAPT, and deep-learning threat detection.',
  aboutParagraphs: [
    'I bridge offensive security and engineering—combining hands-on red teaming, manual penetration testing, DevSecOps, and 24/7 CSIRT incident investigation to uncover real-world risk before adversaries do.',
    'My path spans Application Security and 24/7 SOC/CSIRT engineering at H&R Block, an internship opportunity at Google, and graduate cybersecurity research at Northeastern University focused on offensive security, deep-learning phishing detection, and red teaming Large Language Models (LLMs).',
    'Recognized in the EC-Council CEH Hall of Fame (2025, plus 2021 & 2023 finalist honors), published in IEEE Xplore, and featured in The Hindu for deploying our AI phishing detection API into Kerala Police Cyberdome’s BSafe app. Outside engagements and bug bounties on HackerOne & Bugcrowd, I write under @C4PTR4, game (FPS & racing), and shoot photography.',
  ],
  stats: [
    { value: 'CEH HoF', label: 'EC-Council Hall of Fame (2025)' },
    { value: 'Google', label: 'Security Internship Alumni' },
    { value: 'IEEE', label: 'Published AI Security Author' },
    { value: '4×', label: 'H&R Block Security Awards' },
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
    handle: 'ICCIS 2021',
  },
];

export const FOCUS_AREAS: FocusArea[] = [
  {
    id: 'red-team',
    title: 'Red Teaming & VAPT',
    summary:
      'Adversary simulation, external OSINT reconnaissance, and manual penetration testing across web applications, APIs, Android apps, and thick clients.',
    tags: ['Web & API Pentesting', 'OSINT', 'Android Security', 'Thick Clients'],
    accent: 'emerald',
  },
  {
    id: 'ai-security',
    title: 'AI & LLM Security',
    summary:
      'Red teaming Large Language Models for prompt injection, jailbreaks, and data exfiltration, plus deep-learning phishing defense.',
    tags: ['LLM Red Teaming', 'Adversarial ML', 'AI Phishing Detection'],
    accent: 'cyan',
  },
  {
    id: 'appsec',
    title: 'AppSec & DevSecOps',
    summary:
      'Embedding security into CI/CD pipelines via SAST, dependency governance (Sonatype/SonarQube), threat modeling, and executive security metrics.',
    tags: ['DevSecOps', 'SAST', 'SonarQube', 'Sonatype', 'PowerBI Metrics'],
    accent: 'violet',
  },
  {
    id: 'csirt',
    title: 'CSIRT & Bug Bounty',
    summary:
      '24/7 incident triage, root-cause forensics, SIEM detection rule authoring, and responsible vulnerability disclosure on HackerOne & Bugcrowd.',
    tags: ['Incident Response', 'Splunk', 'Detection Rules', 'HackerOne', 'Bugcrowd'],
    accent: 'amber',
  },
];

export const SKILL_GROUPS = [
  {
    category: 'Offensive & Red Team',
    items: [
      'Red Teaming & Adversary Emulation',
      'Penetration Testing (Web / API / Android)',
      'LLM & AI Red Teaming',
      'OSINT & Recon Automation',
      'WAF Testing & Bypass',
      'JWT & Cryptographic Attacks',
    ],
  },
  {
    category: 'AppSec & CSIRT',
    items: [
      'DevSecOps & SAST',
      'CSIRT / 24×7 SOC Investigation',
      'Detection Engineering & SIEM Rules',
      'Splunk & Imperva',
      'Qualys & Black Kite',
      'Bug Bounty Triage (HackerOne)',
    ],
  },
  {
    category: 'Languages & Tooling',
    items: [
      'Python',
      'Java',
      'Perl',
      'Bash',
      'Burp Suite',
      'Nikto',
      'SonarQube',
      'Sonatype',
      'PowerBI',
      'Keras / Flask',
    ],
  },
];

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: 'Security Intern',
    organization: 'Google',
    period: '2024',
    location: 'United States',
    highlights: [
      'Completed security engineering / offensive security internship at Google, applying ethical hacking and application security fundamentals at scale.',
      'Featured in EC-Council’s CEH Hall of Fame (2025) highlighting how hands-on ethical hacking foundations propelled the internship.',
    ],
    tags: ['Security Engineering', 'Offensive Security', 'AppSec', 'Scale'],
  },
  {
    role: 'Application Security Engineer',
    organization: 'H&R Block',
    period: 'May 2022 — Aug 2023',
    location: 'Enterprise AppSec',
    highlights: [
      'Executed web application Vulnerability Assessments and Penetration Testing (VAPT) across critical enterprise applications.',
      'Partnered with developers to shift security left via DevSecOps, SAST, and dependency management.',
      'Collaborated with the Red Team on external OSINT assessments across public-facing infrastructure, uncovering configuration weaknesses.',
      'Supported the HackerOne bug bounty program and built an executive PowerBI AppSec dashboard tracking pentest calendars, Sonatype T1 status, SonarQube repos, and bounty metrics.',
    ],
    tags: ['VAPT', 'DevSecOps', 'SAST', 'OSINT', 'HackerOne', 'PowerBI'],
  },
  {
    role: 'Associate Security Engineer (SOC / CSIRT)',
    organization: 'H&R Block',
    period: 'Jun 2021 — May 2022',
    location: '24/7 Security Operations Center',
    highlights: [
      'Investigated cybersecurity and network-level incidents in a 24/7 CSIRT / SOC environment.',
      'Diagnosed root causes, authored detailed incident reports, and designed preventive remediation strategies.',
      'Authored and tuned SIEM alert rules to improve detection coverage for emerging threats.',
      'Validated 40 critical external cyber-risk findings surfaced by Black Kite, earning the H&R Block Thank You Award.',
    ],
    tags: ['CSIRT', 'SOC 24/7', 'Incident Response', 'Detection Rules', 'Black Kite'],
  },
  {
    role: 'Support Analyst Intern',
    organization: 'Capgemini',
    period: 'Sep 2019',
    location: 'Banking Infrastructure',
    highlights: [
      'Analyzed IT, storage, and network security architecture across enterprise banking infrastructure.',
      'Studied real-time database and endpoint security monitoring using Imperva, Splunk, and Qualys.',
    ],
    tags: ['Network Security', 'Splunk', 'Imperva', 'Qualys'],
  },
];

export const EDUCATION: EducationItem[] = [
  {
    degree: 'Master of Science in Cybersecurity',
    institution: 'Northeastern University',
    period: '2023 — 2025',
    location: 'Boston, MA',
    details:
      'Graduate specialization in offensive security, application & network defense, deep learning for security, and red teaming Large Language Models (LLMs).',
  },
  {
    degree: 'B.Tech in Computer Science & Engineering',
    institution: 'Rajagiri School of Engineering & Technology',
    period: '2017 — 2021',
    location: 'Kochi, India',
    details:
      'Published IEEE research on AI-based phishing detection, received KSCSTE Student Project Scheme funding, and integrated our detection API into Kerala Police Cyberdome’s BSafe platform.',
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    title: 'Phishector (Cyberdome BSafe Integration)',
    category: 'Security & AI',
    description:
      'Deep-learning phishing detection system built alongside published IEEE research. Presented to Kerala Police Cyberdome, which integrated API components into its BSafe anti-fraud app (featured in The Hindu).',
    stack: ['Python', 'Deep Learning', 'Phishing Defense', 'Cyberdome API'],
    link: 'https://www.linkedin.com/posts/roshan-reju-98702a41_security-phishing-cyberattacks-activity-6815219076705644544-mqSr/',
    linkLabel: 'View Project',
    featured: true,
  },
  {
    title: 'Nikto_capt.r4',
    category: 'Tools & Labs',
    description:
      'Customized web vulnerability scanner repository based on Nikto for automated reconnaissance, dangerous file discovery, and misconfiguration auditing.',
    stack: ['Perl', 'Web Recon', 'Vulnerability Scanning'],
    link: 'https://github.com/roshanreju/Nikto_capt.r4',
    linkLabel: 'GitHub Repo',
    featured: true,
  },
  {
    title: 'CTF & Wargame Cheatsheet',
    category: 'Tools & Labs',
    description:
      'Curated offensive security reference covering binary exploitation, web attacks, privilege escalation, and quick command patterns for CTFs and wargames.',
    stack: ['Python', 'CTF', 'Offensive Security'],
    link: 'https://github.com/roshanreju/ctf-cheatsheet',
    linkLabel: 'GitHub Repo',
    featured: true,
  },
  {
    title: 'Facial Expression Recognition (Keras + Flask)',
    category: 'Security & AI',
    description:
      'End-to-end convolutional neural network (CNN) trained in Keras and served through a Flask web interface for live video stream and image inference.',
    stack: ['Python', 'Keras', 'CNN', 'Flask', 'OpenCV'],
    link: 'https://github.com/roshanreju/Facial-Expression-Recognition-with-Keras',
    linkLabel: 'GitHub Repo',
  },
  {
    title: 'TrashTalker IoT Alerting',
    category: 'Engineering',
    description:
      'IoT-enabled smart waste monitoring and real-time alerting system built in Python to automate fill-level notifications.',
    stack: ['Python', 'IoT', 'Sensors', 'Alerting'],
    link: 'https://github.com/roshanreju/TrashTalker',
    linkLabel: 'GitHub Repo',
  },
  {
    title: 'CovKart',
    category: 'Engineering',
    description:
      'Contactless quarantine essentials platform designed during the pandemic to streamline safe local deliveries.',
    stack: ['Web App', 'Product', 'Demo'],
    link: 'https://www.youtube.com/watch?v=L5S_8hD64Iw',
    linkLabel: 'Watch Demo',
  },
];

export const PUBLICATIONS: PublicationItem[] = [
  {
    title: 'Survey and Analysis on AI Based Phishing Detection Techniques',
    venue:
      'IEEE — International Conference on Communication, Control and Information Sciences (ICCIS)',
    date: '2021',
    type: 'IEEE Paper',
    summary:
      'Co-authored comparative study evaluating machine learning and deep learning architectures for detecting phishing URLs and malicious web pages.',
    url: 'https://ieeexplore.ieee.org/document/9484929',
    badge: '14+ Citations · IEEE Xplore',
  },
  {
    title: 'Penetration Testing Your Web Application Firewall: A Step-by-Step Guide',
    venue: 'Medium (@C4PTR4)',
    date: 'Feb 2023',
    type: 'Technical Write-up',
    summary:
      'Practical methodology for fingerprinting, testing, and validating Web Application Firewall rulesets during offensive engagements.',
    url: 'https://medium.com/@roshan.reju/penetration-testing-your-web-application-firewall-a-step-by-step-guide-325cebb66915',
  },
  {
    title: 'Rowhammer Attacks: Exploiting DRAM Vulnerabilities in Modern Systems',
    venue: 'Medium (@C4PTR4)',
    date: 'Hardware Security',
    type: 'Technical Write-up',
    summary:
      'Deep-dive breakdown of hardware-level bit flips in modern DRAM modules, exploitation primitives, and mitigations.',
    url: 'https://medium.com/@roshan.reju',
  },
  {
    title: 'Attacking JSON Web Tokens',
    venue: 'Medium (@C4PTR4)',
    date: 'AppSec & Crypto',
    type: 'Technical Write-up',
    summary:
      'Hands-on exploration of JWT signing pitfalls, algorithm confusion, weak secrets, and secure token validation patterns.',
    url: 'https://medium.com/@roshan.reju',
  },
];

export const CERTIFICATIONS: CertificationItem[] = [
  {
    name: 'Certified Ethical Hacker (CEH)',
    issuer: 'EC-Council',
    url: 'https://aspen.eccouncil.org/VerifyBadge?type=certification&a=MKzKWUTWF90CKqiac6WYkzx5fGkkdwc+KdC7BlTn2rk=',
    highlight: 'Verified Badge',
  },
  {
    name: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
  },
  {
    name: 'Google IT Support Professional Certificate',
    issuer: 'Google',
  },
];

export const AWARDS: AwardItem[] = [
  {
    title: 'EC-Council CEH Hall of Fame (2025) & 2× Finalist',
    issuer: 'EC-Council',
    date: '2021 · 2023 · 2025',
    description:
      'Featured in EC-Council’s invitation-only CEH Hall of Fame recognizing top global ethical hacking practitioners and industry impact.',
  },
  {
    title: 'Featured in The Hindu — Cyberdome BSafe Integration',
    issuer: 'The Hindu / Kerala Police Cyberdome',
    date: 'Sep 2021',
    description:
      'National press coverage for developing a deep-learning phishing detection API integrated into Kerala Police Cyberdome’s BSafe anti-fraud platform.',
  },
  {
    title: 'Going Extra Mile Award',
    issuer: 'H&R Block',
    date: 'Jun 2023',
    description:
      'Recognized for proactive security initiatives and high-impact contributions across the Application Security organization.',
  },
  {
    title: 'Quarterly Block Stars',
    issuer: 'H&R Block',
    date: 'Feb 2023',
    description:
      'Awarded for leading external OSINT assessments with the Red Team and building the executive PowerBI AppSec visibility dashboard.',
  },
  {
    title: 'Thank You Award',
    issuer: 'H&R Block',
    date: 'Aug 2022',
    description:
      'Recognized for validating 40 critical external cyber-risk findings reported by Black Kite.',
  },
  {
    title: 'Beyond the Call of Duty & KSCSTE Research Funding',
    issuer: 'H&R Block · KSCSTE',
    date: 'Oct 2021',
    description:
      'Dual recognition for Kerala Police Cyberdome association and competitive state funding under the Student Project Scheme.',
  },
];
