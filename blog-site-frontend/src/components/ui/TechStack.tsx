
const technologies = [
    { name: 'Java', slug: 'java/java-original.svg', provider: 'devicon' },
    { name: 'Spring Boot', slug: 'springboot' },
    { name: 'Python', slug: 'python' },
    { name: 'Node.js', slug: 'nodedotjs' },
    { name: 'Vue.js', slug: 'vuedotjs' },
    { name: 'PostgreSQL', slug: 'postgresql' },
    { name: 'MongoDB', slug: 'mongodb' },
    { name: 'Redis', slug: 'redis' },
    { name: 'Oracle', slug: 'oracle/oracle-original.svg', provider: 'devicon' },
    { name: 'Docker', slug: 'docker' },
    { name: 'RabbitMQ', slug: 'rabbitmq' },
    { name: 'Bash', slug: 'gnubash' },
    { name: 'AWS', slug: 'amazonwebservices/amazonwebservices-original.svg', provider: 'devicon' },
    { name: 'Apache Superset', slug: 'apachesuperset' },
    { name: 'Apache Drools', slug: 'apache/apache-original.svg', provider: 'devicon' },
    { name: 'Electron', slug: 'electron' },
];

const TechStack = () => {
    return (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-6">
            {technologies.map((tech, i) => (
                <div
                    key={i}
                    className="group relative flex flex-col items-center gap-3 p-4 rounded-2xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:border-[#EA580C] dark:hover:border-[#EA580C] transition-all duration-300 transform hover:-translate-y-1"
                >
                    <div className="w-12 h-12 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <img
                            src={tech.provider === 'devicon'
                                ? `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${tech.slug}`
                                : `https://cdn.simpleicons.org/${tech.slug}`
                            }
                            alt={tech.name}
                            className="w-10 h-10 relative z-10 transition-all duration-300 group-hover:scale-110"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 text-center uppercase tracking-tight group-hover:text-[#EA580C] transition-colors">
                        {tech.name}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default TechStack;
