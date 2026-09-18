import { useState } from "react";

function AMaccordian(){
    const [selected, setSelected] = useState(null);
    const toggle = (index) => {
        if (selected === index) {
            return setSelected(null);
        }else {
            setSelected(index);
        }
    }
    return(
        <div className="AccordianWrapper">
            <div className="Accordian">
                {data.map((item, index) => (
                    <div key={index} className="AccordianItem">
                        <div className="AccordianHeader" onClick={() => toggle(index)}>
                            <h2>{item.Ammendment}</h2>
                            <span>{selected === index ? '-' : '+'}</span>
                        </div>
                        <div className={selected === index ? 'AccordianContent' : 'AccordianContent-hidden'}>
                            <p>{item.Summary}</p>
                            <br />
                            <p>{item.Exact}</p>
                            <br />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

const data = [
    {
        Ammendment: "First Ammendment",
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
        Exact: "InThe enumeration in the Constitution, of certain rights, shall not be construed to deny or disparage others retained by the people.fo"
    },
    {
        Ammendment: "Tenth Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    
];

export default AMaccordian