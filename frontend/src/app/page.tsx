import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50 via-white to-transparent dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-32 mt-16 overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-slate-100/[0.03] bg-[size:40px_40px] opacity-100"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 dark:bg-blue-500/20 rounded-lg animate-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-500/10 dark:bg-purple-500/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>


        <div className="container mx-auto px-4 relative max-w-4xl">
          <div className="flex flex-col items-center text-center">
            {/* Logo animation */}
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse-glow"></div>
              <div className="relative w-full h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-float">
                <svg className="w-16 h-16 text-white transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            
            {/* Main title with enhanced animation */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient">
                SafeBridge
              </span>
            </h1>
            
            <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-300 animate-fade-in-right stagger-1">
              AI-Powered Disaster Response Coordination
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl animate-fade-in-left stagger-2">
              Connecting affected individuals, volunteers, and first responders with speed and clarity during critical moments. Our AI-powered platform ensures rapid response and efficient coordination when it matters most.
            </p>
            
            {/* Demo Mode Notification */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8 animate-fade-in-up stagger-2.5 max-w-2xl">
              <h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
                🔍 Demo Mode Active
              </h3>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                This application is running in demo mode with mock data. Login with any of these accounts:<br/>
                <span className="font-mono text-xs">responder@example.com, volunteer@example.com, individual@example.com, government@example.com</span><br/>
                (password: password123)
              </p>
            </div>

            {/* Animated CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-slide-up stagger-3">
              <Link href="/login" 
                className="group w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center hover-lift">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login
                </span>
              </Link>
              
              <Link href="/register"
                className="group w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 font-semibold py-4 px-8 rounded-full transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center hover-lift">
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register
                </span>
              </Link>
            </div>

            {/* Statistics Section with SVG Icons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 w-full animate-slide-up stagger-4">
              {[
                { 
                  number: '1000+', 
                  label: 'Emergency Responses', 
                  color: 'blue',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )
                },
                { 
                  number: '24/7', 
                  label: 'AI Support', 
                  color: 'purple',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )
                },
                { 
                  number: '95%', 
                  label: 'Response Rate', 
                  color: 'pink',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )
                },
                { 
                  number: '500+', 
                  label: 'First Responders', 
                  color: 'indigo',
                  icon: (
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )
                }
              ].map((stat, index) => (
                <div key={stat.label} 
                     className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover-lift animate-scale-in"
                     style={{ animationDelay: `${(index + 1) * 0.1}s` }}>
                  <div className={`w-12 h-12 mx-auto mb-3 text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl sm:text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid with Images */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:from-transparent dark:via-blue-900/10 dark:to-transparent"></div>
        <div className="container mx-auto max-w-4xl relative">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 animate-slide-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              How SafeBridge Works
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              {
                title: "Rapid Response",
                description: "AI-powered system instantly analyzes and prioritizes requests for faster emergency response.",
                color: "blue"
              },
              {
                title: "Smart Coordination",
                description: "Efficiently connect those in need with the nearest available first responders.",
                color: "green"
              },
              {
                title: "Real-time Updates",
                description: "Stay informed with live status updates and location tracking of response teams.",
                color: "purple"
              },
              {
                title: "AI Chat Assistant",
                description: "24/7 AI support to guide users and provide critical information during emergencies.",
                color: "indigo"
              }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-up"
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className="w-16 h-16 mb-4 mx-auto flex items-center justify-center">
                  {feature.title === "Rapid Response" ? (
                    <svg className={`w-full h-full text-${feature.color}-600 dark:text-${feature.color}-400 transform transition-transform group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ) : feature.title === "Smart Coordination" ? (
                    <svg className={`w-full h-full text-${feature.color}-600 dark:text-${feature.color}-400 transform transition-transform group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  ) : feature.title === "Real-time Updates" ? (
                    <svg className={`w-full h-full text-${feature.color}-600 dark:text-${feature.color}-400 transform transition-transform group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                    </svg>
                  ) : (
                    <svg className={`w-full h-full text-${feature.color}-600 dark:text-${feature.color}-400 transform transition-transform group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Natural Disasters Showcase */}
          <div className="mt-20">
            <h3 className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-8">
              FORCES BEYOND CONTROL
            </h3>
            <div className="partner-slider from-white to-white dark:from-gray-900 dark:to-gray-900">
              <div className="flex animate-scroll">
                {[
                  { name: 'Forest Fire Response', image: '/images/image_1.jpg' },
                  { name: 'Flood Emergency', image: '/images/image_2.jpg' },
                  { name: 'Drought Impact', image: '/images/image_3.avif' },
                  { name: 'Storm Damage', image: '/images/image_4.jpg' },
                  { name: 'Disaster Recovery', image: '/images/image_5.jpg' }
                ].map((item) => (
                  <div key={item.name} className="flex-none w-[300px] mx-[25px]">
                    <div className="h-[200px] relative group rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-center font-semibold">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {/* Duplicate items for seamless loop */}
                {[
                  { name: 'Forest Fire Response', image: '/images/image_1.jpg' },
                  { name: 'Drought Impact', image: '/images/image_2.jpg' },
                  { name: 'Earthquake', image: '/images/image_3.avif' },
                  { name: 'Storm Damage', image: '/images/image_4.jpg' },
                  { name: 'Disaster Recovery', image: '/images/image_5.jpg' }
                ].map((item) => (
                  <div key={item.name} className="flex-none w-[300px] mx-[25px]">
                    <div className="h-[200px] relative group rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-110"
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
                        <p className="text-white text-center font-semibold">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900/50 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-center text-center">
            <Link href="/" className="group flex items-center space-x-2 mb-8 hover-lift">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center animate-float">
                <svg className="w-6 h-6 text-white transform transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                SafeBridge
              </span>
            </Link>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-8 animate-fade-in-right">
              Empowering communities with AI-driven disaster response coordination. Together we can make a difference when every second counts.
            </p>

            {/* Social Links */}
            {/* <div className="flex space-x-6 mb-8">
              {[
                { name: 'Twitter', icon: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                { name: 'GitHub', icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z' },
                { name: 'LinkedIn', icon: 'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' }
              ].map((social, index) => (
                <a key={social.name}
                   href="#"
                   className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transform hover:scale-110 transition-all hover-lift"
                   style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="sr-only">{social.name}</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div> */}

            <div className="text-sm text-gray-500 dark:text-gray-400 animate-fade-in-left">
              &copy; {new Date().getFullYear()} SafeBridge. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
