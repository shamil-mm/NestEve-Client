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
    <div className="text-center mb-8">
    <h2 className={`text-3xl font-bold mb-3 ${light ? 'text-white' : 'text-white'}`}>
      {firstPart}{' '}
      <span className="text-[#2f00ff] text-500">{lastWord}</span>
    </h2>
    {section.description && <p className="text-gray-400">{section.description}</p>}
  </div>
  )
}

export default SectionTitle
