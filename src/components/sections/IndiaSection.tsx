import React from 'react';

interface IndiaSectionProps {
  ref?: React.Ref<HTMLDivElement>;
}

const IndiaSection = ({ ref }: IndiaSectionProps) => {
  return (
    <section
      ref={ref}
      className="relative w-full h-[150vh] overflow-hidden flex items-center justify-center pt-20 snap-start"
    >
      {/* 
        Removed bg-black so the fixed Earth from Hero/ModelScene can show through.
        You can add a subtle overlay if needed.
      */}
      {/* <div className="absolute inset-0 bg-gradient-to-b from-black via-black/40 to-black z-0 pointer-events-none" /> */}

      <div className="relative z-10 text-center">
        {/* Placeholder for content later */}
      </div>

      {/* Fade overlay for bottom transition */}
      {/* <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" /> */}
    </section>
  );
};

export default IndiaSection;
