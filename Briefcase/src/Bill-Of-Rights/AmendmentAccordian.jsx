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
        Ammendment: "Amendment 1",
        Summary: "Info",
        Exact: "Info"
    },
    {
        Ammendment: "Amendment 2",
        Summary: "Info",
        Exact: "Info"
    }
];

export default AMaccordian