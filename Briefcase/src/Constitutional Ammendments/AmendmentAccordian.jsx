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
        Ammendment: "Eleventh Ammendment",
        Summary: "Protects your right to speak your mind, practice any religion (or none at all), write and publish news, gather peacefully in groups, and ask the government to fix problems.",
        Exact: "The Judicial power of the United States shall not be construed to extend to any suit in law or equity, commenced or prosecuted against one of the United States by Citizens of another State, or by Citizens or Subjects of any Foreign State."
    },
    {
        Ammendment: "Twelfth Amendment",
        Summary: "Protects your right to keep and bear arms.",
        Exact: "The Electors shall meet in their respective states and vote by ballot for President and Vice-President, one of whom, at least, shall not be an inhabitant of the same state with themselves; they shall name in their ballots the person voted for as President, and in distinct ballots the person voted for as Vice-President, and they shall make distinct lists of all persons voted for as President, and of all persons voted for as Vice-President, and of the number of votes for each, which lists they shall sign and certify, and transmit sealed to the seat of the government of the United States, directed to the President of the Senate; -- the President of the Senate shall, in the presence of the Senate and House of Representatives, open all the certificates and the votes shall then be counted; -- The person having the greatest number of votes for President, shall be the President, if such number be a majority of the whole number of Electors appointed; and if no person have such majority, then from the persons having the highest numbers not exceeding three on the list of those voted for as President, the House of Representatives shall choose immediately, by ballot, the President. But in choosing the President, the votes shall be taken by states, the representation from each state having one vote; a quorum for this purpose shall consist of a member or members from two-thirds of the states, and a majority of all the states shall be necessary to a choice. [And if the House of Representatives shall not choose a President whenever the right of choice shall devolve upon them, before the fourth day of March next following, then the Vice-President shall act as President, as in the case of the death or other constitutional disability of the President. --]* The person having the greatest number of votes as Vice-President, shall be the Vice-President, if such number be a majority of the whole number of Electors appointed, and if no person have a majority, then from the two highest numbers on the list, the Senate shall choose the Vice-President; a quorum for the purpose shall consist of two-thirds of the whole number of Senators, and a majority of the whole number shall be necessary to a choice. But no person constitutionally ineligible to the office of President shall be eligible to that of Vice-President of the United States."
    },
    {
        Ammendment: "Thirteenth Amendment",
        Summary: "Prevents soldiers from being quartered in private homes without the owner's consent.",
        Exact: "No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law."
    },
    {
        Ammendment: "Fourteenth Amendment",
        Summary: "Protects against unreasonable searches and seizures.",
        Exact: "All persons born or naturalized in the United States, and subject to the jurisdiction thereof, are citizens of the United States and of the State wherein they reside. No State shall make or enforce any law which shall abridge the privileges or immunities of citizens of the United States; nor shall any State deprive any person of life, liberty, or property, without due process of law; nor deny to any person within its jurisdiction the equal protection of the laws.e right of the people to be secure in their persons, houses, papers, and effects, against unreasonable searches and seizures, shall not be violated, and no Warrants shall issue, but upon probable cause, supported by Oath or affirmation, and particularly describing the place to be searched, and the persons or things to be seized. Representatives shall be apportioned among the several States according to their respective numbers, counting the whole number of persons in each State, excluding Indians not taxed. But when the right to vote at any election for the choice of electors for President and Vice-President of the United States, Representatives in Congress, the Executive and Judicial officers of a State, or the members of the Legislature thereof, is denied to any of the male inhabitants of such State, being twenty-one years of age,* and citizens of the United States, or in any way abridged, except for participation in rebellion, or other crime, the basis of representation therein shall be reduced in the proportion which the number of such male citizens shall bear to the whole number of male citizens twenty-one years of age in such State. No person shall be a Senator or Representative in Congress, or elector of President and Vice-President, or hold any office, civil or military, under the United States, or under any State, who, having previously taken an oath, as a member of Congress, or as an officer of the United States, or as a member of any State legislature, or as an executive or judicial officer of any State, to support the Constitution of the United States, shall have engaged in insurrection or rebellion against the same, or given aid or comfort to the enemies thereof. But Congress may by a vote of two-thirds of each House, remove such disability. The validity of the public debt of the United States, authorized by law, including debts incurred for payment of pensions and bounties for services in suppressing insurrection or rebellion, shall not be questioned. But neither the United States nor any State shall assume or pay any debt or obligation incurred in aid of insurrection or rebellion against the United States, or any claim for the loss or emancipation of any slave; but all such debts, obligations and claims shall be held illegal and void. The Congress shall have power to enforce, by appropriate legislation, the provisions of this article."
    },
    {
        Ammendment: "Fifteenth Amendment",
        Summary: "Protects against self-incrimination and ensures due process.",
        Exact: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of race, color, or previous condition of servitude--The Congress shall have power to enforce this article by appropriate legislation."
    },
    {
        Ammendment: "Sixteenth Amendment",
        Summary: "Protects the right to a fair trial.",
        Exact: "The Congress shall have power to lay and collect taxes on incomes, from whatever source derived, without apportionment among the several States, and without regard to any census or enumeration."
    },
    {
        Ammendment: "Seventeenth Amendment",
        Summary: "Protects the right to trial by jury in civil cases.",
        Exact: `The Senate of the United States shall be composed of two Senators from each State, elected by the people thereof, for six years; and each Senator shall have one vote. The electors in each State shall have the qualifications requisite for electors of the most numerous branch of the State legislatures. When vacancies happen in the representation of any State in the Senate, the executive authority of such State shall issue writs of election to fill such vacancies: Provided, That the legislature of any State may empower the executive thereof to make temporary appointments until the people fill the vacancies by election as the legislature may direct. This amendment shall not be so construed as to affect the election or term of any Senator chosen before it becomes valid as part of the Constitution.`
    },
    {
        Ammendment: "Nineteenth Amendment",
        Summary: "Protects against excessive bail and cruel punishments.",
        Exact: "The right of citizens of the United States to vote shall not be denied or abridged by the United States or by any State on account of sex. Congress shall have power to enforce this article by appropriate legislation."
    },
    {
        Ammendment: "Twentieth Amendment",
        Summary: "Protects other rights retained by the people.",
        Exact: "Stopped Here"
    },
    {
        Ammendment: "Twenty-First Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Second Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Third Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Fourth Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Fifth Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Sixth Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    {
        Ammendment: "Twenty-Seventh Amendment",
        Summary: "Protects the rights reserved to the states or the people.",
        Exact: "The powers not delegated to the United States by the Constitution, nor prohibited by it to the States, are reserved to the States respectively, or to the people."
    },
    
];

export default AMaccordian