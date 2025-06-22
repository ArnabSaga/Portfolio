
import React from 'react';
import { Github, Facebook, Instagram, Linkedin } from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: 'Fahim Ahmed Asif',
      role: 'Founder',
      email: 'ahmedasif0007@gmail.com',
      image: '/lovable-uploads/5b09e2a4-c082-45cd-8a51-af73d9b3d9d1.png',
      social: {
        facebook: 'https://www.facebook.com/fahimahmed.asif.14/',
        instagram: 'https://www.instagram.com/faabs__photobin/',
        linkedin: 'https://www.linkedin.com/in/fahim-ahmed-asif-502897277/'
      },
      description: 'Visionary leader driving innovation in software development',
      skills: ['Full-Stack Development', 'AI Integration', 'Project Management']
    },
    {
      name: 'Nahian Ninad',
      role: 'Managing Director',
      image: '/placeholder.svg',
      social: {
        facebook: 'https://www.facebook.com/Neucleah',
        instagram: 'https://www.instagram.com/subconscious._.being/'
      },
      description: 'Strategic operations manager with expertise in business development',
      skills: ['Business Strategy', 'Operations Management', 'Client Relations']
    },
    {
      name: 'Achyuta Arnab Dey',
      role: 'Co-Founder',
      email: 'arnabdey15091@gmail.com',
      image: '/placeholder.svg',
      social: {
        facebook: 'https://www.facebook.com/avirs.arnab',
        instagram: 'https://www.instagram.com/rz_arnab_/',
        github: 'https://github.com/ArnabSaga',
        linkedin: 'https://www.linkedin.com/in/achyuta1/'
      },
      description: 'Technical architect specializing in modern web technologies',
      skills: ['MERN Stack', 'Three.js', 'System Architecture']
    }
  ];

  return (
    <section className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mb-16">
          <div className="bg-[#1e1e1e] rounded-lg border border-terminal-border p-6 mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="syntax-comment">// About NodeXstation</span>
            </div>
            <pre className="text-terminal-text">
              <span className="syntax-keyword">interface</span> <span className="syntax-variable">Company</span> {"{"}
              {"\n"}  <span className="syntax-variable">name</span>: <span className="syntax-string">"NodeXstation"</span>;
              {"\n"}  <span className="syntax-variable">mission</span>: <span className="syntax-string">"Transforming ideas into digital reality"</span>;
              {"\n"}  <span className="syntax-variable">founded</span>: <span className="syntax-string">"2024"</span>;
              {"\n"}  <span className="syntax-variable">speciality</span>: <span className="syntax-string">"AI-powered solutions"</span>;
              {"\n"}{"}"}
            </pre>
          </div>

          <h2 className="text-4xl font-bold text-terminal-green mb-6">
            <span className="syntax-keyword">about</span> <span className="syntax-function">team</span>()
          </h2>
          <p className="text-terminal-text/80 text-lg max-w-3xl">
            <span className="syntax-comment">/*</span><br />
            <span className="syntax-comment"> * Meet the innovative minds behind NodeXstation.</span><br />
            <span className="syntax-comment"> * We're passionate developers, strategists, and problem-solvers</span><br />
            <span className="syntax-comment"> * committed to delivering exceptional digital experiences.</span><br />
            <span className="syntax-comment"> */</span>
          </p>
        </div>

        {/* Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className="group relative bg-gradient-to-br from-terminal-bg/90 to-terminal-bg/60 rounded-xl border border-terminal-border overflow-hidden hover:border-terminal-green transition-all duration-500 hover:shadow-2xl hover:shadow-terminal-green/10 hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Profile Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-terminal-bg/80 via-transparent to-transparent" />
                
                {/* Role Badge */}
                <div className="absolute top-4 right-4 bg-terminal-green/90 backdrop-blur-md text-terminal-bg px-3 py-1 rounded-full text-sm font-mono font-semibold">
                  {member.role}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Name */}
                <h3 className="text-xl font-bold text-terminal-text mb-2 group-hover:text-terminal-green transition-colors duration-300">
                  {member.name}
                </h3>

                {/* Description */}
                <p className="text-terminal-text/70 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <p className="text-terminal-yellow text-xs font-mono mb-2 uppercase tracking-wider">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs bg-terminal-border/20 text-terminal-text/80 px-2 py-1 rounded border border-terminal-border/30 font-mono"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                {member.email && (
                  <div className="mb-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-terminal-blue hover:text-terminal-green transition-colors text-sm font-mono flex items-center gap-2 group/email"
                    >
                      <span className="w-2 h-2 bg-terminal-green rounded-full animate-pulse" />
                      <span className="group-hover/email:underline">{member.email}</span>
                    </a>
                  </div>
                )}

                {/* Social Links */}
                <div className="flex justify-center space-x-3 pt-4 border-t border-terminal-border/20">
                  {member.social.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-terminal-border/10 border border-terminal-border/20 flex items-center justify-center text-terminal-text hover:text-terminal-green hover:border-terminal-green/50 hover:bg-terminal-green/10 transition-all duration-300"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-terminal-border/10 border border-terminal-border/20 flex items-center justify-center text-terminal-text hover:text-terminal-blue hover:border-terminal-blue/50 hover:bg-terminal-blue/10 transition-all duration-300"
                    >
                      <Linkedin size={16} />
                    </a>
                  )}
                  {member.social.facebook && (
                    <a
                      href={member.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-terminal-border/10 border border-terminal-border/20 flex items-center justify-center text-terminal-text hover:text-terminal-blue hover:border-terminal-blue/50 hover:bg-terminal-blue/10 transition-all duration-300"
                    >
                      <Facebook size={16} />
                    </a>
                  )}
                  {member.social.instagram && (
                    <a
                      href={member.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-lg bg-terminal-border/10 border border-terminal-border/20 flex items-center justify-center text-terminal-text hover:text-terminal-purple hover:border-terminal-purple/50 hover:bg-terminal-purple/10 transition-all duration-300"
                    >
                      <Instagram size={16} />
                    </a>
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-terminal-green/5 via-transparent to-terminal-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Company Values */}
        <div className="mt-16 bg-[#1e1e1e] rounded-lg border border-terminal-border p-8">
          <h3 className="text-2xl font-semibold text-terminal-green mb-6">
            <span className="syntax-keyword">const</span> <span className="syntax-variable">values</span> = {"{"}
          </h3>
          <div className="grid md:grid-cols-3 gap-6 pl-6">
            <div>
              <h4 className="text-terminal-yellow mb-2">
                <span className="syntax-variable">innovation</span>:
              </h4>
              <p className="text-terminal-text/80 text-sm">
                <span className="syntax-string">"Embracing cutting-edge technologies to solve complex problems"</span>
              </p>
            </div>
            <div>
              <h4 className="text-terminal-yellow mb-2">
                <span className="syntax-variable">quality</span>:
              </h4>
              <p className="text-terminal-text/80 text-sm">
                <span className="syntax-string">"Delivering exceptional solutions with attention to detail"</span>
              </p>
            </div>
            <div>
              <h4 className="text-terminal-yellow mb-2">
                <span className="syntax-variable">collaboration</span>:
              </h4>
              <p className="text-terminal-text/80 text-sm">
                <span className="syntax-string">"Working closely with clients to exceed expectations"</span>
              </p>
            </div>
          </div>
          <p className="text-terminal-green mt-6">{"}"}</p>
        </div>
      </div>
    </section>
  );
};

export default About;
