import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-background pt-32 pb-20 px-12 lg:px-40 relative z-10 snap-start">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 lg:gap-40">
        {/* Contact Info */}
        <div className="flex flex-col space-y-12">
          <h3 className="text-foreground text-xl font-bold tracking-[0.2em] opacity-90">
            CONTACT US
          </h3>
          <div className="space-y-12">
            <p className="text-text-secondary text-base lg:text-lg leading-relaxed max-w-sm font-medium tracking-wide">
              305 Everest , Mahakali<br />
              caves road , Andheri (E)<br />
              Mumbai - 400 093 , India
            </p>
            <p className="text-foreground text-lg font-bold tracking-[0.2em]">
              +912261378200
            </p>
          </div>
        </div>

        {/* Quick Lines */}
        <div className="flex flex-col space-y-12">
          <h3 className="text-foreground text-xl font-bold tracking-[0.2em] opacity-90">
            QUICK LINES
          </h3>
          <ul className="space-y-10">
            <li>
              <a
                href="#"
                className="text-text-secondary text-base lg:text-lg font-medium hover:text-accent transition-all duration-500 block max-w-md leading-relaxed hover:translate-x-2"
              >
                Bank Note and Security Printing India
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-text-secondary text-base lg:text-lg font-medium hover:text-accent transition-all duration-500 block max-w-md leading-relaxed hover:translate-x-2"
              >
                Machinery and Raw material for card industry
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-40 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-text-secondary text-[10px] tracking-[0.3em] font-bold uppercase opacity-30">
            © {new Date().getFullYear()} JUI GLOBAL. ALL RIGHTS RESERVED.
          </p>
        </div>
        <div className="flex gap-12">
          <a href="#" className="text-text-secondary text-[10px] tracking-[0.2em] font-bold hover:text-accent transition-colors opacity-30 hover:opacity-100 uppercase">Privacy</a>
          <a href="#" className="text-text-secondary text-[10px] tracking-[0.2em] font-bold hover:text-accent transition-colors opacity-30 hover:opacity-100 uppercase">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
