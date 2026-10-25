import { useState } from "react";

function AMaccordian() {
    const [selected, setSelected] = useState(null);
    const [aiSummaries, setAiSummaries] = useState({});
    const [loadingIndex, setLoadingIndex] = useState(null);

    const toggle = (index) => {
        if (selected === index) {
            return setSelected(null);
        } else {
            setSelected(index);
        }
    };

    const handleGenerateSummary = async (item, index) => {
        setLoadingIndex(index);
        try {
            const response = await fetch('/api/Ben-AI', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userQuestion: `Provide a clear, concise 2-sentence plain-language summary of the ${item.Ammendment} based on this exact text: "${item.Exact}"`
                })
            });
            
            const data = await response.json();
            if (response.ok) {
                setAiSummaries(prev => ({ ...prev, [index]: data.answer }));
            } else {
                setAiSummaries(prev => ({ ...prev, [index]: data.error || 'Failed to generate summary.' }));
            }
        } catch (err) {
            setAiSummaries(prev => ({ ...prev, [index]: 'Network error connecting to Ben.' }));
        } finally {
            setLoadingIndex(null);
        }
    };

    return (
        <div className="AccordianWrapper constitution-accordion">
            <div className="Accordian">
                {data.map((item, index) => (
                    <div key={index} className="AccordianItem">
                        <button
                            className="AccordianHeader"
                            type="button"
                            aria-expanded={selected === index}
                            aria-controls={`bill-amendment-${index}`}
                            onClick={() => toggle(index)}
                        >
                            <span className="constitution-amendment-number" aria-hidden="true">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="constitution-amendment-title">{item.Ammendment}</span>
                            <span className="constitution-amendment-toggle" aria-hidden="true">
                                {selected === index ? '−' : '+'}
                            </span>
                        </button>
                        
                        <div id={`bill-amendment-${index}`} className={selected === index ? 'AccordianContent' : 'AccordianContent-hidden'}>
                            <p className="constitution-amendment-summary">{item.Summary}</p>
                            
                            {/* AI Summary Section matching newspaper theme */}
                            <div className="ai-summary-section" style={{ margin: '1.25rem 0' }}>
                                <button
                                    type="button"
                                    onClick={() => handleGenerateSummary(item, index)}
                                    disabled={loadingIndex === index}
                                    style={{
                                        padding: '7px 14px',
                                        fontSize: '0.85rem',
                                        fontFamily: '"Cinzel", "Georgia", serif',
                                        fontWeight: '600',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                        cursor: loadingIndex === index ? 'wait' : 'pointer',
                                        backgroundColor: '#fbf9f4',
                                        color: '#1b2a3a',
                                        border: '1px solid #1b2a3a',
                                        borderRadius: '2px',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {loadingIndex === index ? 'Ben is analyzing...' : '✦ Ask Ben for AI Summary'}
                                </button>

                                {aiSummaries[index] && (
                                    <div 
                                        style={{ 
                                            marginTop: '12px', 
                                            padding: '14px 16px', 
                                            backgroundColor: '#EBF8FF', 
                                            borderLeft: '3px solid #1b2a3a',
                                            borderRadius: '20px',
                                            boxShadow: 'inset 0 0 2px rgba(0,0,0,0.02)'
                                        }}
                                    >
                                        <p 
                                            style={{ 
                                                margin: '0 0 4px 0', 
                                                fontSize: '0.75rem', 
                                                fontWeight: 'bold', 
                                                letterSpacing: '0.06em', 
                                                textTransform: 'uppercase',
                                                color: '#606F7B' 
                                            }}
                                        >
                                            Ben's Summary
                                        </p>
                                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5', color: '#2b2b2b' }}>
                                            {aiSummaries[index]}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="constitution-amendment-exact">
                                <p className="constitution-amendment-exact-label">Constitutional text</p>
                                <blockquote>{item.Exact}</blockquote>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const data = [
    {
        Ammendment: "First Amendment",
        Summary: "Protects your right to speak your mind, practice any religion (or none at all), write and publish news, gather peacefully in groups, and ask the government to fix problems.",
        Exact: "Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances."
    },
    {
        Ammendment: "Second Amendment",
        Summary: "Protects your right to keep and bear arms.",
        Exact: "A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed."
    },
    {
        Ammendment: "Third Amendment",
        Summary: "Prevents soldiers from being quartered in private homes without the owner's consent.",
        Exact: "No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law."
    },
    {
        Ammendment: "Fourth Amendment",
        Summary: "Protects against unreasonable searches and seizures.",
        Exact: "The right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized."
    },
    {
        Ammendment: "Fifth Amendment",
        Summary: "Protects against self-incrimination and ensures due process.",
        Exact: "No person shall be held to answer for a capital, or otherwise infamous crime, unless on a presentment or indictment of a Grand Jury, except in cases arising in the land or naval forces, or in the Militia, when in actual service in time of War or public danger; nor shall any person be subject for the same offence to be twice put in jeopardy of life or limb; nor shall be compelled in any criminal case to be a witness against himself, nor be deprived of life, liberty, or property, without due process of law; nor shall private property be taken for public use, without just compensation."
    },
    {
        Ammendment: "Sixth Amendment",
        Summary: "Protects the right to a fair trial.",
        Exact: "In all criminal prosecutions, the accused shall enjoy the right to a speedy and public trial, by an impartial jury of the State and district wherein the crime shall have been committed, which district shall have been previously ascertained by law, and to be informed of the nature and cause of the accusation; to be confronted with the witnesses against him; to have compulsory process for obtaining witnesses in his favor, and to have the Assistance of Counsel for his defence."
    },
    {
        Ammendment: "Seventh Amendment",
        Summary: "Protects the right to trial by jury in civil cases.",
        Exact: "In Suits at common law, where the value in controversy shall exceed twenty dollars, the right of trial by jury shall be preserved, and no fact tried by a jury, shall be otherwise re-examined in any Court of the United States, than according to the rules of the common law."
    },
    {
        Ammendment: "Eighth Amendment",
        Summary: "Protects against excessive bail and cruel punishments.",
        Exact: "Excessive bail shall not be required, nor excessive fines imposed, nor cruel and unusual punishments inflicted."
    },
    {
        Ammendment: "Ninth Amendment",
        Summary: "Protects other rights retained by the people.",
        Exact: "The enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people."
    },
    {
        Ammendment: "Tenth Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    }
];

export default AMaccordian;