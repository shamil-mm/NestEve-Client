import React from 'react'

type Section={
    title:string;
    description:string;
}
type SectionTitleProps={
    section:Section;
    light?:boolean
}

const SectionTitle:React.FC<SectionTitleProps> = ({section, light = false }) => {4
    const titleParts = section.title.split(' ');
  const lastWord = titleParts.pop();
  const firstPart = titleParts.join(' ');
  return (
    <div className="text-center mb-6 sm:mb-8">
    <h2 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 ${light ? 'text-white' : 'text-white'}`}>
      {firstPart}{' '}
      <span className="text-[#2f00ff]">{lastWord}</span>
    </h2>
    {section.description && <p className="text-sm sm:text-base md:text-lg text-gray-400 px-4">{section.description}</p>}
  </div>
  )
}

export default SectionTitle
