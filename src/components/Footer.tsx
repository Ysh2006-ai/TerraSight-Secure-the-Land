import { ArrowRight, Linkedin, Twitter, Github } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="relative w-full bg-brand-black pt-20 pb-0 overflow-hidden border-t border-white/10">



            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Top Section: CTA */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20 gap-8">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
                            Built For Teams Managing <br />
                            <span className="text-brand-green">Complex, Distributed Risk</span>
                        </h2>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-brand-green transition-colors flex items-center gap-2">
                            Contact Us <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="px-6 py-3 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-colors">
                            Customer Stories
                        </button>
                    </div>
                </div>

                <div className="w-full h-px bg-white/10 mb-16" />

                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-20">

                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-4 h-4 bg-brand-green rounded-full animate-pulse" />
                            <span className="text-white font-display font-bold text-xl tracking-widest">TerraSight</span>
                        </div>
                        <div className="flex gap-4 text-gray-400">
                            <Linkedin className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                            <Twitter className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                            <Github className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Platform</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-brand-green cursor-pointer">Satellite Feeds</li>
                            <li className="hover:text-brand-green cursor-pointer">AI Analysis</li>
                            <li className="hover:text-brand-green cursor-pointer">Predictive Risk</li>
                            <li className="hover:text-brand-green cursor-pointer">API Access</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Resources</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-brand-green cursor-pointer">Documentation</li>
                            <li className="hover:text-brand-green cursor-pointer">Case Studies</li>
                            <li className="hover:text-brand-green cursor-pointer">Security</li>
                            <li className="hover:text-brand-green cursor-pointer">Compliance</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="hover:text-brand-green cursor-pointer">About Us</li>
                            <li className="hover:text-brand-green cursor-pointer">Careers</li>
                            <li className="hover:text-brand-green cursor-pointer">Press</li>
                            <li className="hover:text-brand-green cursor-pointer">Contact</li>
                        </ul>
                    </div>

                    {/* Locations - Fictional/Thematic */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Global Ops</h4>
                        <ul className="space-y-6 text-gray-400 text-sm">
                            <li>
                                <span className="text-white block font-bold mb-1">North America</span>
                                101 Orbit Way, Suite 500<br />
                                San Francisco, CA
                            </li>
                            <li>
                                <span className="text-white block font-bold mb-1">Europe</span>
                                Satellitenring 42<br />
                                Berlin, Germany
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="w-full h-px bg-white/10 mb-8 relative z-20" />

                {/* Bottom Bar - Positioned ABOVE the Watermark */}
                <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 gap-4 py-8 relative z-20">
                    <div>
                        &copy; 2026 TerraSight Intelligence Inc. All rights reserved.
                    </div>
                    <div className="flex gap-8">
                        <span className="hover:text-white cursor-pointer transition-colors">Associations</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Data Privacy</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Imprint</span>
                        <span className="hover:text-white cursor-pointer transition-colors">Policy</span>
                    </div>
                </div>

            </div>

            {/* Massive Watermark Section - Full Width & Visible */}
            <div className="w-full flex justify-center items-end pointer-events-none select-none pb-0">
                <h1 className="text-[17vw] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/0 to-white/30 leading-none tracking-tighter -translate-y-[20%]">
                    TERRASIGHT
                </h1>
            </div>
        </footer>
    )
}

export default Footer
