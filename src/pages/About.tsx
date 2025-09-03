import { Heart, Users, Globe, Zap, Shield, Accessibility } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

export default function About() {
  const { accessibilityPrefs } = useAppStore();

  const features = [
    {
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Translate sign language to over 10 different languages with high accuracy.'
    },
    {
      icon: Zap,
      title: 'Real-time Processing',
      description: 'Get instant recognition and translation with our advanced AI model.'
    },
    {
      icon: Accessibility,
      title: 'Accessibility First',
      description: 'Built with WCAG 2.1 compliance and comprehensive accessibility features.'
    },
    {
      icon: Users,
      title: 'Inclusive Design',
      description: 'Designed for deaf, hard-of-hearing, and hearing communities alike.'
    },
    {
      icon: Shield,
      title: 'Privacy Focused',
      description: 'Your data stays private with optional offline mode and secure processing.'
    },
    {
      icon: Heart,
      title: 'Community Driven',
      description: 'Built with feedback from the deaf and sign language communities.'
    }
  ];

  const stats = [
    { label: 'Supported Languages', value: '10+' },
    { label: 'Recognition Accuracy', value: '95%' },
    { label: 'Response Time', value: '<1s' },
    { label: 'Accessibility Score', value: 'AAA' }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'AI/ML Research Lead',
      description: 'Expert in computer vision and sign language recognition'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Accessibility Specialist',
      description: 'Deaf community advocate and UX accessibility expert'
    },
    {
      name: 'Aisha Patel',
      role: 'Linguistic Researcher',
      description: 'Multilingual sign language researcher and translator'
    },
    {
      name: 'David Kim',
      role: 'Software Engineer',
      description: 'Full-stack developer specializing in real-time applications'
    }
  ];

  return (
    <div className={cn("min-h-screen bg-background", accessibilityPrefs.highContrast && "high-contrast")}>
      <div className="container mx-auto px-4 py-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">About Our Mission</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Breaking down communication barriers through innovative technology and inclusive design.
            </p>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center space-y-1">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <Card className="card-elevated">
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Our Mission</h2>
            <p className="text-lg leading-relaxed max-w-4xl mx-auto text-muted-foreground">
              We believe that communication is a fundamental human right. Our Multilingual Sign Language Translator 
              is designed to bridge the gap between deaf and hearing communities, making communication more 
              accessible, inclusive, and natural for everyone.
            </p>
            <div className="flex justify-center">
              <Badge className="bg-gradient-hero text-white px-4 py-2">
                Powered by GmTC v1.0
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="card-elevated">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">{feature.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Accessibility Statement */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Accessibility className="h-6 w-6" />
              <span>Accessibility Commitment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We are committed to ensuring that our application is accessible to all users, regardless of their 
              abilities or disabilities. Our application follows WCAG 2.1 Level AAA guidelines and includes:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Keyboard navigation support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Screen reader compatibility</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>High contrast mode</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Adjustable text sizes</span>
                </li>
              </ul>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Reduced motion options</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Color blind support</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>44px minimum touch targets</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-success rounded-full"></span>
                  <span>Text-to-speech functionality</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="card-elevated">
                <CardContent className="p-6 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Technology & Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold">Technology Stack</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Advanced computer vision AI (GmTC v1.0)</li>
                  <li>• Real-time neural network processing</li>
                  <li>• Multi-language NLP models</li>
                  <li>• Progressive Web App architecture</li>
                  <li>• Offline-capable model caching</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold">Privacy & Security</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• No video data stored or transmitted</li>
                  <li>• Local processing when possible</li>
                  <li>• GDPR and accessibility compliance</li>
                  <li>• Open source components</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Get Involved</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We welcome feedback, contributions, and partnerships from the community. 
            Together, we can make communication more accessible for everyone.
          </p>
          <div className="flex justify-center space-x-4">
            <Badge variant="outline" className="px-4 py-2">
              community@slttranslator.com
            </Badge>
            <Badge variant="outline" className="px-4 py-2">
              GitHub: @sl-translator
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}